import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";
import { Readable } from "stream";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
    secure: true,
});

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    };


    const formData = await req.formData();
    const files = formData.getAll("attachments") as File[];

    const uploadPromises = files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "private_dm_attachments",
                    resource_type: "auto",
                    type: "authenticated", // disables public access
                },
                (err, result) => {
                    if (err || !result) return reject(err);
                    resolve(result.secure_url);
                }
            );

            Readable.from(buffer).pipe(uploadStream);
        });
    });

    try {
        const urls = await Promise.all(uploadPromises);
        return NextResponse.json({ urls });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
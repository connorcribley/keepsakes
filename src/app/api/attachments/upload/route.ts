import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
    secure: true,
});

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    };

    const formData = await req.formData();
    const file = formData.get("file") as File;


    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadResult = await cloudinary.uploader.upload_stream(
            {
                folder: "direct_messages",
                resource_type: "auto",
                use_filename: true,
                unique_filename: false,
                access_mode: "authenticated",
            },
            (error, result) => {
                if (error || !result) {
                    throw new Error(error?.message || "Cloudinary upload failed");
                }

                // send result as response
                return NextResponse.json({ url: result.secure_url, public_id: result.public_id });
            }
        );

        const passthrough = uploadResult as NodeJS.WritableStream;
        passthrough.end(buffer);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
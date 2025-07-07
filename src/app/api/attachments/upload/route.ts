import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";
import { Readable } from "stream";

cloudinary.config({
    secure: true,
});

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"
];

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    };

    const formData = await req.formData();
    const files = formData.getAll("attachments") as File[];

    if (files.length > MAX_FILES) {
        return new Response(
            JSON.stringify({ error: `You can only upload up to ${MAX_FILES} files at a time.` }),
            { status: 400 }
        );
    }

    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
        return new Response(
            JSON.stringify({
                error: `One or more files exceed the 5MB limit.`,
                fileNames: oversizedFiles.map((f) => f.name),
            }),
            { status: 400 }
        );
    }

    const invalidFiles = files.filter((file) => !allowedMimeTypes.includes(file.type));
    if (invalidFiles.length > 0) {
        return new Response(
            JSON.stringify({
                error: "One or more files have unsupported MIME types.",
                invalidTypes: invalidFiles.map((f) => f.type),
            }),
            { status: 400 }
        );
    }

    const uploadPromises = files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "private_dm_attachments",
                    resource_type: "auto",
                    type: "upload",
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
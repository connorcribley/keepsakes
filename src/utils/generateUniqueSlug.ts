import slugify from "slugify";
import { prisma } from "@/lib/prisma";

export default async function generateUniqueSlug(name: string) {
    const baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.user.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`
    }

    return slug;
}
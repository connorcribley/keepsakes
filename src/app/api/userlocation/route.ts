import { NextRequest} from "next/server";
import { auth } from '@/lib/auth';
import { prisma } from "@/lib/prisma";
import { locationSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {

  const session = await auth();
  if (!session?.user?.email) {
    return new Response(JSON.stringify({error: "Unauthorized"}), {status: 401 })
  };

  const body = await req.json()
  
  const validationResult = locationSchema.safeParse(body)

  if (!validationResult.success) {
    return new Response(JSON.stringify({ error: "Invalid location data", details: validationResult.error.format() }), {
      status: 400,
    });
  }

  const {lat, lng} = validationResult.data

  await prisma.$executeRawUnsafe(
    `UPDATE "User" SET "currentLocation" = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE email = $3`,
    lng,
    lat,
    session.user.email
  );

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
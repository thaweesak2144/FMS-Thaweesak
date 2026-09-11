import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/infra/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const timestamp = new Date().toISOString();
  try {
    // Quick DB connectivity ping
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      {
        status: "ok",
        database: "connected",
        timestamp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Healthcheck Error]", error);
    return NextResponse.json(
      {
        status: "degraded",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp,
      },
      { status: 503 }
    );
  }
}

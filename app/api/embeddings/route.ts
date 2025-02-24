// app/api/embeddings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getEmbeddings } from "@/utils/embeddings";

export async function POST(req: NextRequest) {
  try {
    const { interest } = await req.json();
    const embeddings = await getEmbeddings(interest);
    return NextResponse.json(embeddings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get embeddings" },
      { status: 500 }
    );
  }
}

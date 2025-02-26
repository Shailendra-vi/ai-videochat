// app/api/embeddings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getEmbeddings } from "@/utils/embeddings";
import { connectToDatabase } from "@/lib/db";
import VUser from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { name, interests, peerId, socketId } = await req.json();
    const embeddings = await getEmbeddings(interests);

    const user = await VUser.create({
      name,
      interests,
      embeddings: embeddings.embedding,
      peerId,
      socketId,
      isSearching: true,
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get embeddings", message: (error as Error).message },
      { status: 500 }
    );
  }
}

import { connectToDatabase } from "@/lib/db";
import { matchUsers } from "@/utils/functions";
import VUser from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectToDatabase();
    const { userId } = await params;
    const user = await VUser.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // user.isSearching = true;
    // await user.save();

    console.log("USer: ", user);
    matchUsers(userId);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get embeddings", message: (error as Error).message },
      { status: 500 }
    );
  }
}

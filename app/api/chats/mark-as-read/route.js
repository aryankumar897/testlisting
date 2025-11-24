import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Chat from "@/model/chat";



import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";




export async function POST(request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sender_id, listing_id } = body;

    if (!sender_id) {
      return NextResponse.json({ error: "Sender ID is required" }, { status: 400 });
    }

    // Mark messages as read
    await Chat.updateMany(
      {
        sender_id,
        receiver_id: session.user._id,
        ...(listing_id && { listing_id }),
        seen: false
      },
      {
        seen: true
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error marking messages as read:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
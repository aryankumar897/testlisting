

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true,
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, receiverId, listingId, isTyping = true } = body;

    if (!receiverId) {
      return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 });
    }

    // Trigger typing event to specific channels with user-specific data
    const typingData = {
      userId: session.user._id,
      receiverId,
      listingId,
      isTyping, // Add this flag to control show/hide
      userName: session.user.name
    };

    // Trigger to both channels but with specific data
    await Promise.all([
      pusher.trigger('chat-channel', 'typing', typingData),
      pusher.trigger('agent-chat-channel', 'typing', typingData)
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending typing indicator:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
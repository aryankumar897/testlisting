import Pusher from "pusher";


import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Chat from "@/model/chat";
import { authOptions } from "@/utils/authOptions";

import { getServerSession } from "next-auth/next";








export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const session = await getServerSession(authOptions);

  if (!session || !session.user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sender_id = session?.user?._id;
    const receiver_id = searchParams.get("receiver_id");
    const listing_id = searchParams.get("listing_id");

    let query = {};

    if (sender_id && receiver_id) {
      query = {
        $or: [
          { sender_id: sender_id, receiver_id: receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id },
        ],
      };
    } else if (sender_id) {
      query = {
        $or: [{ sender_id: sender_id }, { receiver_id: sender_id }],
      };
    } else {
      return NextResponse.json(
        { error: "Invalid parameters. sender_id is required" },
        { status: 400 }
      );
    }

    if (listing_id) {
      query.listing_id = listing_id;
    }

    // Populate all references
    const messages = await Chat.find(query)
      .sort({ createdAt: 1 })
      .populate('sender_id', 'name email image')
      .populate('receiver_id', 'name email image')
      .populate('listing_id', 'title image thumbnail_image price is_verified status views address')
      .lean();

    return NextResponse.json(messages);
  } catch (err) {
    console.log("Error fetching messages", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
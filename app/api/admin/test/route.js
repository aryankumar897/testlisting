
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Chat from "@/model/chat";
import User from "@/model/user";

import mongoose from "mongoose";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth/next";

export async function GET(request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = new mongoose.Types.ObjectId(session.user._id);

    // Get distinct user IDs who have conversations with current user
    const userChats = await Chat.distinct('sender_id', {
      $or: [
        { receiver_id: currentUserId },
        { sender_id: currentUserId }
      ]
    });

    const usersWithMessages = [];
    const unreadCounts = {};

    for (const userId of userChats) {
      if (userId.toString() === session.user._id) continue; // Skip current user

      // Get last message in conversation
      const lastMessage = await Chat.findOne({
        $or: [
          { sender_id: userId, receiver_id: currentUserId },
          { sender_id: currentUserId, receiver_id: userId }
        ]
      })
      .sort({ createdAt: -1 })
      .populate('sender_id', 'name email image')
      .populate('receiver_id', 'name email image')
      .populate('listing_id')
      .lean();

      if (!lastMessage) continue;

      // Count unread messages for current user
      const unreadCount = await Chat.countDocuments({
        sender_id: userId,
        receiver_id: currentUserId,
        seen: false
      });

      // Count total messages in conversation
      const messageCount = await Chat.countDocuments({
        $or: [
          { sender_id: userId, receiver_id: currentUserId },
          { sender_id: currentUserId, receiver_id: userId }
        ]
      });

      const user = lastMessage.sender_id._id.toString() === userId.toString() 
        ? lastMessage.sender_id 
        : lastMessage.receiver_id;

      // Get listing owner if listing exists
      let listingOwner = null;
      if (lastMessage.listing_id) {
        listingOwner = await User.findById(lastMessage.listing_id.user_id)
          .select('name email image')
          .lean();
      }

      usersWithMessages.push({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        last_listing: lastMessage.listing_id || null,
        last_message: lastMessage.message,
        last_message_sender_id: lastMessage.sender_id._id,
        message_count: messageCount,
        unreadCount: unreadCount,
        last_active: lastMessage.createdAt,
        is_online: Math.random() > 0.5
      });

      unreadCounts[user._id.toString()] = unreadCount;
    }

    // Sort by last message date (most recent first)
    usersWithMessages.sort((a, b) => new Date(b.last_active) - new Date(a.last_active));

    const users = usersWithMessages.map(user => ({
      ...user,
      unreadCount: undefined // Remove from user object as it's in separate object
    }));

    console.log("Agent chat data for user:", session.user._id, { users, unreadCounts });
    return NextResponse.json({ users, unreadCounts });
  } catch (err) {
    console.error("Error in agent users-with-messages:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
//import { NextResponse } from "next/server";

//import dbConnect from "@/utils/dbConnect";

//import Chat from "@/model/chat";
import mongoose from "mongoose";
//import { authOptions } from "@/utils/authOptions";

//import { getServerSession } from "next-auth/next";

// export async function POST(req) {
//   await dbConnect();

//   const session = await getServerSession(authOptions);

//   const body = await req.json();

//   console.log("body", body);

//   const { message, listing_id, receiver_id } = body;

//   console.log("body in messages route", body);

//   try {
//     if (!session?.user?._id) {
//       return NextResponse.json({ err: "not authenticated" }, { status: 401 });
//     }

//     const chat = await Chat.create({
//       message,
//       listing_id,
//       receiver_id,
//       sender_id: session?.user?._id,
//     });

//     return NextResponse.json(
//       { msg: "message sent succesfuly!!" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("error");

//     return NextResponse.json({ err: error.message }, { status: 500 });
//   }
// }














import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Chat from "@/model/chat";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import Pusher from "pusher";

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true,
});

export async function POST(request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { receiver_id, listing_id, message } = body;

    if (!receiver_id || !message) {
      return NextResponse.json({ error: "Receiver ID and message are required" }, { status: 400 });
    }

    // Create new message
    const newMessage = await Chat.create({
      sender_id: session.user._id,
      receiver_id,
      listing_id: listing_id || null,
      message,
      seen: false
    });

    // Populate the message for response
    const populatedMessage = await Chat.findById(newMessage._id)
      .populate('sender_id', 'name email image')
      .populate('receiver_id', 'name email image')
      .populate('listing_id', 'title image price')
      .lean();

    // Trigger Pusher event to both channels
    await Promise.all([
      // For user channel
      pusher.trigger('chat-channel', 'new-message', {
        message: populatedMessage
      }),
      // For agent channel
      pusher.trigger('agent-chat-channel', 'new-message', {
        message: populatedMessage
      })
    ]);

    console.log("✅ Message sent and Pusher triggered");

    return NextResponse.json(populatedMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}











export async function GET(request) {
  await dbConnect();

  try {
    // Get the logged-in user's session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = new mongoose.Types.ObjectId(session.user._id);

    // Find all unique listings that have conversations with the logged-in user
    const chats = await Chat.aggregate([
      {
        $match: {
          $or: [
            { receiver_id: currentUserId },
            { sender_id: currentUserId }
          ]
        }
      },
      {
        $lookup: {
          from: "listings",
          localField: "listing_id",
          foreignField: "_id",
          as: "listing"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "sender_id",
          foreignField: "_id",
          as: "sender"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "receiver_id",
          foreignField: "_id",
          as: "receiver"
        }
      },
      {
        $unwind: {
          path: "$listing",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$sender",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$receiver",
          preserveNullAndEmptyArrays: true
        }
      },
      // Add owner lookup before grouping
      {
        $lookup: {
          from: "users",
          localField: "listing.user_id",
          foreignField: "_id",
          as: "owner"
        }
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$listing_id",
          listing: { $first: "$listing" },
          lastMessage: { $last: "$$ROOT" },
          // Find the other user in conversation (not current user)
          other_user: {
            $first: {
              $cond: [
                { $eq: ["$sender_id", currentUserId] },
                "$receiver", // If current user is sender, other user is receiver
                "$sender"    // If current user is receiver, other user is sender
              ]
            }
          },
          owner: { $first: "$owner" }, // Get owner from the pre-populated field
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ["$seen", false] },
                    { $eq: ["$receiver_id", currentUserId] }
                  ]
                }, 
                1, 
                0
              ]
            }
          },
          message_count: { $sum: 1 }
        }
      },
      { 
        $sort: { "lastMessage.createdAt": -1 }
      },
      {
        $project: {
          _id: "$listing._id",
          title: "$listing.title",
          image: "$listing.image",
          
        
          is_verified: "$listing.is_verified",
          status: "$listing.status",
          views: "$listing.views",
          
         
          last_message: "$lastMessage.message",
          last_message_sender_id: "$lastMessage.sender_id",
          other_user: {
            _id: "$other_user._id",
            name: "$other_user.name",
            email: "$other_user.email",
            image: "$other_user.image"
          },
          owner: {
            _id: "$owner._id",
            name: "$owner.name",
            email: "$owner.email",
            image: "$owner.image"
          },
          message_count: 1,
          unreadCount: 1,
          last_active: "$lastMessage.createdAt"
        }
      }
    ]);

    // Create listings array and unread counts object
    const listings = chats.map(chat => ({
      _id: chat._id,
      title: chat.title,
      image: chat.image,
     
      
      is_verified: chat.is_verified,
      status: chat.status,
      views: chat.views,
      
      
      last_message: chat.last_message,
      last_message_sender_id: chat.last_message_sender_id,
      other_user: chat.other_user,
      owner: chat.owner,
      message_count: chat.message_count,
      last_active: chat.last_active
    }));

    const unreadCounts = chats.reduce((acc, chat) => {
      acc[chat._id.toString()] = chat.unreadCount;
      return acc;
    }, {});

    console.log("Listings chat data for user:", session.user._id, { listings, unreadCounts });
    return NextResponse.json({ listings, unreadCounts });
  } catch (err) {
    console.error("Error in listings-with-messages:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
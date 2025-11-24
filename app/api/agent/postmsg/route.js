



// import Chat from "@/model/chat";
// import { authOptions } from "@/utils/authOptions";
// import { getServerSession } from "next-auth/next";
// import dbConnect from "@/utils/dbConnect";
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
      listing_id: listing_id ,
      message,
      seen: false
    });

    // Populate the message for response
    const populatedMessage = await Chat.findById(newMessage?._id)
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


import Pusher from "pusher";

// const pusher = new Pusher({
//   appId: process.env.APP_ID,
//   key: process.env.KEY,
//   secret: process.env.SECRET,
//   cluster: process.env.CLUSTER,
//   useTLS: true,
// });





import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Chat from "@/model/chat";



export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    
    // Get sender_id and receiver_id directly
    const sender_id = searchParams.get("sender_id");
    const receiver_id = searchParams.get("receiver_id");
    const listing_id = searchParams.get("listing_id");

    let query = {};

    if (sender_id && receiver_id) {
      // Get conversation between two specific users
      query = {
        $or: [
          { sender_id: sender_id, receiver_id: receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id }
        ]
      };
    } else if (sender_id) {
      // Get all messages where user is either sender or receiver
      query = {
        $or: [
          { sender_id: sender_id },
          { receiver_id: sender_id }
        ]
      };
    } else {
      return NextResponse.json(
        { error: "Invalid parameters. sender_id is required" },
        { status: 400 }
      );
    }

    // Add listing_id filter if provided
    if (listing_id) {
      query.listing_id = listing_id;
    }





 // Populate all references
   // const messages = await Chat.find(query)
   //   .sort({ createdAt: 1 })
   //   .populate('sender_id', 'name email image')
   //   .populate('receiver_id', 'name email image')
   //   .populate('listing_id', 'title image thumbnail_image price is_verified status views address')
//.lean();

//return NextResponse.json(messages);





const messages = await Chat.find(query).sort({ createdAt: 1 });
return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}































// export async function POST(request) {
//   await dbConnect();

//   try {
//     const body = await request.json();
//     const newMessage = await Chat.create(body);

//     // Trigger Pusher event
//     const pusher = new Pusher({
//       appId: process.env.APP_ID,
//       key: process.env.KEY,
//       secret: process.env.SECRET,
//       cluster: process.env.CLUSTER,
//       useTLS: true,
//     });

//     await pusher.trigger("chat-channel", "new-message", {
//       message: newMessage,
//     });

//     return NextResponse.json(newMessage);
//   } catch (err) {
//     return NextResponse.json({ err: err.message }, { status: 500 });
//   }
// }





// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/utils/authOptions";



// export async function GET(request) {
//   await dbConnect();

//   const { searchParams } = new URL(request.url);
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user?._id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const sender_id = session?.user?._id;
//     const receiver_id = searchParams.get("receiver_id");
//     const listing_id = searchParams.get("listing_id");

//     let query = {};

//     if (sender_id && receiver_id) {
//       query = {
//         $or: [
//           { sender_id: sender_id, receiver_id: receiver_id },
//           { sender_id: receiver_id, receiver_id: sender_id },
//         ],
//       };
//     } else if (sender_id) {
//       query = {
//         $or: [{ sender_id: sender_id }, { receiver_id: sender_id }],
//       };
//     } else {
//       return NextResponse.json(
//         { error: "Invalid parameters. sender_id is required" },
//         { status: 400 }
//       );
//     }

//     if (listing_id) {
//       query.listing_id = listing_id;
//     }

//     // Populate all references
//     const messages = await Chat.find(query)
//       .sort({ createdAt: 1 })
//       .populate('sender_id', 'name email image')
//       .populate('receiver_id', 'name email image')
//       .populate('listing_id', 'title image thumbnail_image price is_verified status views address')
//       .lean();

//     return NextResponse.json(messages);
//   } catch (err) {
//     console.log("Error fetching messages", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
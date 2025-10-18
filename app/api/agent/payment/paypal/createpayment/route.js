import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import paypal from "@paypal/checkout-server-sdk"; // Import PayPal SDK for handling PayPal transactions
import Package from "@/model/package";
// Set up PayPal environment with client ID and secret (sandbox mode for testing)
let environment = new paypal.core.SandboxEnvironment(
  "AceW9nJb3-RlOq1F9qpl40eCvABcWpTtxCO5rTu47RpdFOoAiQGJSRRKqAPVodkMWTUbVCAyNpBRaZDL", // PayPal client ID (Sandbox)
  "EHGdvjb7JZ2dnhivVEyI_LAJPEWLxOzkxcFkcivqc_HH4nnqUbcYscfqVsOLwxbqiFY7OqHMJkluJoT0" // PayPal client secret (Sandbox)
);

// Create PayPal client to interact with the PayPal API
let client = new paypal.core.PayPalHttpClient(environment);

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { id } = body;
  try {
    const session = await getServerSession(authOptions);
    console.log("session", session);

    if (!session?.user?._id) {
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findOne({ _id: session?.user?._id });

    // If the user is not found, return an error response
    if (!user) {
      return NextResponse.json({ err: "user not found" }, { status: 500 });
    }

    const pkg = await Package.findOne({ _id: id }).sort({
      createdAt: -1,
    });

    console.log("packagedata", pkg);

    // Set up the PayPal order creation request
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation"); // Indicate that the API should return a representation of the order

    // Define the request body for the PayPal order creation
    request.requestBody({
      application_context: {
        // Redirect URLs for successful and canceled payments
        return_url: "http://localhost:3000/dashboard/agent/paypal/success",
        cancel_url: "http://localhost:3000/dashboard/agent/paypal/canceled",
      },
      intent: "CAPTURE", // Intent to capture the payment after approval
      purchase_units: [
        {
          // Associate the course with the PayPal order using reference ID
          reference_id: pkg && pkg?._id.toString(),
          amount: {
            currency_code: "USD", // Set the currency as USD
            value: Math.round(pkg.price), // Set the course price
          },
        },
      ],
    });

    // Execute the PayPal order creation request
    const order = await client.execute(request);
    console.log("order===>", order.result.links); // Log the

    // Return the approval URL (second link) from the PayPal order response to the client
    return NextResponse.json({ id: order?.result.links[1].href });
  } catch (err) {
    console.log("errorrrr", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import User from "@/model/user";

import bcrypt from "bcrypt";

import { authOptions } from "@/utils/authOptions";

import { getServerSession } from "next-auth/next";

export async function PUT(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const body = await req.json();

  console.log("body", body);

  const { name, image } = body;

  try {
    if (!session?.user?._id) {
      return NextResponse.json({ err: "not authenticated" }, { status: 401 });
    }

    let updatedUser = await User.findByIdAndUpdate(
      session?.user?._id,
      {
        name,
        image,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ err: "user not found" }, { status: 404 });
    }

    console.log("updatedUser", updatedUser);

    return NextResponse.json(
      { msg: "user updated succesfuly" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error");

    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

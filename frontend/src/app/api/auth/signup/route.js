import dbConnect from '../../../../lib/db';
import { NextResponse } from "next/server";
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, companyName, contactNumber, password, iecCode } = await req.json();

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Create and save the user
    const user = new User({ name, email, companyName, contactNumber, password, iecCode });
    await user.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

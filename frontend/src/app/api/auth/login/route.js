import dbConnect from '../../../../lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    // Parse request body
    const { email, password } = await req.json();

    // Find user in the database
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      'prachi',
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

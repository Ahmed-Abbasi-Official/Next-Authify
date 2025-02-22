import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/user.model'
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

// SIGNUP ROUTE

export async function POST(request: NextRequest) {
   try {
    const reqBody = await request.json();

    const { username, email, password } = reqBody;

    // * VALIDATION

    const user = await User.findOne({ email });

    if (user) {
        return NextResponse.json({
            error: "User already exists"
        },{ status: 400})
    }

    // * HASH PASSWORD

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);

    // * CREATE NEW USER

    const newUser = await User({
        username,
        email,
        password:hashPassword
    });

    const savedUser = await newUser.save();
    
    // * VALIDATION FOR CREATING USER

    if(!savedUser){
         throw new Error ("Failed to create new user");
    }

    console.log(savedUser);

    // * SEND EAMIL

   const a= await sendEmail({email,emailType:"VERIFY",userId:savedUser?._id});
   console.log(a)

    return NextResponse.json({
        message:"User Register Sucessfully",
        success:true,
        savedUser
    })

   } catch (error:any) {
    return NextResponse.json({error:error.message},{status:500})
   }

}
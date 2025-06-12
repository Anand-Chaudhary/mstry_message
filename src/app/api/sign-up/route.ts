import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    
    await dbConnect()

    try {
        const { username, email, password } = await request.json()

        const verifiedExistingUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(verifiedExistingUserByUsername){
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                }, {status: 400}
            )
        }

        const verifiedExistingUserByEmail = await UserModel.findOne({
            email,
        })

        const verifiedCode = Math.floor(100000 + Math.random()*900000).toString()

        if(verifiedExistingUserByEmail){
            if(verifiedExistingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User exists"
                }, {status: 400})
            } else{
                const hashedPassword = await bcrypt.hash(password, 10);
                verifiedExistingUserByEmail.password = hashedPassword
                verifiedExistingUserByEmail.verifiedCode = verifiedCode
                verifiedExistingUserByEmail.expiry = new Date(Date.now() + 3600000)

                await verifiedExistingUserByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username, 
                email, 
                password: hashedPassword, 
                verifiedCode, 
                expiry: expiryDate, 
                isAcceptingMessage: true, 
                messages: []
            })
            await newUser.save()
        }

        const emailResponse = await sendVerificationEmail(email, username, verifiedCode)
        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please check your email for verification."
        }, {status: 201})

    } catch {
        return Response.json(
            {
                success: false,
                message: "Error in registering user"
            },
            {
                status: 500
            }
        )
    }
}
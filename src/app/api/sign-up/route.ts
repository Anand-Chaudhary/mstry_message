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

        const veriyfiedCode = Math.floor(100000 + Math.random()*900000).toString()

        if(verifiedExistingUserByEmail){
            if(verifiedExistingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User exists"
                }, {status: 400})
            } else{
                const hashedPaasword = await bcrypt.hash(password, 10);
                verifiedExistingUserByEmail.password = hashedPaasword
                verifiedExistingUserByEmail.veriyfiedCode = veriyfiedCode
                verifiedExistingUserByEmail.expiry = new Date(Date.now() + 3600000)

                await verifiedExistingUserByEmail.save()
            }
        }else{
            const hashedPaasword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours( expiryDate.getHours() +1 );
            const newUser = new UserModel({
                username, email, password: hashedPaasword, veriyfiedCode, expiry: expiryDate, isAcceptingMessage: true, message: []
            })
            await newUser.save()

            const emailResponse = sendVerificationEmail(email, username, veriyfiedCode)

            if(!(await emailResponse).success){
                return Response.json({
                    success: false,
                    message: (await emailResponse).message
                }, {status: 500})
            }

             return Response.json({
                    success: true,
                    message: "User verified"
                }, {status: 201})
        }
    } catch (err) {
        console.log("Error in registering user: ", err);
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
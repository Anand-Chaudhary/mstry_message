import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";


export async function POST(request:Request) {
    await dbConnect()
    try{
        const {username, verificationCode} = await request.json()
        const user = await UserModel.findOne({
            username
        })

        if(!user){
            return Response.json({
                success:false,
                message: "User not found"
            }, {status: 500})
        }
        const isCodeValid = user.verifiedCode === verificationCode;
        const isCodeNotExpired = new Date(user.expiry) > new Date()
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save()
            return Response.json({
                success: true,
                message: "Verification Successfull"
            }, {status: 200})
        } else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification Code Expired"
            }, {status: 401})
        } else{
            return Response.json({
                success: false,
                message: "Verification Code Incorrect"
            }, {status: 401})
        }
    } catch(err){
        console.log("Verification failed", err);
        return Response.json({
            success: false,
            message: "Verification Failed"
        }, {status: 500})
    }
}
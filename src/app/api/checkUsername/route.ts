import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { z } from "zod"
import { userNameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: userNameValidation
})

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        //validate with zod
        const res = UsernameQuerySchema.safeParse(queryParam);
        if (!res.success) {
            const usernameError = res.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(', ') : "Invalid username"
            }, { status: 400 })
        }

        const { username } = res.data
        const existingUser = await UserModel.findOne({ username, isVerified: true })
        if (existingUser) {
            return Response.json({
                success: false,
                message: "Username exists"
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "Username valid"
        }, { status: 201 })

    } catch (err) {
        console.log("Error checking username", err);
        return Response.json({
            success: false,
            message: "Username exists"
        }, { status: 500 })
    }
}
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const userId = user._id;
    const { isAcceptingMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Unable to update the state of user"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            message: "Updated as per user",
            updatedUser
        }, { status: 401 })
    } catch (error) {
        console.log("Unable to update state of user: ", error);

        return Response.json({
            success: false,
            message: "Failed to update user status"
        }, { status: 401 })
    }
}

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage
        }, { status: 200 })
    } catch (error) {
        console.log("Unable to update state of user: ", error);

        return Response.json({
            success: false,
            message: "Failed to update user status"
        }, { status: 500 })
    }
}
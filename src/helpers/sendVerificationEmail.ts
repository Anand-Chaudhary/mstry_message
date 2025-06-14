import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string,
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mstry Message | Verification Code',
            react: VerificationEmail({username, otp: verificationCode})
        });
        return { success: true, message: "Verification Email sent successfuly" }
    } catch (emailError) {
        console.log("Error in sending verification email: ", emailError)
        return { success: false, message: "Failed to send verification email" }
    }
}
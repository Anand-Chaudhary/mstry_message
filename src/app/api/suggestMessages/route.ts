import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST() {
    try {
        const text = await generateText({
            model: google("models/gemini-2.0-flash-exp"),
            prompt: `
                Create a string of three open-ended and engaging questions, each separated by ' || '. These questions are for an anonymous social messaging platform (like Qooh.me) and must be unique every time this instruction is run. Focus on universal, non-personal themes that promote curiosity, friendly interaction, and a positive environment. Avoid repetition, sensitive topics, or anything too specific. Use creative phrasing and vary the subject matter to keep it fresh. Each output must be distinct from previous ones.
            `
        })
        return Response.json({
            success: true,
            message: text.text
        }, { status: 200 })
    } catch (err) {
        console.log("An unexpected error occured: ", err);
        return Response.json({
            success: false,
            message: "Ai didnt return any response"
        }, { status: 500 })
    }
}

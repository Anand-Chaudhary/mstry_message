import {z} from "zod";

export const MessageSchema = z.object({
    content: z
        .string()
        .min(10, {message: "Content must be of atleast 10 characters"})
        .max(300, {message: "Content should not exceed 300 characters"})
})
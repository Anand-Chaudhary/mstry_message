import { z } from "zod";

export const userNameValidation = z
    .string()
    .max(20, "Username cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({
        message: "Invalid Email Address"
    }),
    password: z.string().min(6, {message: "Password must be of 6 characters"})
})
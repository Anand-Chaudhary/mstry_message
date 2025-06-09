"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast, useSonner } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@react-email/components"
import { Loader2 } from 'lucide-react'

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 300);
    const { toast } = useSonner();
    const router = useRouter();

    //zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            userName: '',
            email: '',
            password: ''
        }
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (!username) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const res = await axios.get(`/api/checkUsername?username=${username}`)
                    console.log(res.data.message);
                    
                    setUsernameMessage(res.data.message)
                } catch (err) {
                    const axiosError = err as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "Error Checking Username")
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique();
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const res = await axios.post<ApiResponse>("/api/sign-up", data)
            toast({
                title: 'Success',
                description: res.data.message
            })
            router.replace(`/verify/${username}`);
            setIsSubmitting(false)
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message
            toast({
                title: 'Signup Failed',
                description: errorMessage,
                variant: "destructive",
            })
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystery Message</h1>
                        <p className="mb-4">Signup to start your anonymous adventure</p>
                    </div>
                    <Form {...form}>
                        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Username"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value); // ✅ Pass value, not event
                                                    debounced(e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                        {
                                            isCheckingUsername && <Loader2 className="animate-spin" />
                                        }
                                        <p className={`text-sm ${usernameMessage === "Username valid" ? `text-green-500`: `text-red-500`}`}>
                                            test {username} is {usernameMessage}
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Password"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button style={
                                {
                                    padding: "9px"
                                }
                            } className="bg-black rounded-lg text-white" type="submit">
                                {
                                    isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                        </>
                                    ) : ("Signup")
                                }
                            </Button>
                        </form>
                    </Form>
                    <div className="text-center mt-4">
                        <p>
                            Already a member? {' '}
                            <Link href='/sign-in' className="text-blue-600 hover:text-blue-800">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
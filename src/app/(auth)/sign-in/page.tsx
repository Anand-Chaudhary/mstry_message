"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const Signin = () => {
    
    const router = useRouter();

    //zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const res = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if(res?.error){
            if(res.error == 'CredentialsSignin'){
                toast.error("Incorret Email or Password");
            } else{
                toast.error(res.error)
            }
        }

        if(res?.url){
            router.replace('/dashboard')
        }

        console.log(res);
    }

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font font-extrabold tracking-tight lg:text-5xl mb-6">Welcome Back</h1>
                        <p className="mb-4">Enter your details</p>
                    </div>
                    <Form {...form}>
                        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            
                            <FormField
                                name="identifier"
                                control={form.control}
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
                            <Button 
                                className="w-full bg-black hover:bg-gray-800 text-white" 
                                type="submit"
                            >
                                Sign-In
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default Signin;
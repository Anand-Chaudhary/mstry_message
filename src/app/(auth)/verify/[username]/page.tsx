"use client"

import { verifySchema } from '@/schemas/verifySchema';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Verify = () => {
    const router = useRouter();
    const params = useParams<{username: string}>();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            verifiedCode: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>)=>{
        try{
            const res = await axios.post('/api/verification', {
                username: params.username,
                verificationCode: data.verifiedCode
            })
            toast.success(res.data.message)
            router.replace('/sign-in')
        } catch(err){
            const axiosError = err as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast.error(errorMessage || "Verification failed")
        }
    }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className="w-full max-w-md p-8 space-y-8 bg-whit rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify Your Account
                </h1>
                <p className="mb4">
                    Enter the verification code which was sent to your email
                </p>

            </div>
            <div>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="verifiedCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="code" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    </div>
  )
}

export default Verify
"use client";

import { useState } from "react";
import { z } from 'zod';
import { api } from "~/trpc/react";
import { signIn } from "next-auth/react";

import { Button } from "./button";

export function SignupForm() {
    const signup = api.user.signup.useMutation();
    const [error, setErrors] = useState<string[]>([]);

    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        const result = schema.safeParse(data);
        if (!result.success) {
            const errorMessages = result.error.errors.map((error) => error.message);
            setErrors(errorMessages);
        } else {
            setErrors([]);
            try {
                await signup.mutateAsync(data);
    
                // If user creation is successful, sign in the user
                await signIn("credentials", {
                    ...data,
                    callbackUrl: "/",
                });
            } catch (error) {
                setErrors([
                    String((error as { message?: string })?.message ?? "An error occurred")
                ]);
            }    
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray">
            {error.length > 0 && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error</strong>
                    <ul>
                        {error.map((message, index) => (
                            <li key={index}>{message}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mb-4">
                <label className="block text-lg mb-1" htmlFor="body">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="border rounded p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-lg mb-1" htmlFor="body">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="border rounded p-2 w-full"
                />
            </div>
            <div className="flex items-center justify-between">
                
                <Button type="primary"><button type="submit">Sign Up</button></Button>
            </div>
        </form>
    )
}
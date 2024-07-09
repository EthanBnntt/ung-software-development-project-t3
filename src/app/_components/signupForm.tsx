"use client";

import { useState } from "react";
import { z } from 'zod';
import { api } from "~/trpc/react";
import { signIn } from "next-auth/react";

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
        <form onSubmit={handleSubmit}>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign Up
                </button>
            </div>
        </form>
    )
}
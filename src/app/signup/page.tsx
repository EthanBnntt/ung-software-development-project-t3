import React from 'react';
import { HydrateClient } from "~/trpc/server";

import { SignupForm } from "~/app/_components/signupForm";

export default async function SignupPage () {
    return (
        <HydrateClient>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                    <SignupForm></SignupForm>
                </div>
            </div>
        </HydrateClient>
    );
};

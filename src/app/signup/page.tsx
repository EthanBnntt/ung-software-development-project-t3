import React from 'react';
import { HydrateClient } from "~/trpc/server";

import { SignupForm } from "~/app/_components/signupForm";

export default async function SignupPage () {
    return (
        <HydrateClient>
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded w-full max-w-md border border-gray">
                    <h2 className="text-2xl mb-2 text-center">Sign Up</h2>
                    <SignupForm></SignupForm>
                </div>
            </div>
        </HydrateClient>
    );
};

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Button } from './button';

export function CreateThreadForm({ communityId, isAuthenticated, onSubmit }: { communityId: number, isAuthenticated: boolean, onSubmit: () => void }) {
    const [title, setTitle] = useState('');
    const createThread = api.discussionThread.createDiscussionThread.useMutation();
    const router = useRouter();

    // Confirm we are logged in
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const session = await getSession();
        if (!session) {
            router.push('/api/auth/signin');
            return;
        }
        try {
            await createThread.mutateAsync({
                title,
                communityId,
            });
            router.push(`/community/${communityId}`);
            onSubmit();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 py-4">
                <form className="mt-4" onSubmit={handleSubmit}>
                    {isAuthenticated ? (
                        <>
                            <h2 className="text-2xl mb-2">Create a New Thread</h2>
                            <div className="mb-2">
                                <label className="block text-lg mb-1" htmlFor="title">Title:</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="border rounded p-2 w-full"
                                    required
                                />
                            </div>
                            <Button type="primary"><button type="submit">Submit</button></Button>
                        </>
                    ) : (
                        <h2 className="text-2xl mb-2">You must be logged in to create a new thread.</h2>
                    )}
                </form>
            </div>
        </div>
    );
}
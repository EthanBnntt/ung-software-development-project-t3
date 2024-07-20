"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from "~/trpc/react";
import { Button } from './button';

export function RequestAccessForm({ communityId }: { communityId: number }) {
    const [accessCode, setAccessCode] = useState('');

    const requestAccess = api.community.accessCommunity.useMutation();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!accessCode) {
            alert('Please enter an access code');
            return;
        }
        try {
            const successfullyAccessed = await requestAccess.mutateAsync({
                communityId,
                accessCode,
            });
            if (successfullyAccessed) {
                router.push(`/community/${communityId}`);
            } else {
                alert('Incorrect access code');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3">
                <form className="mt-4">
                    <div className="mb-4">
                        <label className="block text-lg mb-1" htmlFor="title">Access Code:</label>
                        <input
                            type="text"
                            id="title"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            className="border rounded p-2 w-full"
                            required
                        />
                    </div>
                    <Button type="primary" onClick={handleSubmit}>Request Access</Button>
                </form>
            </div>
        </div>
    );
}
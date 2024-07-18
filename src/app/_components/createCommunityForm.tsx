"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from "~/trpc/react";
import { Button } from './button';

export function CreateCommunityForm() {
    const [name, setName] = useState('');
    const [genreNames, setGenreNames] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const createCommunity = api.community.createCommunity.useMutation();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!name) {
            alert('Please enter a name');
            return;
        }
        if (genreNames.length === 0) {
            alert('Please enter at least one genre');
            return;
        }
        try {
            const community = await createCommunity.mutateAsync({
                name,
                genreNames: genreNames.split(',').map(genreName => genreName.trim()),
                accessCode: accessCode != '' ? accessCode : undefined,
            });
            if (!community)
                throw new Error('Failed to create community');
            const id = community.id;
            router.push(`/community/${id}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3">
                <form className="mt-4">
                    <div className="mb-4">
                        <label className="block text-lg mb-1" htmlFor="title">Name:</label>
                        <input
                            type="text"
                            id="title"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border rounded p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg mb-1" htmlFor="genreNames">Genres:</label>
                        <input
                            type="text"
                            id="genreNames"
                            value={genreNames}
                            onChange={(e) => setGenreNames(e.target.value)}
                            className="border rounded p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg mb-1" htmlFor="accessCode">Access Code (Optional):</label>
                        <input
                            type="text"
                            id="accessCode"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            className="border rounded p-2 w-full"
                        />
                    </div>
                    <Button type="primary" onClick={handleSubmit}>Create Community</Button>
                </form>
            </div>
        </div>
    );
}
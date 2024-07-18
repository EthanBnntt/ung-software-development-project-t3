"use client";

import React from 'react';
import Link from 'next/link';

import { api } from '~/trpc/react';

import { CreateThreadForm } from './createThreadForm';

export function ListThreads({ communityId, isAuthenticated }: { communityId: number, isAuthenticated: boolean }) {
    const threadsQuery = api.discussionThread.getThreadsByCommunityId.useQuery({
        communityId,
    });

    if (threadsQuery.isLoading) {
        return <div>Loading...</div>;
    }

    if (threadsQuery.error) {
        return <div>Error: {threadsQuery.error.message}</div>;
    }

    const threads = threadsQuery.data;

    if (!threads) {
        return <div>Problem while finding threads.</div>;
    }

    return (
        <div className="container mx-auto">
            <CreateThreadForm communityId={communityId} isAuthenticated={isAuthenticated} onSubmit={() => threadsQuery.refetch()} />
            <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 py-4">
                    <h2 className="text-2xl mb-2">Threads</h2>
                    {threads.length === 0 ? (
                        <div>No threads</div>
                    ) : (
                        <div className="py-4">
                            {threads.map(thread => (
                                <Link key={thread.id} href={`/community/${communityId}/thread/${thread.id}`} className="block p-4 rounded-md hover:bg-gray-100 transition">
                                    <h2 className="text-lg font-semibold">{thread.title}</h2>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
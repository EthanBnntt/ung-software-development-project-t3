"use client";

import React from 'react';
import { api } from '~/trpc/react';

export function ListThreads({ isbn }: { isbn: string }) {
    const threadsQuery = api.discussionThread.getThreadsByBookISBN.useQuery({
        bookISBN: isbn,
    });

    if (threadsQuery.isLoading) {
        return <div>Loading...</div>;
    }

    if (threadsQuery.error) {
        return <div>Error: {threadsQuery.error.message}</div>;
    }

    const threads = threadsQuery.data;

    if (!threads || threads.length === 0) {
        return <div>No threads found</div>;
    }

    console.log(threads);

    return (
        <div className="mt-4">
            <h2 className="text-2xl mb-2">Discussion Threads</h2>
            <div className="space-y-4">
                {threads.map((thread) => (
                    <div key={thread.id} className="p-4 border rounded-md shadow-sm">
                        <h2 className="text-lg font-semibold">{thread.title}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
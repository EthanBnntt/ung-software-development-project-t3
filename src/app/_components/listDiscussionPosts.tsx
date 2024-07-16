"use client";

import React, { useState } from 'react';

import { api } from '~/trpc/react';

import { Button } from './button';

export function CreateDiscussionPostForm({ threadId, isAuthenticated, onSubmit }: { threadId: number, isAuthenticated: boolean, onSubmit: () => void }) {
    const [content, setContent] = useState('');

    const createPost = api.discussionPost.createDiscussionPost.useMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert('You must be logged in to create a post.');
            return;
        }
        try {
            await createPost.mutateAsync({
                threadId,
                content,
            });
            setContent('');
            onSubmit();
        } catch (err) {
            console.error(err);
        }
    };

    if (!isAuthenticated) {
        return (
            <div>
                <p>You must be logged in to create a post.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 py-4">
                <form className="mt-4" onSubmit={handleSubmit}>
                    <h2 className="text-2xl mb-2">Create a New Post</h2>
                    <div className="mb-2">
                        <label className="block text-lg mb-1" htmlFor="body">Body:</label>
                        <textarea
                            id="body"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="border rounded p-2 w-full"
                            required
                        />
                    </div>
                    <Button type="primary"><button type="submit">Submit</button></Button>
                </form>
            </div>
        </div>
    );
}

export function ListDiscussionPosts({ threadId, isAuthenticated }: { threadId: number, isAuthenticated: boolean }) {
    const discussionPostsQuery = api.discussionPost.getDiscussionPostsByThreadId.useQuery({
        threadId,
    });

    if (discussionPostsQuery.isLoading) {
        return <div>Loading...</div>;
    }

    if (discussionPostsQuery.error) {
        return <div>Error: {discussionPostsQuery.error.message}</div>;
    }

    const discussionPosts = discussionPostsQuery.data;
    
    return (
        <div className="container mx-auto">
            <CreateDiscussionPostForm threadId={threadId} isAuthenticated={isAuthenticated} onSubmit={() => discussionPostsQuery.refetch()} />
            <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 py-4">
                    <h2 className="text-2xl mb-2">Discussion Posts</h2>
                    {!discussionPosts || discussionPosts.length === 0 ? (
                        <div>No discussion posts</div>
                    ) : (
                        <div className="py-4">
                            {discussionPosts.map(discussionPost => (
                                <div key={discussionPost.id} className="p-4 mb-4">
                                    <p>{discussionPost.content}</p>
                                    <p>By: {discussionPost.createdBy.email}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
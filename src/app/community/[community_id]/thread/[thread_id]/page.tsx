import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation'
//import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/react";
import { CreateThreadForm } from '~/app/_components/createThreadForm';
import { ListThreads } from '~/app/_components/listThreads';
import { ListDiscussionPosts } from '~/app/_components/listDiscussionPosts';

import { getCommunityById } from "~/services/communityService";
import { getThreadById } from '~/services/discussionThreadService';
import { getDiscussionPostsByThreadId } from '~/services/discussionPostService';

//import { BookThumbnail } from '../_components/bookThumbnail';
//import { Button } from '../_components/button';
//import { Pill } from '../_components/pill';

import type { DiscussionPost, User, Book, Community, BookReview, Genre, Author, DiscussionThread } from '@prisma/client';

export default async function ViewThreadPage({ params }: { params: { community_id: string, thread_id: string } }) {
    //const router = useRouter();
    const communityId = parseInt(params.community_id, 10);
    const threadId = parseInt(params.thread_id, 10);

    const session = await getServerAuthSession();

    const community = await getCommunityById(communityId);
    const thread = await getThreadById(threadId);

    if (!community || !thread)
        return <div>Community or thread not found</div>;

    return (
        <div className="p-4">
            <h1 className="text-3xl mb-4">&quot;{community.name}: {thread.title}&quot;</h1>
            <ListDiscussionPosts threadId={threadId} isAuthenticated={session !== null} />
        </div>
    );
}
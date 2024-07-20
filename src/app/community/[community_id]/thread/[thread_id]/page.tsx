import React from 'react';

import { getServerAuthSession } from "~/server/auth";
import { ListDiscussionPosts } from '~/app/_components/listDiscussionPosts';

import { getCommunityById } from "~/services/communityService";
import { getThreadById } from '~/services/discussionThreadService';

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
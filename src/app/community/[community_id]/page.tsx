import React from 'react';

import { getServerAuthSession } from "~/server/auth";
import { getCommunityById } from "~/services/communityService";
import { ListThreads } from '~/app/_components/listThreads';
import { redirect } from 'next/navigation'

import { hasAccessToCommunity } from "~/services/communityService";

export default async function ViewCommunityPage({ params }: { params: { community_id: string } }) {
    //const router = useRouter();
    const communityId = parseInt(params.community_id, 10);
    const session = await getServerAuthSession();

    const community = await getCommunityById(communityId);

    if (!community)
        return <div>Community not found</div>;

    if (community.isPrivate) {
        if (!session?.user?.id) {
            redirect(`/community/access/${communityId}`);
            return <div>
                Redirecting to access page...
            </div>    
        }

        const hasAccess = await hasAccessToCommunity(communityId, session.user.id);
        if (!hasAccess) {
            redirect(`/community/access/${communityId}`);
            return <div>
                Redirecting to access page...
            </div>
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl mb-4">Viewing Community &quot;{community.name}&quot;</h1>
            <ListThreads communityId={communityId} isAuthenticated={session !== null} />
        </div>
    )
}
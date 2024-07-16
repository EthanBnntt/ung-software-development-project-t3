import React from 'react';

import { getServerAuthSession } from "~/server/auth";
import { getCommunityById } from "~/services/communityService";
import { ListThreads } from '~/app/_components/listThreads';

export default async function ViewCommunityPage({ params }: { params: { communityId: string } }) {
    //const router = useRouter();
    const communityId = parseInt(params.communityId, 10);
    const session = await getServerAuthSession();

    const community = await getCommunityById(communityId);

    if (!community)
        return <div>Community not found</div>;

    return (
        <div className="p-4">
            <h1 className="text-3xl mb-4">Viewing Community &quot;{community.name}&quot;</h1>
            <ListThreads communityId={communityId} isAuthenticated={session !== null} />
        </div>
    )
}
import React from 'react';

import { getServerAuthSession } from "~/server/auth";
import { getCommunityById } from "~/services/communityService";

import { RequestAccessForm } from "~/app/_components/requestAccessForm";

export default async function RequestCommunityAccessPage({ params }: { params: { community_id: string } }) {
    const communityId = parseInt(params.community_id, 10);

    const community = await getCommunityById(communityId);

    if (!community) {
        return <div>Community not found</div>;
    }

    return <div className="p-4">
        <h1 className="text-3xl mb-4">Requesting access to &quot;{community.name}&quot;</h1>
        <RequestAccessForm communityId={communityId} />
    </div>
}
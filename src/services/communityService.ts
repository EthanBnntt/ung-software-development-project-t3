import { db } from "~/server/db";
import type { Community, Genre } from "@prisma/client";

import { getOrAddGenreByName } from "~/services/genreService";

export async function getCommunityById(id: number): Promise<Community | null> {
    return db.community.findFirst({
        where: {
            id: id,
        },
    });
}

export function getCommunitiesByGenreNames(genreNames: string[]): Promise<(Community & { genres: Genre[] })[]> {
    return db.community.findMany({
        where: {
            genres: {
                some: {
                    name: {
                        in: genreNames,
                    },
                },
            },
        },
        include: {
            genres: true,
        },
    });
}

export async function createCommunity(name: string, genreNames: string[], userId: string, accessCode?: string): Promise<Community> {
    const genres = await Promise.all(genreNames.map(genreName => getOrAddGenreByName(genreName)));

    return await db.community.create({
        data: {
            name,
            genres: {
                connect: genres.map(genre => ({ id: genre.id })),
            },
            createdBy: {
                connect: {
                    id: userId,
                },
            },
            accessCode,
            isPrivate: !!accessCode,
        },
        include: {
            genres: true,
        },
    });
}

export async function accessCommunity(communityId: number, userId: string, accessCode: string): Promise<boolean> {
    const community = await db.community.findFirst({
        where: {
            id: communityId,
        },
    });

    if (!community)
        return false;

    if (community.accessCode !== accessCode)
        return false;

    await db.community.update({
        where: {
            id: communityId,
        },
        data: {
            subscribers: {
                connect: {
                    id: userId,
                },
            },
        },
    });

    return true;
}

export async function hasAccessToCommunity(communityId: number, userId: string): Promise<boolean> {
    const community = await db.community.findFirst({
        where: {
            id: communityId,
            subscribers: {
                some: {
                    id: userId,
                },
            },
        },
    });

    return !!community;
}
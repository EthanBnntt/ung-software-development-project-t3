import { db } from "~/server/db";
import type { Community, Genre } from "@prisma/client";


export async function getCommunityById(id: number): Promise<Community | null> {
    return await db.community.findFirst({
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

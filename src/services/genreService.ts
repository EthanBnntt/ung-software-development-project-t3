import { db } from "~/server/db";
import type { Genre } from '@prisma/client';

export function getGenreByName(genreName: string): Promise<Genre | null> {
    return db.genre.findFirst({
        where: {
            name: genreName,
        }
    });
}

export function addGenre(genreName: string): Promise<Genre> {
    return db.genre.create({
        data: {
            name: genreName,
        }
    });
}

export async function getOrAddGenreByName(genreName: string): Promise<Genre> {
    const genre = await getGenreByName(genreName);
    if (genre) return genre;
    return await addGenre(genreName);
}

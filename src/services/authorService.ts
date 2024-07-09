import { db } from "~/server/db";
import type { Author } from '@prisma/client';

export function getAuthorByName(authorName: string): Promise<Author | null> {
    return db.author.findFirst({
        where: {
            name: authorName,
        }
    });
}

export function addAuthor(authorName: string): Promise<Author> {
    return db.author.create({
        data: {
            name: authorName,
        }
    });
}

export async function getOrAddAuthorByName(authorName: string): Promise<Author> {
    const author = await getAuthorByName(authorName);
    if (author) return author;
    return await addAuthor(authorName);
}
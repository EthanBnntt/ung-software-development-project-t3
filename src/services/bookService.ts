import { db } from "~/server/db";
import type { Genre, Book } from '@prisma/client';

import { getOrAddAuthorByName } from './authorService';
import { getOrAddGenreByName } from './genreService';

export function getAllBooks() {
    return db.book.findMany();
}

export function getBookByISBN(isbn: string): Promise<Book | null> {
    return db.book.findFirst({
        where: {
            isbn: isbn
        }
    });
}

export async function getBooksByGenreName(genreName: string): Promise<Book[]> {
    // Get all genres where name == genre
    const genre: Genre | null = await getOrAddGenreByName(genreName);

    // If genre is not found/created, return empty array
    if (!genre)
        return [];

    // Get all books where genreId == genre.id
    const books: Book[] = await db.book.findMany({
        where: {
            genres: {
                some: {
                    id: genre.id
                }
            }
        }
    });

    return books;
}

export async function getTrendingBooks(): Promise<Book[]> {
    const oneWeekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);

    const books: Book[] = await db.book.findMany({
        where: {
            publishedDate: {
                gte: oneWeekAgo,
            },
            reviews: {
                some: {
                    id: {
                        gt: 10,
                    },
                },
            },
        },
        include: {
            reviews: true,
        },
    });

    return books;
}

export async function getBooksByAuthorName(authorName: string): Promise<Book[]> {
    const author = await getOrAddAuthorByName(authorName);

    if (!author)
        return [];

    const books: Book[] = await db.book.findMany({
        where: {
            authors: {
                some: {
                    id: author.id
                }
            }
        }
    });

    return books;
}

// TODO
export async function addBook(
    title: string,
    isbn: string,
    authorName: string,
    genreNames: string[],
    publishedDate: Date,
    minAge: number | undefined,
    maxAge: number | undefined
): Promise<Book> {
    const author = await getOrAddAuthorByName(authorName);

    const genres = await Promise.all(genreNames.map(genreName => getOrAddGenreByName(genreName)));

    const book = await db.book.create({
        data: {
            title: title,
            isbn: isbn,
            publishedDate: publishedDate,
            minAge: minAge,
            maxAge: maxAge,
            authors: {
                connect: {
                    id: author.id
                }
            },
            genres: {
                connect: genres.map(genre => ({ id: genre.id }))
            }
        }
    });

    return book;
}
import { db } from "~/server/db";
import type { Genre, Book, Author } from '@prisma/client';

import { getOrAddAuthorByName } from './authorService';
import { getOrAddGenreByName } from './genreService';

export function getAllBooks(): Promise<(Book & { authors?: Author[] })[]> {
    return db.book.findMany({
        include: { authors: true },
    })
}

export async function getBookByISBN(isbn: string): Promise<Book | null> {
    const book = await db.book.findFirst({
        where: {
            isbn: isbn
        },
        include: { authors: true },
    });

    return book;
}

export async function getBooksByGenreName(genreName: string): Promise<(Book & { authors?: Author[] })[]> {
    // Get all genres where name == genre
    const genre: Genre | null = await getOrAddGenreByName(genreName);

    // If genre is not found/created, return empty array
    if (!genre)
        return [];

    // Get all books where genreId == genre.id
    return await db.book.findMany({
        where: {
            genres: {
                some: {
                    id: genre.id
                }
            }
        },
        include: { authors: true },
    });
}

export async function getTrendingBooks(): Promise<(Book & { authors?: Author[] })[]> {
    const oneWeekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);

    const trendingBooks = await db.book.findMany({
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
            authors: true,
            reviews: true,
        },
    });

    if (!trendingBooks || trendingBooks.length === 0) {
        return getAllBooks();
    }

    return trendingBooks;
}

export async function getNewBooks(): Promise<(Book & { authors?: Author[] })[]> {
    const books = await db.book.findMany({
        include: { authors: true },
        orderBy: {
            publishedDate: 'desc',
        },
    });

    return books;
}

export async function getBooksByAuthorName(authorName: string): Promise<(Book & { authors?: Author[] })[]> {
    const author = await getOrAddAuthorByName(authorName);

    if (!author)
        return [];

    return await db.book.findMany({
        where: {
            authors: {
                some: {
                    id: author.id
                }
            }
        },
        include: { authors: true },
    });
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
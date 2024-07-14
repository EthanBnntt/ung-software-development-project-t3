import { db } from "~/server/db";
import type { Book, User, BookReview, Genre } from '@prisma/client';

export async function getReviewsByISBN(isbn: string): Promise<(BookReview & { book?: Book, user?: User })[]> {
    const reviews = await db.bookReview.findMany({
        where: {
            book: {
                isbn: isbn
            }
        },
        include: {
            book: true,
            createdBy: true,
        },
    });

    return reviews;
}

export async function addReview(
    isbn: string,
    content: string,
    rating: number,
    userId: string,
): Promise<BookReview> {
    const book = await db.book.findFirst({
        where: { isbn: isbn }
    });

    if (!book) {
        throw new Error('Book not found');
    }

    // Has the user already reviewed this book?
    const existingReview = await db.bookReview.findFirst({
        where: {
            bookId: book.id,
            createdById: userId
        }
    });

    if (existingReview)
        await db.bookReview.deleteMany({
            where: {
                bookId: book.id,
                createdById: userId
            }
        });

    const review = await db.bookReview.create({
        data: {
            rating: rating,
            content: content,
            book: {
                connect: {
                    id: book.id
                }
            },
            createdBy: {
                connect: {
                    id: userId
                }
            }
        }
    });

    return review;
}

export async function getAllReviews(): Promise<(BookReview & { book?: Book, user?: User })[]> {
    const reviews = await db.bookReview.findMany({
        include: {
            book: true,
            createdBy: true,
        },
    });

    return reviews;
}

export async function getReviewsByGenreNames(genreNames: string[], minAge: number, maxAge: number): Promise<(BookReview & {
    book?: Book & {
        genres?: Genre[]
    },
    user?: User
})[]> {
    const reviews = await db.bookReview.findMany({
        where: {
            book: {
                genres: {
                    some: {
                        name: {
                            in: genreNames
                        }
                    }
                },
                minAge: {
                    lte: maxAge
                },
                maxAge: {
                    gte: minAge
                }
            }
        },
        include: {
            book: {
                include: {
                    genres: true
                }
            },
            createdBy: true, // TODO: Do we need this?
        },
    });

    return reviews;
}

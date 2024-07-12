import { db } from "~/server/db";
import type { Book, User, BookReview } from '@prisma/client';

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

    console.log(existingReview ?? 'No existing review found');

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
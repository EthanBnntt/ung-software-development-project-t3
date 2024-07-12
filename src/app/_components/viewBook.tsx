"use client";

import type { Book, Author, Genre } from '@prisma/client';

import { api } from '~/trpc/react';
import { BookThumbnail } from './bookThumbnail';
import { ViewReviewsList } from './viewReviewsList';

export function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-block bg-gray-200 rounded-full ml-3 px-3 py-1 text-sm font-semibold text-gray-700 mb-2">
            {children}
        </span>
    );
}

export function ViewBook({ isbn, isAuthenticated }: { isbn: string, isAuthenticated: boolean }) {
    const bookQuery = api.book.getBookByISBN.useQuery({
        isbn,
    });

    if (bookQuery.isLoading)
        return <div>Loading...</div>;
    else if (bookQuery.error)
        return <div>Error: {bookQuery.error.message}</div>;

    const book: (Book & { authors?: Author[], genres?: Genre[] }) | undefined | null = bookQuery.data;

    if (!book) {
        return <div>Book not found</div>;
    }

    return (
        <div className="container mx-auto">
            <div className="flex flex-col md:flex-row">
                <BookThumbnail isbn={book.isbn} title={book.title} isLoading={false} />
                <div className="md:w-1/2 py-4">
                    <p className="text-lg mb-2"><strong>Authors:</strong> {
                        book.authors?.map((author) => author.name).join(', ')
                    }</p>
                    <p className="text-lg mb-2"><strong>ISBN:</strong> {book.isbn}</p>
                    <p className="text-lg mb-2"><strong>Published Date:</strong> {book.publishedDate.toLocaleDateString()}</p>
                    <p className="text-lg mb-2">{(
                        book.description ? (<>
                            <strong>Description:</strong> {book.description}
                        </>) : <strong>Description not provided</strong>
                    )}</p>
                    <p className="text-lg mb-2">{(
                        book.genres ? (<>
                            <strong>Genres:</strong>
                            <span className="pr-3">
                                {book.genres.map((genre) => <Pill key={genre.name}>{genre.name}</Pill>)}
                            </span>
                        </>): <strong>Genres not provided</strong>
                    )}</p>
                </div>
                <div className="md:w-1/2 py-4">
                    <ViewReviewsList isbn={isbn} isAuthenticated={isAuthenticated} />
                </div>
            </div>
        </div>
    );
};

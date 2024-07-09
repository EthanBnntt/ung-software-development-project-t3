"use client";

import { BookThumbnail } from "./bookThumbnail";

import { api } from "~/trpc/react";
import { Book } from "@prisma/client";
import { useEffect, useState } from "react";

export function ViewTrendingBooks() {
    const getTrendingBooks = api.book.getTrendingBooks.useQuery();

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (getTrendingBooks.data) {
            setBooks(getTrendingBooks.data);
            setLoading(false);
        }
    }, [getTrendingBooks.data]);

    return (
        <div className="w-full py-4">
            <h1 className="text-3xl font-bold text-pink-300">
                Trending Books
            </h1>
            <div className="flex flex-wrap -mx-4">
                {loading && (
                    <span>
                        <BookThumbnail key={""} isbn={""} title={""} isLoading={true} />
                        <BookThumbnail key={""} isbn={""} title={""} isLoading={true} />
                        <BookThumbnail key={""} isbn={""} title={""} isLoading={true} />
                    </span>
                )}

                {books.map((book) => (
                    <BookThumbnail key={book.isbn} isbn={book.isbn} title={book.title} isLoading={false} />
                ))}
                
                {books.length === 0 && !loading && (
                    <div className="p-4">No books found</div>
                )}
            </div>
        </div>
    )
}
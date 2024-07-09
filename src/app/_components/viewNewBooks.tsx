"use client";

import { BookThumbnail } from "./bookThumbnail";

import { api } from "~/trpc/react";
import { Book } from "@prisma/client";
import { useEffect, useState } from "react";

export function ViewNewBooks() {
    const getNewBooks = api.book.getNewBooks.useQuery();

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (getNewBooks.data) {
            setBooks(getNewBooks.data);
            setLoading(false);
        }
    }, [getNewBooks.data]);

    return (
        <div className="w-full py-4">
            <h1 className="text-3xl font-bold text-pink-300">
                New Books
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
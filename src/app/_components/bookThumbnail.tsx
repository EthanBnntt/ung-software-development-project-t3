"use client";

import Image from 'next/image';
import Link from 'next/link';

export function BookThumbnail({ isbn, title, isLoading }: { isbn: string, title: string, isLoading: boolean }) {
    const thumbnailUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;

    return (
        <div className="w-1/4 p-4">
            <Link href={`/books/${isbn}`}>
                {isLoading ? (
                    <div className="bg-gray-400 h-64 w-full rounded-lg"></div>
                ): (
                    <div>
                        <Image src={thumbnailUrl} alt={title} className="rounded-lg" width={200} height={300} layout="responsive" />
                        <h2 className="text-lg font-bold mt-2">{title}</h2>
                    </div>
                )}
            </Link>
        </div>
    )
}
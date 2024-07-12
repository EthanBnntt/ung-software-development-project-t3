/*
INPUT: Emily, a stay-at-home mom, wants to easily find books for herself and her kids using a genre and age range menu.

ACTIVATION: Emily selects the desired genres and age ranges from the menu. She then clicks on the “search books” button.

ACTION: The system searches for books that match the selected genres and age ranges.

OUTPUT: Emily receives a list of books that fit the chosen genres and age ranges, making it easy for her to find suitable books for herself and her kids.
*/

"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { api } from "~/trpc/react";
import { BookThumbnail } from '../_components/bookThumbnail';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // getBooksByGenreNames

    const genresString = searchParams.get('q') ?? '';
    const genresList = genresString.split(',').map(genre => genre.trim());

    const minAge = searchParams.get('minAge');
    const maxAge = searchParams.get('maxAge');

    if (genresString === '') {
        // Redirect home
        router.push('/');
    }

    const searchQuery = api.book.getBooksByGenreNames.useQuery({ genreNames: genresList });

    if (searchQuery.error) {
        return <div>Error: {searchQuery.error.message}</div>;
    }

    if (searchQuery.isLoading) {
        return <div>Loading...</div>;
    }

    const books = searchQuery.data ?? [];

    return (
        <div className="p-4">
            <h1 className="text-3xl mb-4">Search Results</h1>
            <div className="mb-4">
                <h2 className="text-2xl mb-2">Search Query</h2>
                <p className="text-lg"><strong>Genres:</strong> {genresList.join(', ') || 'N/A'}</p>
                <p className="text-lg"><strong>Min Age:</strong> {minAge ?? 'N/A'}</p>
                <p className="text-lg"><strong>Max Age:</strong> {maxAge ?? 'N/A'}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
                <h2 className="text-2xl mb-2">Results</h2>
                {searchQuery.isLoading ? (
                    <p className="text-lg">Loading...</p>
                ) : books.length > 0 ? (
                    <div className="flex flex-wrap">
                        {books.map(book => (
                            <BookThumbnail key={book.isbn} isbn={book.isbn} title={book.title} isLoading={false} />
                        ))}
                    </div>
                ) : (
                    <p className="text-lg">No results found. Please adjust your search criteria.</p>
                )}
            </div>
        </div>
    );

}
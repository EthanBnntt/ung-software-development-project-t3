/*
INPUT: Emily, a stay-at-home mom, wants to easily find books for herself and her kids using a genre and age range menu.

ACTIVATION: Emily selects the desired genres and age ranges from the menu. She then clicks on the “search books” button.

ACTION: The system searches for books that match the selected genres and age ranges.

OUTPUT: Emily receives a list of books that fit the chosen genres and age ranges, making it easy for her to find suitable books for herself and her kids.
*/

"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { api } from "~/trpc/react";
import { BookThumbnail } from '../_components/bookThumbnail';
import { Button } from '../_components/button';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const genresString = searchParams.get('q') ?? '';
    const genresList = genresString.split(',').map(genre => genre.trim());

    const queryMinAge = parseInt(searchParams.get('minAge') ?? '0', 10);
    const queryMaxAge = parseInt(searchParams.get('maxAge') ?? '100', 10);
    const [minAge, setMinAge] = useState(queryMinAge);
    const [maxAge, setMaxAge] = useState(queryMaxAge);

    if (genresString === '') {
        // Redirect home
        router.push('/');
    }

    const searchQuery = api.book.getBooksByGenreNames.useQuery({
        genreNames: genresList,
        minAge: queryMinAge,
        maxAge: queryMaxAge,
    });

    if (searchQuery.error) {
        return <div>Error: {searchQuery.error.message}</div>;
    }

    if (searchQuery.isLoading) {
        return <div>Loading...</div>;
    }

    const books = searchQuery.data ?? [];

    function searchWithNewQuery() {
        router.push(`/search?q=${genresList.join(',')}&minAge=${minAge}&maxAge=${maxAge}`);
    }

    const updateMinimumAge = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMinAge = parseInt(e.target.value, 10);
        if (newMinAge > maxAge) {
            setMaxAge(newMinAge);
        }
        setMinAge(newMinAge);
    };

    const updateMaximumAge = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMaxAge = parseInt(e.target.value, 10);
        if (newMaxAge < minAge) {
            setMinAge(newMaxAge);
        }
        setMaxAge(newMaxAge);
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl mb-4">Search Results</h1>
            <div className="mb-4">
                <div className="mb-2">
                    <p className="text-lg mb-2"><strong>Genres:</strong> {genresList.join(', ') || 'N/A'}</p>
                    <div className="flex flex-wrap w-1/3">
                        <label htmlFor="minAge" className="w-1/2">Minimum Age: {minAge}</label>
                        <input
                            name="minAge"
                            type="range"
                            min="0"
                            max="100"
                            value={minAge}
                            onChange={(e) => updateMinimumAge(e)}
                            className="w-full mb-2"
                        />
                        <label htmlFor="maxAge" className="w-1/2">Maximum Age: {maxAge}</label>
                        <input
                            name="maxAge"
                            type="range"
                            min="0"
                            max="100"
                            value={maxAge}
                            onChange={(e) => updateMaximumAge(e)}
                            className="w-full mb-2"
                        />
                    </div>
                </div>
                <Button onClick={() => searchWithNewQuery()}>Change Search Query</Button>
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
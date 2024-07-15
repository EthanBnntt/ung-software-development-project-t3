"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { api } from "~/trpc/react";
import { BookThumbnail } from '../_components/bookThumbnail';
import { Button } from '../_components/button';
import { Pill } from '../_components/pill';

import type { Book, Community, BookReview, Genre, Author } from '@prisma/client';


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

    const reviewsSearchQuery = api.review.getReviewsByGenreNames.useQuery({
        genreNames: genresList,
        minAge: queryMinAge,
        maxAge: queryMaxAge,
    });

    const communitisSearchQuery = api.community.getCommunitiesByGenreNames.useQuery({
        genreNames: genresList,
    });
    
    if (searchQuery.error ?? reviewsSearchQuery.error ?? communitisSearchQuery.error)
        return (
            <div>
                Error: {searchQuery.error?.message ?? reviewsSearchQuery.error?.message ?? communitisSearchQuery.error?.message}
            </div>
        );

    if (searchQuery.isLoading || reviewsSearchQuery.isLoading || communitisSearchQuery.isLoading) {
        return <div>Loading...</div>;
    }

    const books: (Book & { authors?: Author[], genres?: Genre[] })[] = searchQuery.data ?? [];
    const reviews: (BookReview & { book?: Book & { genres?: Genre[] } })[] = reviewsSearchQuery.data ?? [];
    const communities: (Community & { genres: Genre[] })[] = communitisSearchQuery.data ?? [];

    function searchWithNewQuery() {
        router.push(`/search?q=${genresList.join(',')}&minAge=${minAge}&maxAge=${maxAge}`);
    }

    const updateMinimumAge = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMinAge = parseInt(e.target.value, 10);
        if (newMinAge >= maxAge) setMaxAge(newMinAge + 1 < 100 ? newMinAge + 1 : 100);
        setMinAge(newMinAge);
    };

    const updateMaximumAge = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMaxAge = parseInt(e.target.value, 10);
        if (newMaxAge <= minAge) setMinAge(newMaxAge - 1 > 0 ? newMaxAge - 1 : 0);
        setMaxAge(newMaxAge);
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl mb-4">Search Results</h1>
            {/** Search Query */}
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
                            onChange={updateMinimumAge}
                            className="w-full mb-2"
                        />
                        <label htmlFor="maxAge" className="w-1/2">Maximum Age: {maxAge}</label>
                        <input
                            name="maxAge"
                            type="range"
                            min="0"
                            max="100"
                            value={maxAge}
                            onChange={(e) => updateMaximumAge}
                            className="w-full mb-2"
                        />
                    </div>
                </div>
                <Button onClick={() => searchWithNewQuery()}>Change Search Query</Button>
            </div>
            {/** Books */}
            <div className="border-t border-gray-200 pt-4">
                <h2 className="text-2xl mb-2">Books</h2>
                {books.length > 0 ? (
                    <div className="flex flex-wrap">
                        {books.map(book => (
                            <BookThumbnail key={book.isbn} isbn={book.isbn} title={book.title} isLoading={false} />
                        ))}
                    </div>
                ) : (
                    <p className="text-lg">No results found. Please adjust your search criteria.</p>
                )}
            </div>
            {/** Reviews */}
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 py-4">
                        <h2 className="text-2xl mb-2">Reviews</h2>
                        {reviews.length > 0 ? (
                            <div className="flex flex-wrap">
                                {reviews.map(review => (
                                    <Link href={"/books/" + review?.book?.isbn} key={review.id} className="w-full mb-4">
                                        <h3 className="text-xl">{review?.book?.title}</h3>
                                        <p className="text-lg mb-2"><strong>Genres:</strong>
                                            <span className="pr-3">
                                                {review?.book?.genres?.map(genre => (
                                                    <Pill key={genre.name}>{genre.name}</Pill>
                                                ))}
                                            </span>
                                        </p>
                                        <p className="text-md">{review.content}</p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-lg">No reviews found. Please adjust your search criteria.</p>
                        )}
                    </div>
                </div>
            </div>
            {/** Communities */}
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 py-4">
                        <h2 className="text-2xl mb-2">Relevant Communities</h2>
                        {communities.length > 0 ? (
                            <div className="flex flex-wrap">
                                {communities.map(community => (
                                    <Link href={"/community/" + community.id} key={community.id} className="w-full mb-4">
                                        <h3 className="text-xl">{community.name}</h3>
                                        <p className="text-lg mb-2"><strong>Genres:</strong>
                                            <span className="pr-3">
                                                {community?.genres.map(genre => (
                                                    <Pill key={genre.name}>{genre.name}</Pill>
                                                ))}
                                            </span>
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-lg">No communities found. Please adjust your search criteria.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

}
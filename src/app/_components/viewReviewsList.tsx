"use client";

import { useState } from 'react';

import { api } from '~/trpc/react';
import { Button } from './button';

export function ViewReviewsList({ isbn, isAuthenticated }: { isbn: string, isAuthenticated: boolean }) {
    const reviewsQuery = api.review.getReviewsByISBN.useQuery({ isbn });
    const addReviewMutation = api.review.addReview.useMutation();
    const [rating, setRating] = useState<number>(0);
    const [content, setContent] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addReviewMutation.mutateAsync({ isbn, rating, content });
        await reviewsQuery.refetch(); // Refetch reviews after adding a new one
        setRating(0);
        setContent('');
    };

    if (reviewsQuery.isLoading) return <div>Loading...</div>;
    if (reviewsQuery.error) return <div>Error: {reviewsQuery.error.message}</div>;

    const reviews = reviewsQuery.data;

    return (
        <div>
            <h2 className="text-2xl mb-2">Reviews</h2>
            {reviews?.map((review) => (
                <div key={review.id} className="border-b border-gray-200 py-2">
                    <p className="text-lg mb-2"><strong>Rating:</strong> {review.rating}</p>
                    <p className="text-lg mb-2"><strong>Content:</strong> {review.content}</p>
                </div>
            ))}
            {reviews?.length === 0 && <p>No reviews yet</p>}

            {isAuthenticated && (
                <form onSubmit={handleSubmit} className="mt-4">
                    <h3 className="text-xl mb-2">Submit a Review</h3>
                    <div className="mb-2">
                        <label className="block text-lg mb-1" htmlFor="rating">Rating:</label>
                        <input
                            type="number"
                            id="rating"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            min="1"
                            max="5"
                            className="border rounded p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-lg mb-1" htmlFor="content">Content:</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="border rounded p-2 w-full"
                            required
                        />
                    </div>
                    <Button type="primary"><button type="submit">Submit</button></Button>
                </form>
            )}
        </div>
    );
}

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from './button';

export function Logo() {
    return (
        <div className="flex items-center">
            <Link
                href="/"
                className="text-2xl font-bold text-white"
                style={{ textShadow: '2px 2px 0 #ffb6c1, 2px -2px 0 #ffb6c1, -2px 2px 0 #ffb6c1, -2px -2px 0 #ffb6c1' }}>
                BookReviewHub
            </Link>
        </div>
    )
}

export function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.push(`/search?q=${query}`);
    };

    return (
        <div className="flex-1 mx-4">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Search by genres (separated by commas)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
                    style={{ backgroundColor: '#fffafc' }} // Pastel pink background
                />
            </form>
        </div>
    )
}

export function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
    return (
        <nav className="bg-white mx-auto py-4" style={{ position: "sticky", top: 0, zIndex: 999 }}>
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <Logo />

                {/* Search Bar */}
                <SearchBar />

                {/* Create Community Link */}
                {isLoggedIn && (
                    <Link href="/create-community" className="pr-4 text-pink-300">Create Community</Link>
                )}

                {/* Login/Signup Button */}
                {!isLoggedIn ? (
                    <div className="space-x-4">
                        <Button href="/api/auth/signin" type="primary">Login</Button>
                        <Button href="/signup" type="primary">Signup</Button>
                    </div>
                ) : (
                    <Button href="/api/auth/signout" type="primary">Logout</Button>
                )}
            </div>
        </nav>
    );
}

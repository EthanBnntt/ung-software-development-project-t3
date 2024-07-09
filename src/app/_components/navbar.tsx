"use client";

import React from 'react';
import Link from 'next/link';

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
    return (
        <div className="flex-1 mx-4">
            <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
                style={{ backgroundColor: '#fffafc' }} // Pastel pink background
            />
        </div>
    )
}

export function Button({ children, href, type, ...props }: { children: React.ReactNode, type?: string, href?: string }) {
    return (
        <div className={"flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 border-2" +
            (!type || type == "primary" ? " text-white bg-pink-500 hover:bg-pink-600 focus:ring-pink-300 border-pink-300 rounded-full" : "") +
            (type == "secondary" ? " text-white bg-pink-300 hover:bg-pink-400 focus:ring-pink-200 border-2 border-pink-500 rounded-full" : "")}
            {...props}
        >
            {href ? (<Link href={href}>{children}</Link>) : children}
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

                {/* Login/Signup Button */}
                {!isLoggedIn ? (
                    <Button href="/api/auth/signin" type="primary">Login/Signup</Button>
                ) : (
                    <Button href="/api/auth/signout" type="primary">Logout</Button>
                )}
            </div>
        </nav>
    );
}
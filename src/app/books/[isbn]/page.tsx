import React from 'react';
import { useRouter } from 'next/navigation';
import { HydrateClient } from '~/trpc/server';
import { getServerSession } from 'next-auth';

//import { ViewBook } from '~/app/_components/listAllBooks';
import { ViewBook } from '~/app/_components/viewBook';
import { CreateThreadForm } from '~/app/_components/createThreadForm';
import { ListThreads } from '~/app/_components/listThreads';

export default async function ViewBookPage({ params }: { params: { isbn: string } }) {
    const isbn = params.isbn;
    const session = await getServerSession();

    // TODO: Check if book exists

    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col">
                <ViewBook isbn={isbn} isAuthenticated={session?.user !== null} />
            </main>
        </HydrateClient>
    );
}
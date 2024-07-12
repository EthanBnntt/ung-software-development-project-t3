import { db } from "~/server/db";
import type { DiscussionThread } from '@prisma/client';

export function getThreadsByBookISBN(isbn: string): Promise<DiscussionThread[]> {
    return db.discussionThread.findMany({
        where: {
            book: {
                isbn: isbn,
            }
        },
        include: {
            book: true,
        },
    });
}

// untested
export function getThreadById(id: number): Promise<DiscussionThread | null> {
    return db.discussionThread.findFirst({
        where: {
            id: id,
        },
    });
}

// untested
export function getCreatedThreadsByUser(userId: string): Promise<DiscussionThread[]> {
    return db.discussionThread.findMany({
        where: {
            createdById: userId,
        },
        include: {
            book: true,
        },
    });
}

// untested
export function getSubscribedThreadsByUser(userId: string): Promise<DiscussionThread[]> {
    return db.discussionThread.findMany({
        where: {
            members: {
                some: {
                    id: userId,
                },
            },
        },
    });
}

export function createThread(
    title: string,
    bookISBN: string,
    creatorId: string,
): Promise<DiscussionThread> {
    return db.discussionThread.create({
        data: {
            title: title,
            book: {
                connect: {
                    isbn: bookISBN,
                },
            },
            createdBy: {
                connect: {
                    id: creatorId,
                },
            },
        },
    });
}

// untested
export function deleteThread(threadId: number): Promise<DiscussionThread> {
    return db.discussionThread.delete({
        where: {
            id: threadId,
        },
    });
}

// untested
export function subscribeToThread(threadId: number, userId: string): Promise<DiscussionThread> {
    return db.discussionThread.update({
        where: {
            id: threadId,
        },
        data: {
            members: {
                connect: {
                    id: userId,
                },
            },
        },
    });
}
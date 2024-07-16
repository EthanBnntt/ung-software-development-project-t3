import { db } from "~/server/db";
import type { DiscussionThread } from '@prisma/client';

export function getThreadsByBookISBN(isbn: string): Promise<DiscussionThread[]> {
    return db.discussionThread.findMany({
        // TODO
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

export function getThreadsByCommunityId(communityId: number): Promise<DiscussionThread[]> {
    return db.discussionThread.findMany({
        where: {
            communityId: communityId,
        },
        include: {
            createdBy: true,
            community: true,
        },
    });
}

export function createThread(
    title: string,
    comunityId: number,
    creatorId: string,
): Promise<DiscussionThread> {
    // TODO
    return db.discussionThread.create({
        data: {
            title: title,
            //book: {
            //    connect: {
            //        isbn: bookISBN,
            //    },
            //},
            community: {
                connect: {
                    id: comunityId,
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
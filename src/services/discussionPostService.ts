import { db } from "~/server/db";
import type { DiscussionPost, User } from '@prisma/client';

export async function getDiscussionPostsByThreadId(threadId: number): Promise< (DiscussionPost & { createdBy: User })[]> {
    return db.discussionPost.findMany({
        where: {
            threadId: threadId,
        },
        include: {
            createdBy: true,
        },
    });
}

export async function createDiscussionPost(threadId: number, content: string, userId: string): Promise<DiscussionPost> {
    return db.discussionPost.create({
        data: {
            content,
            createdBy: {
                connect: {
                    id: userId,
                },
            },
            thread: {
                connect: {
                    id: threadId,
                },
            },
        },
    });
}
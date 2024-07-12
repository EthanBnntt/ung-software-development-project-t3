// server/routers/userRouter.ts
import { z } from 'zod';
import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";

import { 
    getAllBooks,
    getBookByISBN,
    getBooksByGenreName,
    getTrendingBooks,
    getNewBooks,
    getBooksByAuthorName,
    getBooksByGenreNames
 } from '~/services/bookService';

export const bookRouter = createTRPCRouter({    
    getAllBooks: publicProcedure
        .query(async () => {
            return await getAllBooks();
        }),
    
    getBookByISBN: publicProcedure
        .input(z.object({ isbn: z.string() }))
        .query(async ({ input }) => {
            // TODO: Idk if this correctly handles missing books

            const book = await getBookByISBN(input.isbn);

            if (!book)
                throw new Error('Book not found');

            return book;
        }),
    
    getBooksByGenreName: publicProcedure
        .input(z.object({ genreName: z.string() }))
        .query(async ({ input }) => {
            return await getBooksByGenreName(input.genreName);
        }),

    getBooksByGenreNames: publicProcedure
        .input(z.object({
            genreNames: z.array(z.string()),
            minAge: z.number().max(100).optional(),
            maxAge: z.number().max(100).optional(),
        }))
        .query(async ({ input }) => {
            return await getBooksByGenreNames(input.genreNames, input.minAge, input.maxAge);
        }),

    getTrendingBooks: publicProcedure
        .query(async () => {
            return await getTrendingBooks();
        }),
    
    getNewBooks: publicProcedure
        .query(async () => {
            return await getNewBooks();
        }),

    getBooksByAuthorName: publicProcedure
        .input(z.object({ authorName: z.string() }))
        .query(async ({ input }) => {
            return await getBooksByAuthorName(input.authorName);
        }),
});
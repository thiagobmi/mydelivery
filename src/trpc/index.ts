import {router, publicProcedure} from "./trpc"
import { authRouter } from "./auth-router"
import { z } from "zod"
import { getPayloadClient } from "../get-payload"
import { paymentRouter } from './payment-router'

export const appRouter = router({

    auth: authRouter,
    payment: paymentRouter,

    getAllProducts:  publicProcedure.query( async ({input}) => {
        const payload = await getPayloadClient()
        const docs = await payload.find({
            collection: 'products',
            depth: 1
        })
        return docs
    }),

    getProductById: publicProcedure.input(z.string()).query(async ({ input }) => {
        const payload = await getPayloadClient();
        const doc = await payload.findByID({
            collection: 'products',
            id: input,
            depth : 2
        });
        
        if (!doc) {
            throw new Error('Product not found');
        }
        return doc;
    }),

    getAllCategories: publicProcedure.query(async () => {
        const payload = await getPayloadClient();
        const docs = await payload.find({
            collection: 'categories',
            depth: 1
        });
        return docs;
    }),

});

export type AppRouter = typeof appRouter
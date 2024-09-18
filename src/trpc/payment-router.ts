import { TRPCError } from "@trpc/server";
import { privateProcedure, router } from "./trpc";
import { z } from "zod";
import { getPayloadClient } from "../get-payload";
import { Product } from "@/payload-types";
import { CartItem } from "@/hooks/use-cart";

export const paymentRouter = router({
  createSession: privateProcedure
    .input(
      z.object({
        cartItems: z.array(
          z.object({
            product: z.string(),
            quantity: z.number(),
            notes: z.string().optional().nullable(),
          })
        ),
        address: z.object({
          state: z.string(),
          city: z.string(),
          zip: z.string(),
          street: z.string(),
          number: z.string(),
          complement: z.string().optional().nullable(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { cartItems } = input;

      if (cartItems.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cart is empty" });
      }

      const payload = await getPayloadClient();
      const productsResponse = await payload.find({
        collection: "products",
        depth: 1,
      });

      if (!productsResponse.docs || !Array.isArray(productsResponse.docs)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid products response",
        });
      }

      const products: Product[] = productsResponse.docs;

      const productMap = products.reduce((acc: Record<string, Product>, product: Product) => {
        acc[product.id] = product;
        return acc;
      }, {});
      console.log(productMap);

      const orderTotal = cartItems.reduce((acc, item) => {
        const product = productMap[item.product];
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Product with id ${item.product} not found`,
          });
        }
        return acc + product.price * item.quantity;
      }, 0);

      const orderItems = cartItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        ...(item.notes && { notes: item.notes }),
      }));

      const order = await payload.create({
        collection: "orders",
        data: {
          user: user.id,
          items: orderItems,
          status: "pending",
          total: orderTotal,
          address: input.address,
        },
      });
      return {
        url: '/'
      };
    }),
});

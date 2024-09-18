import { router, publicProcedure, privateProcedure } from './trpc';
import { AuthCredentialsValidator } from '../lib/validators/account-credentials-validator';
import { getPayloadClient } from '../get-payload';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import update from 'payload/dist/collections/operations/update';
import { equal } from 'assert';

export const authRouter = router({
  createPayloadUser: publicProcedure.input(AuthCredentialsValidator).mutation(async ({ input, ctx }) => {
    const { email, password } = input;
    const payload = await getPayloadClient();
    const { res } = ctx;

    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (users.length !== 0) throw new TRPCError({ code: 'CONFLICT' });

    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        role: 'user',
        profile_finished: false,
      },
    });

    try {
      await payload.login({
        collection: 'users',
        data: {
          email,
          password,
        },
        res,
      });
    } catch (e) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return { success: true, sentToEmail: email};
  }),

  verifyEmail: publicProcedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
    const { token } = input;
    const payload = await getPayloadClient();

    const isVerified = await payload.verifyEmail({
      collection: 'users',
      token,
    });

    if (!isVerified) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return { success: true };
  }),

  signIn: publicProcedure.input(AuthCredentialsValidator).mutation(async ({ input, ctx }) => {
    const { email, password } = input;
    const { res } = ctx;
    const payload = await getPayloadClient();

    try {
      await payload.login({
        collection: 'users',
        data: {
          email,
          password,
        },
        res,
      });
      return { success: true };
    } catch (e) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
  }),

  isLogged: publicProcedure.query(({ ctx }) => {
    const reqInfo = {
        headers: ctx.req.headers,
        method: ctx.req.method,
        url: ctx.req.url,
        cookies: ctx.req.headers.cookie,
    };

    const isLoggedIn = reqInfo.cookies?.includes('payload-token') ?? false;

    return isLoggedIn;
}),

  updateProfile: privateProcedure.input(z.object({ name: z.string(), phone: z.string() })).mutation(async ({ input, ctx }) => {
    const { name, phone } = input;
    const payload = await getPayloadClient();
    const {user} = ctx;

    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        name,
        phone,
        profile_finished: true,
      },
    });

    return { success: true };
  }),

  getUserinfo: privateProcedure.query(async ({ ctx }) => {
    const payload = await getPayloadClient();
    const { user } = ctx;

    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: user.id,
        },
      },
    });

    if (users.length === 0) throw new TRPCError({ code: 'NOT_FOUND' });

    const { name, phone, email, profile_finished } = users[0];

    return { name, phone, email, profile_finished };
  }),

  getOrdersFromUser: privateProcedure.query(async ({ ctx }) => {
    const payload = await getPayloadClient();
    const { user: u  } = ctx;
    if (!u) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const { docs: orders } = await payload.find({
      collection: 'orders',
      where: {
        user: {
          equals: u.id,
        },
      },
      depth: 3
    });

    return orders;
  }),

});

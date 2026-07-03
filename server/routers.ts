import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getTestimonialsByLanguage, addAnalyticsEvent, getAnalyticsDashboard } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  testimonials: router({
    getByLanguage: publicProcedure
      .input(z.object({ language: z.string().default("en") }))
      .query(async ({ input }) => {
        return await getTestimonialsByLanguage(input.language);
      }),
  }),

  analytics: router({
    track: publicProcedure
      .input(z.object({
        eventType: z.string(),
        eventData: z.record(z.string(), z.any()).optional(),
        referrer: z.string().optional(),
        language: z.string().optional(),
        deviceType: z.string().optional(),
        pageUrl: z.string().optional(),
        sessionId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const userAgent = (ctx.req.headers["user-agent"] as string) || "";
        const ipHash = (ctx.req.headers["x-forwarded-for"] as string) || "unknown";
        
        await addAnalyticsEvent({
          eventType: input.eventType,
          eventData: input.eventData ? JSON.stringify(input.eventData) : null,
          referrer: input.referrer,
          userAgent: userAgent.substring(0, 512),
          ipHash: ipHash.substring(0, 64),
          language: input.language,
          deviceType: input.deviceType,
          pageUrl: input.pageUrl,
          sessionId: input.sessionId,
        });
        
        return { success: true };
      }),
    dashboard: publicProcedure
      .input(z.object({ days: z.number().default(30) }))
      .query(async ({ input, ctx }) => {
        // Only allow owner to view analytics
        if (ctx.user?.openId !== process.env.OWNER_OPEN_ID) {
          throw new Error('Unauthorized');
        }
        return await getAnalyticsDashboard(input.days);
      }),
  }),
});

export type AppRouter = typeof appRouter;

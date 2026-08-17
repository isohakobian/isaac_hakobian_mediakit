import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { createManagedCollaboration, deleteManagedCollaboration, getAnalyticsDashboard, getManagedCollaborations, getPortableBackupAnalyticsChunk, getPortableBackupCore, getPortableBackupSummary, getPortableBackupImportDiff, getTestimonialsByLanguage, addAnalyticsEvent, updateManagedCollaboration, restorePortableBackupAnalyticsBatch, restorePortableBackupCollaborations, restorePortableBackupTestimonials, createBackupOperation, updateBackupOperation, getBackupOperationHistory, createPortableDatabaseSafetyBackup, createBrandRequest, getBrandRequests, updateBrandRequestStatus, getCaseStudiesForCollaboration, upsertCaseStudy } from "./db";
import { notifyOwner } from "./_core/notification";
import { BACKUP_PACKAGE_TYPE, BACKUP_SCHEMA_VERSION } from "@shared/backup";

const ownerProcedure = adminProcedure.use(({ ctx, next }) => {
  if (ctx.user.openId !== ENV.ownerOpenId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Только владелец может экспортировать или восстанавливать backup" });
  }
  return next({ ctx });
});

const collaborationTranslationSchema = z.object({
  name: z.string().trim().min(1).max(255),
  category: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1).max(4000),
  campaign: z.string().trim().min(1).max(1000),
  results: z.string().trim().min(1).max(1000),
  quote: z.string().trim().min(1).max(2000),
  quoteLabel: z.string().trim().max(255).optional(),
});

const collaborationTranslationsSchema = z.object({
  en: collaborationTranslationSchema,
  ru: collaborationTranslationSchema,
  es: collaborationTranslationSchema,
  ar: collaborationTranslationSchema,
  fr: collaborationTranslationSchema,
});

const collaborationInputSchema = z.object({
  translations: collaborationTranslationsSchema,
  mediaUrl: z.string().url().max(512),
  mediaTitle: z.string().trim().min(1).max(255),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  isPublished: z.boolean().default(true),
});

const toDbCollaboration = (input: z.infer<typeof collaborationInputSchema>) => ({
  translations: JSON.stringify(input.translations),
  mediaUrl: input.mediaUrl,
  mediaTitle: input.mediaTitle,
  publishedAt: input.publishedAt ? new Date(`${input.publishedAt}T12:00:00.000Z`) : null,
  isPublished: input.isPublished ? 1 : 0,
});

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

  backup: router({
    summary: ownerProcedure.query(async () => getPortableBackupSummary()),
    core: ownerProcedure.query(async () => ({
      exportedAt: new Date().toISOString(),
      database: await getPortableBackupCore(),
    })),
    analyticsChunk: ownerProcedure
      .input(z.object({ offset: z.number().int().min(0).default(0), limit: z.number().int().min(1).max(5000).default(5000) }))
      .query(async ({ input }) => ({
        offset: input.offset,
        limit: input.limit,
        events: await getPortableBackupAnalyticsChunk(input.offset, input.limit),
      })),
    history: ownerProcedure.query(async () => getBackupOperationHistory(30)),
    startOperation: ownerProcedure
      .input(z.object({ operationType: z.enum(["export", "import", "safety_backup"]), fileName: z.string().max(255).optional(), stage: z.string().max(120).optional(), totalRecords: z.number().int().min(0).default(0), recordSummary: z.string().max(10000).optional() }))
      .mutation(async ({ input }) => ({ id: await createBackupOperation({ ...input, status: "started", progress: 0, processedRecords: 0 }) })),
    updateOperation: ownerProcedure
      .input(z.object({ id: z.number().int().positive(), status: z.enum(["started", "success", "failed"]).optional(), stage: z.string().max(120).optional(), progress: z.number().int().min(0).max(100).optional(), processedRecords: z.number().int().min(0).optional(), totalRecords: z.number().int().min(0).optional(), recordSummary: z.string().max(10000).optional(), errorMessage: z.string().max(5000).optional(), completedAt: z.string().datetime().optional() }))
      .mutation(async ({ input }) => {
        const { id, completedAt, ...data } = input;
        await updateBackupOperation(id, { ...data, ...(completedAt ? { completedAt: new Date(completedAt) } : {}) });
        return { success: true as const };
      }),
    createSafetyBackup: ownerProcedure
      .mutation(async () => {
        const operationId = await createBackupOperation({ operationType: "safety_backup", status: "started", stage: "Собираем текущий snapshot", progress: 0, processedRecords: 0, totalRecords: 0 });
        try {
          const backup = await createPortableDatabaseSafetyBackup();
          await updateBackupOperation(operationId, { status: "success", stage: "Safety backup сохранён", progress: 100, processedRecords: backup.summary.analytics, totalRecords: backup.summary.analytics, recordSummary: JSON.stringify(backup.summary), completedAt: new Date() });
          return { operationId, ...backup };
        } catch (error) {
          await updateBackupOperation(operationId, { status: "failed", stage: "Safety backup не создан", errorMessage: error instanceof Error ? error.message : "Unknown safety backup error", completedAt: new Date() });
          throw error;
        }
      }),
    validateImport: ownerProcedure
      .input(z.object({
        packageType: z.literal(BACKUP_PACKAGE_TYPE),
        schemaVersion: z.literal(BACKUP_SCHEMA_VERSION),
        exportedAt: z.string().datetime(),
        projectTitle: z.string().min(1).max(255),
        counts: z.object({ users: z.number().int().min(0), testimonials: z.number().int().min(0), collaborations: z.number().int().min(0), analytics: z.number().int().min(0) }),
        staticLanguages: z.number().int().min(0).max(20),
      }))
      .mutation(({ input }) => ({ valid: true as const, ...input })),
    previewImport: ownerProcedure
      .input(z.object({
        testimonialsIds: z.array(z.number().int().min(0)).max(500000),
        collaborationsIds: z.array(z.number().int().min(0)).max(500000),
        analyticsIds: z.array(z.number().int().min(0)).max(500000),
      }))
      .mutation(async ({ input }) => getPortableBackupImportDiff(input)),
    restoreTestimonials: ownerProcedure
      .input(z.object({ rows: z.array(z.record(z.string(), z.any())).max(1000) }))
      .mutation(async ({ input }) => ({ restored: await restorePortableBackupTestimonials(input.rows) })),
    restoreCollaborations: ownerProcedure
      .input(z.object({ rows: z.array(z.record(z.string(), z.any())).max(1000) }))
      .mutation(async ({ input }) => ({ restored: await restorePortableBackupCollaborations(input.rows) })),
    restoreAnalyticsBatch: ownerProcedure
      .input(z.object({ rows: z.array(z.record(z.string(), z.any())).min(1).max(1000) }))
      .mutation(async ({ input }) => ({ restored: await restorePortableBackupAnalyticsBatch(input.rows) })),
  }),

  testimonials: router({
    getByLanguage: publicProcedure
      .input(z.object({ language: z.string().default("en") }))
      .query(async ({ input }) => {
        return await getTestimonialsByLanguage(input.language);
      }),
  }),

  collaborations: router({
    publicList: publicProcedure.query(async () => getManagedCollaborations(false)),
    list: adminProcedure.query(async () => getManagedCollaborations(true)),
    create: adminProcedure
      .input(collaborationInputSchema)
      .mutation(async ({ input }) => {
        await createManagedCollaboration(toDbCollaboration(input));
        return { success: true } as const;
      }),
    update: adminProcedure
      .input(z.object({ id: z.number().int().positive(), data: collaborationInputSchema }))
      .mutation(async ({ input }) => {
        await updateManagedCollaboration(input.id, toDbCollaboration(input.data));
        return { success: true } as const;
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await deleteManagedCollaboration(input.id);
        return { success: true } as const;
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
    dashboard: adminProcedure
      .input(
        z.object({
          days: z.number().int().min(1).max(365).default(30),
          startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Неверный формат даты").optional(),
          endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Неверный формат даты").optional(),
        }).refine(
          (data) => {
            if (data.startDate && data.endDate) {
              const start = new Date(data.startDate);
              const end = new Date(data.endDate);
              if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
              return start <= end;
            }
            return true;
          },
          { message: "Дата начала не может быть позже даты окончания или содержать ошибку" }
        )
      )
      .query(async ({ input }) => {
        return await getAnalyticsDashboard(input.days, input.startDate, input.endDate);
      }),
  }),

  brandRequests: router({
    submit: publicProcedure
      .input(
        z.object({
          brandName: z.string().min(1, "Укажите название бренда"),
          contactName: z.string().min(1, "Укажите контактное лицо"),
          email: z.string().email("Укажите корректный email"),
          telegram: z.string().optional(),
          category: z.string().min(1),
          goal: z.string().min(1),
          format: z.string().min(1),
          budget: z.string().optional(),
          description: z.string().min(1, "Опишите задачу"),
        })
      )
      .mutation(async ({ input }) => {
        const id = await createBrandRequest({
          ...input,
          telegram: input.telegram ?? null,
          budget: input.budget ?? null,
          status: "new",
        });
        await notifyOwner({
          title: `Новая заявка на сотрудничество: ${input.brandName}`,
          content: `Категория: ${input.category}\nЦель: ${input.goal}\nФормат: ${input.format}\nEmail: ${input.email}`,
        });
        return { success: true, id };
      }),
    list: adminProcedure.query(async () => {
      return await getBrandRequests();
    }),
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["new", "reviewing", "discussion", "confirmed", "archived"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateBrandRequestStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  caseStudies: router({
    getForCollaboration: publicProcedure
      .input(z.object({ collaborationId: z.number() }))
      .query(async ({ input }) => {
        return await getCaseStudiesForCollaboration(input.collaborationId);
      }),
    upsert: adminProcedure
      .input(
        z.object({
          collaborationId: z.number(),
          clientGoal: z.string(),
          creativeDirection: z.string(),
          deliverablesJson: z.string(),
          resultsSummary: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await upsertCaseStudy({
          ...input,
          resultsSummary: input.resultsSummary ?? null,
        });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ReqEventGetPublishedSchema = z.strictObject({
  search: z.string().min(1).optional(),
  authorId: z.coerce.number().int().positive().optional(),
  startFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .transform((val) => new Date(`${val}T00:00:00.000Z`))
    .optional(),
  startUntil: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .transform((val) => {
      const d = new Date(`${val}T00:00:00.000Z`);
      d.setUTCHours(23, 59, 59, 999);
      return d;
    })
    .optional(),
});
export class ReqEventGetPublishedDto extends createZodDto(ReqEventGetPublishedSchema) {}

export const ReqEventGetByIdSchema = z.strictObject({
  id: z.coerce.number().int().positive(),
});
export class ReqEventGetByIdDto extends createZodDto(ReqEventGetByIdSchema) {}

const ResEventAuthorSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const ResEventBaseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  content: z.string().nullable(),
  published: z.boolean(),
  createdAt: z.date(),
  author: ResEventAuthorSchema.nullable(),
  startAt: z.date().nullable(),
  endAt: z.date().nullable(),
});

export const ResEventGetPublishedSchema = z.array(ResEventBaseSchema);
export const ResEventGetByIdSchema = ResEventBaseSchema.nullable();

export const ReqEventCreateDraftSchema = z.strictObject({
  title: z.string(),
  authorId: z.number().int().positive(),
  startAt: z.iso.datetime(),
  endAt: z.iso.datetime(),
  content: z.string().optional(),
  isPublic: z.boolean(),
});
export class ReqEventCreateDraftDto extends createZodDto(ReqEventCreateDraftSchema) {}

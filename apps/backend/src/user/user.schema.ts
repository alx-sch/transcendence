import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ReqUserCreateSchema = z.object({
  name: z.string().optional(),
  email: z.email(),
});
export class ReqUserCreateDto extends createZodDto(ReqUserCreateSchema) {}

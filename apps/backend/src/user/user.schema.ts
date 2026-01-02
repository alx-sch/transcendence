import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * VARIABLES
 */
const zId = z.number().int().positive();
const zName = z.string().optional();
const zEmail = z.email();

/**
 * SHARED RESPONSE SCHEMAS
 */

// Response schema for the basic user info
export const ResUserBaseSchema = z.object({
  id: zId,
  name: zName,
});

/**
 * REQ / RES SCHEMAS FOR ROUTES
 */

// Get all users
export const ReqUserGetAllSchema = z.strictObject({});
export class ReqUserGetAllDto extends createZodDto(ReqUserGetAllSchema) {}
export const ResUserGetAllSchema = z.array(ResUserBaseSchema);

// Post a new event draft
export const ReqUserPostSchema = z.object({
  name: zName,
  email: zEmail,
});
export class ReqUserPostDto extends createZodDto(ReqUserPostSchema) {}
export const ResUserPostSchema = z.object({}).loose(); // return everything

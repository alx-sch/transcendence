import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  // JWT_SECRET: z.string().min(32),
  // JWT_SECRET2: z.string().min(32),
  BE_PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n❌ Invalid Environment Variables:');

  for (const err of parsed.error.issues) {
    const path = err.path.join('.');
    console.error(`  - ${path}: ${err.message}`);
  }

  console.error(''); // Extra spacing for the CLI
  process.exit(1);
}

export const env = parsed.data;

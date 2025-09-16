// server/src/routes/shared.schemas.js
import { z } from 'zod';

// Common pieces you can reuse in routes
export const idParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'id is required'),
  }),
});

export const paginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, 'page must be a number').optional(),
    limit: z.string().regex(/^\d+$/, 'limit must be a number').optional(),
  }),
});

// Example note body
export const noteBodySchema = z.object({
  body: z.object({
    title: z.string().min(1, 'title is required'),
    content: z.string().min(1, 'content is required'),
  }),
});

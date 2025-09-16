
import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().trim().optional()
});

export const updateNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").optional(),
  content: z.string().trim().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "Provide at least one field to update"
});

export const listNotesQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});

import { Router } from "express";
import Note from "../models/Note.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createNoteSchema, updateNoteSchema, listNotesQuerySchema } from "../validation/note.schema.js";
import { idParamSchema } from "../schemas/shared.schemas.js"; // or define here as shown above

const router = Router();

// Create
router.post("/", auth, validate(createNoteSchema), async (req, res, next) => {
  try {
    const note = await Note.create({ ...req.body, user: req.user._id });
    res.status(201).json(note);
  } catch (e) { next(e); }
});

// List (with optional q/page/limit)
router.get("/", auth, validate(listNotesQuerySchema, "query"), async (req, res, next) => {
  try {
    const { q, page, limit } = req.query;
    const filter = { user: req.user._id };
    if (q) filter.title = { $regex: q, $options: "i" };

    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Note.countDocuments(filter);
    res.json({ data: notes, page, limit, total });
  } catch (e) { next(e); }
});

// Update
router.patch("/:id", auth, validate(idParamSchema, "params"), validate(updateNoteSchema), async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (e) { next(e); }
});

// Delete
router.delete("/:id", auth, validate(idParamSchema, "params"), async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ success: true });
  } catch (e) { next(e); }
});

export default router;

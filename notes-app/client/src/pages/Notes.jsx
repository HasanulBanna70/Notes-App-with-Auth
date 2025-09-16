// src/pages/Notes.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/notes");
      // Backend might return either an array or { data: [] }
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setNotes(list);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const res = await api.post("/notes", {
        title: form.title.trim(),
        content: form.content.trim(),
      });
      setNotes((prev) => [res.data, ...prev]);  // prepend new note
      setForm({ title: "", content: "" });
    } catch (err) {
      // show Zod validation nicely if present
      const zodIssues = err?.response?.data?.issues || err?.response?.data?.errors?.fieldErrors;
      if (zodIssues) {
        const first =
          Array.isArray(zodIssues.title) ? zodIssues.title[0] :
          zodIssues?.[0]?.message || "Validation failed";
        setError(first);
      } else {
        setError(err?.response?.data?.error || "Failed to create note");
      }
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this note?")) return;
    const old = notes;
    setNotes((prev) => prev.filter((n) => n._id !== id)); // optimistic
    try {
      await api.delete(`/notes/${id}`);
    } catch (err) {
      // rollback on failure
      setNotes(old);
      alert(err?.response?.data?.error || "Failed to delete note");
    }
  };

  const empty = useMemo(() => !loading && notes.length === 0, [loading, notes]);

  return (
    <div className="container">
      <h2 className="mb-3">My Notes</h2>

      {/* Create form */}
      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-2 align-items-start" onSubmit={onCreate}>
            <div className="col-12 col-md-3">
              <input
                className="form-control"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-12 col-md-7">
              <input
                className="form-control"
                name="content"
                placeholder="Content (optional)"
                value={form.content}
                onChange={onChange}
              />
            </div>
            <div className="col-12 col-md-2 d-grid">
              <button className="btn btn-primary" type="submit" disabled={creating}>
                {creating ? "Creating..." : "Add Note"}
              </button>
            </div>
          </form>
          {error && <div className="text-danger mt-2">{error}</div>}
        </div>
      </div>

      {/* List */}
      {loading && <div>Loading…</div>}
      {empty && <div className="text-muted">No notes yet. Create your first note above.</div>}

      <div className="vstack gap-3">
        {notes.map((n) => (
          <div className="card" key={n._id}>
            <div className="card-body d-flex justify-content-between align-items-start">
              <div>
                <h5 className="card-title mb-1">{n.title}</h5>
                {n.content && <p className="mb-1">{n.content}</p>}
                <small className="text-muted">
                  {new Date(n.createdAt || Date.now()).toLocaleString()}
                </small>
              </div>
              <div className="d-flex gap-2">
                {/* Delete button */}
                <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(n._id)}>
                  Delete
                </button>
                {/* (Optional) Add Edit later */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

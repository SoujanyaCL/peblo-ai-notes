import { useEffect, useState } from "react";
import API from "./api";

function History() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEARCH STATE
  const [search, setSearch] = useState("");

  // FETCH NOTES
  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");

      console.log("FULL RESPONSE:", res.data);

      const data = (res.data?.data || []).filter(
        (note) => note.archived !== true
      );

      if (Array.isArray(data)) {
        // SORT BY LATEST
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setNotes(sorted);
        setFilteredNotes(sorted);
      } else {
        setNotes([]);
        setFilteredNotes([]);
      }
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err.message);

      setNotes([]);
      setFilteredNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // SHARE NOTE
  const shareNote = async (id) => {
    try {
      const res = await API.post(`/notes/${id}/share`);

      const link = res.data.shareLink;

      // copy link
      await navigator.clipboard.writeText(link);

      alert("Share link copied!\n\n" + link);
    } catch (err) {
      console.log(err);
      alert("Error generating share link");
    }
  };

  // ARCHIVE NOTE
  const archiveNote = async (id) => {
    try {
      await API.put(`/notes/${id}`, {
        archived: true,
      });

      // remove archived note from UI
      const updated = notes.filter((note) => note._id !== id);

      setNotes(updated);
      setFilteredNotes(updated);

      alert("Note archived successfully");
    } catch (err) {
      console.log(err);
      alert("Error archiving note");
    }
  };

  // DELETE NOTE
  const deleteNote = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/notes/${id}`);

      const updated = notes.filter((note) => note._id !== id);

      setNotes(updated);
      setFilteredNotes(updated);
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err.message);
    }
  };

  // SEARCH FILTER
  useEffect(() => {
    const filtered = notes.filter((note) => {
      const title = note.title?.toLowerCase() || "";
      const summary = note.summary?.toLowerCase() || "";
      const content = note.content?.toLowerCase() || "";

      return (
        title.includes(search.toLowerCase()) ||
        summary.includes(search.toLowerCase()) ||
        content.includes(search.toLowerCase())
      );
    });

    setFilteredNotes(filtered);
  }, [search, notes]);

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        padding: 30,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "white",
          padding: 30,
          borderRadius: 16,
          boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            marginBottom: 25,
            textAlign: "center",
          }}
        >
          📜 History
        </h1>

        {/* SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 25,
            borderRadius: 10,
            border: "1px solid #ccc",
            fontSize: 16,
            outline: "none",
          }}
        />

        {loading ? (
          <p>Loading...</p>
        ) : filteredNotes.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#777",
            }}
          >
            <h2>No Notes Found</h2>

            <p>
              Start generating AI notes to see them here.
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note._id}
              style={{
                border: "1px solid #e5e7eb",
                padding: 24,
                marginBottom: 24,
                borderRadius: 14,
                background: "#fafafa",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <h2
                style={{
                  marginBottom: 8,
                }}
              >
                {note.title}
              </h2>

              {/* NOTE ID */}
              <p
                style={{
                  fontSize: 12,
                  color: "gray",
                  marginBottom: 15,
                }}
              >
                {note._id}
              </p>

              <p
                style={{
                  color: "#555",
                  lineHeight: 1.8,
                  marginBottom: 18,
                }}
              >
                {note.summary || note.content}
              </p>

              <h4>Action Items</h4>

              <ul
                style={{
                  marginBottom: 20,
                }}
              >
                {(note.actionItems || []).map((item, i) => (
                  <li
                    key={i}
                    style={{
                      marginBottom: 6,
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>

              {/* BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => shareNote(note._id)}
                  style={{
                    padding: "10px 18px",
                    background: "#1677ff",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Share
                </button>

                <button
                  onClick={() => archiveNote(note._id)}
                  style={{
                    padding: "10px 18px",
                    background: "#faad14",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Archive
                </button>

                <button
                  onClick={() => deleteNote(note._id)}
                  style={{
                    padding: "10px 18px",
                    background: "#ff4d4f",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "./api";

function SharedNote() {
  const { shareId } = useParams();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSharedNote = async () => {
    try {
      const res = await API.get(
        `/notes/shared/${shareId}`
      );

      setNote(res.data.data);
    } catch (err) {
      console.log(err);
      alert("Shared note not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedNote();
  }, []);

  if (loading) {
    return <h2 style={{ padding: 20 }}>Loading...</h2>;
  }

  if (!note) {
    return <h2 style={{ padding: 20 }}>Note not found</h2>;
  }

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
          maxWidth: 800,
          margin: "0 auto",
          background: "white",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1>{note.title}</h1>

        <p
          style={{
            color: "#555",
            lineHeight: 1.7,
            marginTop: 20,
          }}
        >
          {note.summary || note.content}
        </p>

        <h3 style={{ marginTop: 30 }}>Action Items</h3>

        <ul>
          {(note.actionItems || []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SharedNote;
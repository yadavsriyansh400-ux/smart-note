import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");

  // Fetch notes
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    fetch("http://localhost:5000/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error(err));
  };

  // Add note
  const addNote = () => {
    if (!title.trim()) return;

    fetch("http://localhost:5000/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then(() => {
        setTitle("");
        fetchNotes();
      });
  };

  // Delete note
  const deleteNote = (id) => {
    fetch(`http://localhost:5000/api/notes/${id}`, {
      method: "DELETE",
    }).then(() => fetchNotes());
  };

  return (
    <div className="app">
      <h1 className="title">📝 Smart Notes App</h1>

      {/* Input Section */}
      <div className="input-box">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Write your note..."
        />

        <button onClick={addNote}>Add</button>
      </div>

      {/* Notes Grid */}
      <div className="grid">
        {notes.map((note) => (
          <div
            key={note._id}
            className="card"
            onClick={() => {
              setSelectedNote(note);
              setIsEditing(false);
            }}
          >
            {note.title}
          </div>
        ))}
      </div>

      {/* Modal (Island View) */}
      {selectedNote && (
        <div className="modal">
          <div className="modal-content">

            {/* Content */}
            {isEditing ? (
              <input
                className="modal-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            ) : (
              <h2>{selectedNote.title}</h2>
            )}

            {/* Actions */}
            <div className="modal-actions">
              {isEditing ? (
                <button
                  className="update"
                  onClick={() => {
                    fetch(`http://localhost:5000/api/notes/${selectedNote._id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ title: editText }),
                    })
                      .then((res) => res.json())
                      .then(() => {
                        setIsEditing(false);
                        setSelectedNote(null);
                        fetchNotes();
                      });
                  }}
                >
                  Save
                </button>
              ) : (
                <button
                  className="update"
                  onClick={() => {
                    setIsEditing(true);
                    setEditText(selectedNote.title);
                  }}
                >
                  Update
                </button>
              )}

              <button
                className="delete"
                onClick={() => {
                  deleteNote(selectedNote._id);
                  setSelectedNote(null);
                }}
              >
                Delete
              </button>
            </div>

            {/* Close */}
            <span
              className="close"
              onClick={() => setSelectedNote(null)}
            >
              ✕
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
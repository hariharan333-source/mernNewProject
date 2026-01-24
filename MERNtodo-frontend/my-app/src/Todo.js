
import React, { useEffect, useState } from "react";

export const Todo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  // Edit fields
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000";

  // Create
  const handleSubmit = () => {
    setError("");
    if (title.trim() === "" || description.trim() === "") {
      setError("Please enter title and description");
      return;
    }

    fetch(`${apiUrl}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((newTodo) => {
        // Use server-returned todo (includes _id)
        setTodos((prev) => [...prev, newTodo]);
        setTitle("");
        setDescription("");
        setMessage("Item added successfully");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to create Todo item");
      });
  };

  // Read
  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(`${apiUrl}/todos`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((res) => setTodos(res))
      .catch((err) => {
        console.error(err);
        setError("Unable to fetch todos");
      });
  };

  // Start editing a todo
  const handleEdit = (item) => {
    if (!item._id) {
      setError("This item is not yet saved on server. Please refresh after creating.");
      return;
    }
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setError("");
  };

  // Update
  const handleUpdate = () => {
    setError("");
    if (!editId || editId === -1) {
      setError("No item selected for update");
      return;
    }
    if (editTitle.trim() === "" || editDescription.trim() === "") {
      setError("Please enter title and description");
      return;
    }

    fetch(`${apiUrl}/todos/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, description: editDescription }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((updatedTodo) => {
        setTodos((prev) => prev.map((t) => (t._id === editId ? updatedTodo : t)));
        setEditTitle("");
        setEditDescription("");
        setMessage("Item updated successfully");
        setTimeout(() => setMessage(""), 3000);
        setEditId(-1);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to update todo item");
      });
  };

  const handleEditCancel = () => {
    setEditId(-1);
    setEditTitle("");
    setEditDescription("");
    setError("");
  };

  // Delete
  const handleDelete = (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure want to delete?")) return;

    fetch(`${apiUrl}/todos/${id}`, { method: "DELETE" })
      .then((res) => {
        // your backend returns 204 No Content on success
        if (res.status !== 204 && !res.ok) throw new Error(`HTTP ${res.status}`);
        setTodos((prev) => prev.filter((item) => item._id !== id));
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to delete todo");
      });
  };

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>ToDo Project with MERN stack</h1>
      </div>

      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="form-control"
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>

      <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6">
          <ul className="list-group">
            {todos.map((item, idx) => (
              <li
                key={item._id ?? idx}
                className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
              >
                <div className="d-flex flex-column me-2">
                  {editId === -1 || editId !== item._id ? (
                    <>
                      <span className="fw-bold">{item.title}</span>
                      <span>{item.description}</span>
                    </>
                  ) : (
                    <div className="form-group d-flex gap-2">
                      <input
                        placeholder="Title"
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                        className="form-control"
                        type="text"
                      />
                      <input
                        placeholder="Description"
                        onChange={(e) => setEditDescription(e.target.value)}
                        value={editDescription}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {editId === item._id ? (
                    <button className="btn btn-warning" onClick={handleUpdate}>
                      Update
                    </button>
                  ) : (
                    <button className="btn btn-warning" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                  )}

                  {editId === item._id ? (
                    <button className="btn btn-danger" onClick={handleEditCancel}>
                      Cancel
                    </button>
                  ) : (
                    <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
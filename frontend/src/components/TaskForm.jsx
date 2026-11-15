import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
};

const TaskForm = ({ task, onSave, onClose }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        status: task.status || "Pending",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().slice(0, 10)
          : "",
      });
    } else {
      setForm(initialForm);
    }
  }, [task]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    setLoading(true);

    try {
      await onSave({
        ...form,
        dueDate: form.dueDate
          ? new Date(`${form.dueDate}T12:00:00`).toISOString()
          : null,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="task-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>{task ? "Edit Task" : "Create New Task"}</h2>
            <p>Organize your work and stay productive.</p>
          </div>

          <button className="icon-btn" onClick={onClose}>
            <X size={21} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Task Title *</label>

          <input
            name="title"
            placeholder="e.g. Complete React project"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>

          <textarea
            name="description"
            placeholder="Describe your task..."
            value={form.description}
            onChange={handleChange}
            rows="4"
          />

          <div className="form-row">
            <div>
              <label>Priority</label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label>Status</label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <label>Due Date</label>

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : task
                ? "Update Task"
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
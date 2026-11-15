import {
  CalendarDays,
  Pencil,
  Trash2,
  CheckCircle2,
} from "lucide-react";

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No deadline";

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "Completed";

  return (
    <article className="task-card">
      <div className="task-top">
        <div className="task-badges">
          <span
            className={`priority-badge ${task.priority.toLowerCase()}`}
          >
            {task.priority} Priority
          </span>

          <span
            className={`status-badge ${task.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {task.status}
          </span>
        </div>

        <div className="task-actions">
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="icon-btn"
          >
            <Pencil size={17} />
          </button>

          <button
            onClick={() => onDelete(task._id)}
            title="Delete task"
            className="icon-btn delete-icon"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <h3 className={task.status === "Completed" ? "completed-title" : ""}>
        {task.title}
      </h3>

      <p className="task-description">
        {task.description || "No description provided."}
      </p>

      <div className="task-bottom">
        <span className={isOverdue ? "overdue" : "due-date"}>
          <CalendarDays size={16} />
          {isOverdue ? "Overdue: " : "Due: "}
          {formattedDate}
        </span>

        {task.status !== "Completed" && (
          <button
            className="complete-btn"
            onClick={() =>
              onStatusChange(task._id, "Completed")
            }
          >
            <CheckCircle2 size={16} />
            Complete
          </button>
        )}
      </div>
    </article>
  );
};

export default TaskCard;
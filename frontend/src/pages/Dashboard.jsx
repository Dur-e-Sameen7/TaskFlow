import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Plus,
  Search,
  ListTodo,
  Clock,
  CheckCircle2,
  TrendingUp,
  Filter,
} from "lucide-react";

import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Fetch tasks from backend
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api("/tasks");
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create or update task
  const handleSaveTask = async (formData) => {
    try {
      if (editingTask) {
        const data = await api(`/tasks/${editingTask._id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });

        setTasks((previous) =>
          previous.map((task) =>
            task._id === editingTask._id ? data.task : task
          )
        );
      } else {
        const data = await api("/tasks", {
          method: "POST",
          body: JSON.stringify(formData),
        });

        setTasks((previous) => [data.task, ...previous]);
      }

      setEditingTask(null);
    } catch (err) {
      alert(err.message);
      throw err;
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await api(`/tasks/${id}`, {
        method: "DELETE",
      });

      setTasks((previous) =>
        previous.filter((task) => task._id !== id)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Change task status
  const handleStatusChange = async (id, status) => {
    try {
      const data = await api(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      setTasks((previous) =>
        previous.map((task) =>
          task._id === id ? data.task : task
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Open edit modal
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Statistics
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  // Search and filter
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const openNewTaskForm = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="dashboard-container">
        <section className="welcome-section">
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>

            <h1>
              Good day, {user?.name?.split(" ")[0]}!
            </h1>

            <p className="welcome-text">
              Stay organized, focused, and productive.
            </p>
          </div>

          <button
            className="primary-btn add-task-btn"
            onClick={openNewTaskForm}
          >
            <Plus size={19} />
            Add New Task
          </button>
        </section>

        {/* Statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">
              <ListTodo />
            </div>

            <div>
              <p>Total Tasks</p>
              <h2>{totalTasks}</h2>
              <span>All your tasks</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Clock />
            </div>

            <div>
              <p>Pending</p>
              <h2>{pendingTasks}</h2>
              <span>Waiting to start</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <TrendingUp />
            </div>

            <div>
              <p>In Progress</p>
              <h2>{inProgressTasks}</h2>
              <span>Currently working</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <CheckCircle2 />
            </div>

            <div>
              <p>Completed</p>
              <h2>{completedTasks}</h2>
              <span>Successfully finished</span>
            </div>
          </div>
        </section>

        {/* Productivity */}
        <section className="productivity-card">
          <div className="productivity-heading">
            <div>
              <h3>Productivity Overview</h3>
              <p>Your overall task completion progress</p>
            </div>

            <strong>{completionRate}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <p className="progress-caption">
            {completedTasks} out of {totalTasks} tasks completed
          </p>
        </section>

        {/* Task section */}
        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <h2>My Tasks</h2>
              <p>Manage and organize your daily activities.</p>
            </div>

            <span className="task-count">
              {filteredTasks.length} Tasks
            </span>
          </div>

          {/* Search and filters */}
          <div className="filter-toolbar">
            <div className="search-box">
              <Search size={19} />

              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-select">
              <Filter size={17} />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="filter-select">
              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Task cards */}
          {loading ? (
            <div className="empty-state">
              Loading your tasks...
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <ListTodo size={35} />
              </div>

              <h3>No tasks found</h3>

              <p>
                {tasks.length
                  ? "Try changing your search or filters."
                  : "Start organizing your work by creating your first task."}
              </p>

              {tasks.length === 0 && (
                <button
                  className="primary-btn"
                  onClick={openNewTaskForm}
                >
                  <Plus size={17} />
                  Create First Task
                </button>
              )}
            </div>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="dashboard-footer">
          <p>© 2026 TaskFlow. Stay focused. Get things done.</p>
        </footer>
      </main>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
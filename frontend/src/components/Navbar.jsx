import { LogOut, CheckSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <CheckSquare size={23} />
        </div>
        <span>TaskFlow</span>
      </div>

      <div className="nav-right">
        <div className="user-info">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <span>{user?.name}</span>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
          title="Logout"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
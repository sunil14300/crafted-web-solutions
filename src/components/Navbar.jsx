import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, worker, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = isLoggedIn
    ? [
        { label: "Home", path: "/" },
        { label: "Search", path: "/search" },
      ]
    : [
        { label: "Home", path: "/" },
        { label: "Search", path: "/search" },
        { label: "Register", path: "/register" },
        { label: "Login", path: "/login" },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container flex items-center justify-between h-14">
        <Link to="/" className="font-mono text-lg font-bold tracking-tight safety-link">
          SEVA<span className="text-primary">.</span>WEBSITE
        </Link>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-mono text-xs uppercase tracking-widest safety-link ${
                location.pathname === item.path ? "text-primary" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          {isLoggedIn && (
            <>
              <span className="font-mono text-xs text-muted-foreground">
                {worker?.name || worker?.registrationId}
              </span>
              <button
                onClick={handleLogout}
                className="font-mono text-xs uppercase tracking-widest text-destructive hover:opacity-80 transition-opacity"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, isAdmin, isWorker, isCustomer, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  let navItems = [
    { label: "Home", path: "/" },
    { label: "Search", path: "/search" },
  ];

  if (!isLoggedIn) {
    navItems.push({ label: "Register", path: "/register" });
    navItems.push({ label: "Login", path: "/login" });
  } else {
    if (isCustomer) {
      navItems.push({ label: "My Bookings", path: "/my-bookings" });
    }
    if (isWorker) {
      navItems.push({ label: "Dashboard", path: "/dashboard" });
    }
    if (isAdmin) {
      navItems.push({ label: "Admin", path: "/admin" });
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container flex items-center justify-between h-14">
        <Link to="/" className="font-mono text-lg font-bold tracking-tight safety-link">
          SEVA<span className="text-primary">.</span>WEBSITE
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
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
                {user?.name} <span className="text-primary">({user?.role})</span>
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

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 font-mono text-xs uppercase tracking-widest safety-link ${
                location.pathname === item.path ? "text-primary" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          {isLoggedIn && (
            <div className="pt-2 border-t border-border mt-2">
              <span className="block py-1 font-mono text-xs text-muted-foreground">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="font-mono text-xs uppercase tracking-widest text-destructive"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

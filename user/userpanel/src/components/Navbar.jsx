import { Link, useNavigate } from "react-router-dom";
import { getRole, clearSession } from "../auth/session";

export default function Navbar() {
  const navigate = useNavigate();
  const role = getRole();

  const handleSignOut = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <header className="netflix-navbar">
      <Link to="/" className="brand-link">
        ZENIX
      </Link>
      <nav className="nav-links-simple">
        <Link to="/">Discover</Link>
      </nav>
      <nav className="nav-right-simple">
        {role === "admin" && (
          <Link className="muted-link" to="/staff">
            Staff dashboard
          </Link>
        )}
        {role != null && (
          <button type="button" className="nav-text-btn muted-link" onClick={handleSignOut}>
            Sign out
          </button>
        )}
      </nav>
    </header>
  );
}

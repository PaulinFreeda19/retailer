import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path: string) =>
    `block px-2 py-1 rounded ${
      location.pathname === path
        ? "bg-blue-500 text-white"
        : "hover:text-blue-600"
    }`;

  return (
    <div className="w-52 bg-gray-100 h-screen p-4">
      <nav className="flex flex-col gap-2">
        <Link to="/" className={linkClass("/")}>
          Dashboard
        </Link>

        <Link to="/inventory" className={linkClass("/inventory")}>
          Inventory
        </Link>

        <Link to="/orders" className={linkClass("/orders")}>
          Orders
        </Link>

        <Link to="/delivery" className={linkClass("/delivery")}>
          Delivery
        </Link>

        <Link to="/settings" className={linkClass("/settings")}>
          Settings
        </Link>

        <Link to="/profile" className={linkClass("/profile")}>
          Profile
        </Link>
      </nav>
    </div>
  );
}
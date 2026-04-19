import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: any) {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">{children}</div>
      </div>
    </div>
  );
}
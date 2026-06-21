import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LayoutDashboard, ListTodo, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

import { clearAuthData } from "../services/redux/slice/authSlice";
import type { RootState } from "../services/redux/store";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const authData = useSelector((state: RootState) => state.authData.authData);

  const logout = () => {
    dispatch(clearAuthData());
    navigate("/login");
  };

  const menus = [
    {
      label: "Dashboard",
      path: "/app/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { label: "Tasks", path: "/app/tasks", icon: <ListTodo size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-950 text-white p-5 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold">TaskFlow</h1>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <nav className="space-y-2">
          {menus.map((menu) => {
            const active = location.pathname === menu.path;

            return (
              <button
                key={menu.path}
                onClick={() => {
                  navigate(menu.path);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition
                ${
                  active
                    ? "bg-white text-slate-950 font-medium"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {menu.icon}
                {menu.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="lg:ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-white border-b h-16 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu size={24} />
            </button>

            <div className="min-w-0">
              <p className="font-semibold truncate">{authData?.username}</p>
              <p className="text-xs sm:text-sm text-slate-500 truncate max-w-[180px] sm:max-w-[360px]">
                {authData?.email}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        <main className="p-4 sm:p-6 max-w-[1500px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

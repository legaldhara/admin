import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, LogOut, X } from "lucide-react";
import { SIDEBAR_DATA } from "../lib/static";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Store/Store";
import { logout } from "../Store/authSlice";

interface SidebarItemProps {
  label: string;
  href?: string;
  icon: any;
  children?: SidebarItemProps[];
}

function SidebarItem({ label, href, icon: Icon, children }: SidebarItemProps) {
  const location = useLocation();
  const [open, setOpen] = useState(false);



  // Check if current path matches this item or any of its children
  const isChildActive = children?.some((child) =>
    location.pathname.startsWith(child.href || "")
  );
  const isActive = location.pathname.startsWith(href || "") || isChildActive;

  // Auto-open submenu if child is active
  useEffect(() => {
    if (isChildActive) setOpen(true);
  }, [isChildActive]);

  if (children && children.length > 0) {
    return (
      <div className={`flex flex-col`}>
        <button
          className={`flex items-center justify-between w-full px-3 py-2 transition-colors ${isActive ? "bg-blue-950 text-white" : "hover:bg-muted"
            }`}
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center gap-2">
            <Icon className="size-4" />
            <span>{label}</span>
          </div>
          <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
            <ChevronDown className="size-4" />
          </span>
        </button>
        {open && (
          <div className="ml-4 flex flex-col gap-1 mt-1">
            {children.map((child) => (
              <SidebarItem key={child.label} {...child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={href || "#"}
      className={({ isActive: linkActive }) =>
        `flex items-center gap-2 px-3 py-2 transition-colors ${linkActive ? "bg-blue-950 text-white" : ""
        }`
      }
    >
      <Icon className="size-4" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Aside() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {  
    dispatch(logout());
  }

  useEffect(() => {
    const toggle = () => setOpen((v) => !v);
    const openEv = () => setOpen(true);
    const closeEv = () => setOpen(false);

    // Listen on both window and document for robustness (some code dispatches on document)
    window.addEventListener("sidebar:toggle", toggle);
    document.addEventListener("sidebar:toggle", toggle);
    // alias
    window.addEventListener("toggle-sidebar", toggle);
    document.addEventListener("toggle-sidebar", toggle);

    window.addEventListener("sidebar:open", openEv);
    document.addEventListener("sidebar:open", openEv);
    window.addEventListener("sidebar:close", closeEv);
    document.addEventListener("sidebar:close", closeEv);

    // Delegated click fallback: if a button/link has data-action attributes
    // we toggle/open/close the sidebar. This works even if CustomEvent
    // dispatching is blocked or not reaching the Aside listener for some reason.
    const onDelegatedClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-action="toggle-sidebar"]')) {
        setOpen((v) => !v);
        return;
      }
      if (target.closest('[data-action="open-sidebar"]')) {
        setOpen(true);
        return;
      }
      if (target.closest('[data-action="close-sidebar"]')) {
        setOpen(false);
        return;
      }
    };
    document.addEventListener("click", onDelegatedClick, true);

    return () => {
      window.removeEventListener("sidebar:toggle", toggle);
      document.removeEventListener("sidebar:toggle", toggle);
      window.removeEventListener("toggle-sidebar", toggle);
      document.removeEventListener("toggle-sidebar", toggle);

      window.removeEventListener("sidebar:open", openEv);
      document.removeEventListener("sidebar:open", openEv);
      window.removeEventListener("sidebar:close", closeEv);
      document.removeEventListener("sidebar:close", closeEv);
      document.removeEventListener("click", onDelegatedClick, true);
    };
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const SidebarContent = (
    <div className="flex flex-col bg-white w-60 max-w-[320px] h-screen px-4 py-5 border-r border-border">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-border">
        <div className="flex justify-center items-center gap-2 pb-[6px]">
          <img src="/admin/logo-sq.png" alt="banner" className="object-cover w-40" />
        </div>
        <button className="md:hidden btn" onClick={() => setOpen(false)}>
          <X className="size-4" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {SIDEBAR_DATA.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6">
        <div
          className="flex items-center gap-2 px-3 py-2 hover:bg-red-700 hover:text-white  transition-colors text-red-600"
          onClick={handleLogout}
        >
          <LogOut

            className="size-4" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -16, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="hidden md:flex flex-col h-screen"
      >
        {SidebarContent}
      </motion.aside>

      {/* Mobile Sidebar */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            className="relative min-h-screen z-40 w-[85%] max-w-[320px] bg-background"
          >
            {SidebarContent}
          </motion.aside>
        </div>
      )}
    </>
  );
}

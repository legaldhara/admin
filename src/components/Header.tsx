// import { Menu, Search, UserCircle } from "lucide-react";
// import { motion } from "framer-motion";
// // import { useEffect, useRef, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { getHeaderByRoute } from "./RouterContent";

// import {
//   fetchNotifications,
//   fetchUnreadCount,
//   markAllRead,
//   markOneRead,
//   onNewAdminNotification
// } from "../Store/NotificationSlice";



// export function Header() {
//   // const [notifOpen, setNotifOpen] = useState(false);
//   const location = useLocation();
//   // const [notifications, setNotifications] = useState([
//   //   { id: 1, title: "New application received", time: "2m ago", unread: true },
//   //   { id: 2, title: "Payment of ₹2,499 captured", time: "1h ago", unread: true },
//   //   { id: 3, title: "User profile updated", time: "3h ago", unread: false },
//   // ]);
//   // const unreadCount = notifications.filter((n) => n.unread).length;
//   // const panelRef = useRef<HTMLDivElement | null>(null);

//   // Close notification panel when clicking outside
//   // useEffect(() => {
//   //   const onDocClick = (e: MouseEvent) => {
//   //     if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
//   //       setNotifOpen(false);
//   //     }
//   //   };
//   //   if (notifOpen) document.addEventListener("mousedown", onDocClick);
//   //   return () => document.removeEventListener("mousedown", onDocClick);
//   // }, [notifOpen]);

//   // Sidebar toggle
  // const toggleSidebar = () => {
  //   const ev = new CustomEvent("sidebar:toggle");
  //   // Dispatch on both window and document for robustness
  //   window.dispatchEvent(ev);
  //   document.dispatchEvent(ev);
  // };

//   // Mark all notifications as read
//   // const markAllRead = () => {
//   //   setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
//   // };

//   // // Toggle read/unread for single notification
//   // const toggleRead = (id: number) => {
//   //   setNotifications((prev) =>
//   //     prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
//   //   );
//   // };

//   return (
//     <motion.header
//       initial={{ y: -8, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.2 }}
//       className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/20 backdrop-blur-sm px-4 py-4"
//     >
//       {/* Left: Mobile menu */}
//       <div className="flex items-center gap-3">
//         <button
//           onClick={toggleSidebar}
//           className="btn md:hidden flex items-center gap-2 text-foreground"
//           aria-label="Toggle Sidebar"
//           data-action="toggle-sidebar"
//         >
//           <Menu className="size-5" />
//         </button>
//         <div>
//           <h1 className="">{getHeaderByRoute(location.pathname)}</h1>
//           {
//             // subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>
//           }
//         </div>
//       </div>

//       {/* Right: Search + Notifications + Profile */}
//       <div className="flex items-center gap-3 justify-center">
//         {/* Search (desktop) */}
//         <div className="hidden md:flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-border">
//           <div className="relative w-full md:w-80">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
//             <input
//               className="w-full border border-border bg-card py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
//               placeholder="Search queries..."
//               // value={searchTerm}
//               // onChange={(e) => setSearchTerm(e.target.value)}
//               aria-label="Search queries"
//             />
//           </div>
//         </div>

//         {/* Notifications */}
//         {/* <div className="relative flex items-center justify-center" ref={panelRef}>
//           <button
//             className="btn relative"
//             aria-label="Notifications"
//             onClick={() => setNotifOpen((v) => !v)}
//           >
//             <Bell className="size-6" />
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-accent text-on-accent text-[10px] font-bold w-4 h-4">
//                 {unreadCount}
//               </span>
//             )}
//           </button>

//           {notifOpen && (
//             <motion.div
//               initial={{ opacity: 0, y: -6 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.15 }}
//               className="absolute right-0 mt-2 w-80 card shadow-lg border border-border bg-white"
//               role="dialog"
//               aria-label="Notifications"
//             >
//               <div className="p-3 flex items-center  justify-between border-b border-border">
//                 <p className="font-bold">Notifications</p>
//                 <button className="btn" onClick={markAllRead} aria-label="Mark all as read">
//                   Mark all read
//                 </button>
//               </div>
//               <ul className="max-h-80 overflow-auto">
//                 {notifications.map((n) => (
//                   <li
//                     key={n.id}
//                     className="px-3 py-3 flex items-start gap-3 border-b border-border"
//                   >
//                     <div
//                       className={`mt-1 size-2 rounded-full ${n.unread ? "bg-accent" : "bg-muted"}`}
//                     />
//                     <div className="flex-1">
//                       <p className="text-sm font-semibold">{n.title}</p>
//                       <p className="text-xs text-muted-foreground">{n.time}</p>
//                     </div>
//                     <button
//                       className="btn"
//                       onClick={() => toggleRead(n.id)}
//                       aria-label="Toggle read"
//                     >
//                       {n.unread ? "Mark read" : "Mark unread"}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>
//           )}
//         </div> */}

//         {/* Profile button */}


//         <Link to={"/settings/profile"} title="Profile" className="btn btn-accent text-sm flex items-center justify-center">

//           <UserCircle className="size-6 mr-2 font-normal" />
//         </Link>
//       </div>
//     </motion.header>
//   );
// }


import { Menu, Search, UserCircle, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllRead,
  markOneRead,
  onNewAdminNotification,
} from "../Store/NotificationSlice";
import { getHeaderByRoute } from "./RouterContent";
import { AppDispatch, RootState } from "../Store/Store";
import socket from "../config/socket";

export function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Redux state
  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.notifications
  );


  useEffect(() => {
    socket.connect();
  }, []);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());

    const handler = () => {
      dispatch(onNewAdminNotification());
      dispatch(fetchNotifications());
      dispatch(fetchUnreadCount());
    };

    socket.on("new-notification", handler);

    return () => {
      socket.off("new-notification", handler);
    };
  }, [dispatch]);


  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);



   const toggleSidebar = () => {
    const ev = new CustomEvent("sidebar:toggle");
    // Dispatch on both window and document for robustness
    window.dispatchEvent(ev);
    document.dispatchEvent(ev);
  };

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/20 backdrop-blur-sm px-4 py-4"
    >
      {/* Left: Mobile Menu + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="btn md:hidden flex items-center gap-2 text-foreground"
          aria-label="Toggle Sidebar"
          data-action="toggle-sidebar"
        >
          <Menu className="size-5" />
        </button>

        <h1>{getHeaderByRoute(location.pathname)}</h1>
      </div>

      {/* Right: Search + Notifications + Profile */}
      <div className="flex items-center justify-center gap-3">
        {/* Search */}
        <div className="hidden md:flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              className="w-full border border-border bg-card py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="Search queries..."
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="relative flex" ref={panelRef}>
          <button
            className="btn relative"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
          >
            <Bell className="size-6" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center bg-accent text-on-accent text-[10px] font-bold w-4 h-4 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 card shadow-lg border border-border bg-white"
            >
              {/* Header */}
              <div className="p-3 flex items-center justify-between border-b border-border">
                <p className="font-bold">Notifications</p>

                <button
                  className=" text-xs underline-primary underline text-primary hover:text-primary/80"
                  onClick={() => dispatch(markAllRead())}
                >
                  Mark all read
                </button>
              </div>

              {/* Notification List */}
              <ul className="max-h-80 overflow-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-center text-muted-foreground">
                    No notifications
                  </p>
                ) : (
                  notifications.map((n: any) => (

                    <li
                      key={n.id}
                      className="px-3 py-3 flex items-start gap-3 border-b border-border cursor-pointer"
                      onClick={() => navigate(`${n.clickAction}` || "#")}
                    >
                      <div
                        className={`mt-1 size-2 rounded-full ${n.isRead ? "bg-white" : "bg-accent"
                          }`}
                      />
                      <div className="flex-1">
                        <p className="text-xs font-semibold">{n.title}</p>
                        <p className="text-xs font-normal whitespace-normal">{n.body}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {!n.isRead && (
                        <button
                          className=" text-xs underline-primary underline text-primary hover:text-primary/80"
                          onClick={() => dispatch(markOneRead(n.id))}
                        >
                          Mark read
                        </button>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Profile */}
        <Link
          to={"/settings/profile"}
          className="btn btn-accent flex items-center"
        >
          <UserCircle className="size-6 mr-2" />
        </Link>
      </div>
    </motion.header>
  );
}


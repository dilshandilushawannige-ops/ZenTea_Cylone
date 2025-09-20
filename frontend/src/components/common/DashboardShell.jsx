import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function DashboardShell({ children, menu }) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const socketRef = React.useRef(null);
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    socketRef.current = io(API);
    socketRef.current.on('payment:completed', (p) => {
      setNotifications((prev) => [{ type: 'payment', ...p, at: new Date().toISOString() }, ...prev]);
      Swal.fire({ icon: 'success', title: `Supplier ${p.supplierId} paid (TXN ${p.transactionId})`, toast: true, position: 'top', timer: 2000, showConfirmButton: false });
    });
    socketRef.current.on('collection:new', (p) => {
      setNotifications((prev) => [{ type: 'collection', ...p, at: new Date().toISOString() }, ...prev]);
    });
    return () => socketRef.current?.disconnect();
  }, []);

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-emerald-900 text-white flex flex-col">
        <div className="p-4 flex items-center gap-3 border-b border-emerald-800">
          <img src="/assets/logo.png" className="h-8" alt="logo" />
          <div className="font-bold">Tea Factory</div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {menu.map((m) => (
            <Link key={m.to} to={m.to} className={`block px-4 py-2 hover:bg-emerald-800 ${loc.pathname===m.to?'bg-emerald-800':''}`}>{m.label}</Link>
          ))}
        </nav>
        <div className="p-4 border-t border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">{user?.name?.[0]}</div>
            <div className="text-sm">
              <div className="font-semibold">{user?.name}</div>
              <div className="text-emerald-200">{user?.uniqueId} • {user?.role}</div>
              <button onClick={() => { logout(); nav('/'); }} className="mt-2 text-xs underline">Logout</button>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 flex items-center justify-between bg-white shadow">
          <div className="font-semibold text-lg">Dashboard</div>
          <div className="relative">
            <button className="px-3 py-1 bg-emerald-600 text-white rounded">Notifications ({notifications.length})</button>
            <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-auto bg-white shadow-lg rounded">
              {notifications.length === 0 ? <div className="p-3 text-sm text-gray-500">No notifications</div> : notifications.map((n,i) => (
                <div key={i} className="p-3 border-b text-sm">
                  <div className="font-medium">{n.type}</div>
                  <div className="text-gray-600">TXN {n.transactionId} • {new Date(n.at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

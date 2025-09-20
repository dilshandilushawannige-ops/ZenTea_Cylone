import React, { useEffect, useState } from 'react';
import DashboardShell from '../../components/common/DashboardShell';
import { adminListUsers, adminUpdateUser } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const menu = [
    { to: '/admin', label: 'Users' },
    { to: '/admin/salary', label: 'Salary Management' }, // ✅ new menu row
  ];

  const { token } = useAuth();
  const [users, setUsers] = useState([]);

  const load = async () => {
    try {
      const { data } = await adminListUsers(token);
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  useEffect(() => {
    load();

    const socket = io(API, { transports: ['websocket'] });
    socket.on('connect', () => console.log('✅ Connected to socket server as Admin'));

    socket.on('user:new', (newUser) => {
      setUsers((prev) => [newUser, ...prev]);
      Swal.fire({
        icon: 'info',
        title: `New ${newUser.role} signed up`,
        text: `${newUser.name} (${newUser.email})`,
        toast: true,
        position: 'top',
      });
    });

    socket.on('user:update', (updated) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === updated.id ? { ...u, ...updated } : u))
      );
      Swal.fire({
        icon: 'success',
        title: `User updated: ${updated.name}`,
        toast: true,
        position: 'top',
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const update = async (u, changes) => {
    try {
      await adminUpdateUser(token, u._id, changes);
      Swal.fire({
        icon: 'success',
        title: 'Updated',
        toast: true,
        position: 'top',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        toast: true,
        position: 'top',
      });
    }
  };

  return (
    <DashboardShell menu={menu}>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">User Management</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>UniqueID</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.uniqueId}</td>
                <td>{u.isActive ? 'Yes' : 'No'}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => update(u, { isActive: !u.isActive })}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    {u.isActive ? 'Revoke' : 'Approve'}
                  </button>
                  <select
                    defaultValue={u.role}
                    onChange={(e) => update(u, { role: e.target.value })}
                    className="border rounded p-1"
                  >
                    {['Admin', 'Collector', 'Supplier', 'Employee', 'Customer'].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}

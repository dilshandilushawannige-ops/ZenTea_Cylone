import React, { useState } from 'react';
import DashboardShell from '../../components/common/DashboardShell';
import { saveSalary, generatePayslip, listPayslipsByEmployee } from '../../api/salaryApi';
import Swal from 'sweetalert2';

export default function SalaryManagement() {
  const menu = [
    { to: '/admin', label: 'Users' },
    { to: '/admin/salary', label: 'Salary Management' },
  ];

  const [form, setForm] = useState({
    employeeId: '',
    basic: 0,
    allowances: 0,
    weekdayOtHours: 0,
    holidayOtHours: 0,
    bonus: 0,
    deductions: 0,
    loan: 0,
    month: new Date().toISOString().substring(0, 7), // default current YYYY-MM
  });

  const [slips, setSlips] = useState([]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    try {
      const { data } = await saveSalary(form);
      Swal.fire({ icon: 'success', title: data.message, toast: true, position: 'top' });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: err.response?.data?.message || 'Failed',
        toast: true,
        position: 'top',
      });
    }
  };

  const gen = async () => {
    try {
      const { data } = await generatePayslip({ employeeId: form.employeeId, month: form.month });
      Swal.fire({ icon: 'success', title: 'Payslip ready', toast: true, position: 'top' });
      window.open(data.pdfPath, '_blank');

      const slipsRes = await listPayslipsByEmployee(form.employeeId);
      setSlips(slipsRes.data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: err.response?.data?.message || 'Failed',
        toast: true,
        position: 'top',
      });
    }
  };

  return (
    <DashboardShell menu={menu}>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Salary Form (Admin)</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              'employeeId',
              'basic',
              'allowances',
              'weekdayOtHours',
              'holidayOtHours',
              'bonus',
              'deductions',
              'loan',
            ].map((k) => (
              <div key={k}>
                <label className="text-xs">{k}</label>
                <input
                  name={k}
                  className="w-full border rounded p-2"
                  onChange={change}
                />
              </div>
            ))}

            {/* ✅ Month Picker */}
            <div>
              <label className="text-xs">Month</label>
              <input
                type="month"
                name="month"
                value={form.month}
                onChange={change}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="mt-3 space-x-2">
            <button
              onClick={save}
              className="px-3 py-2 bg-emerald-600 text-white rounded"
            >
              Save Salary
            </button>
            <button
              onClick={gen}
              className="px-3 py-2 bg-emerald-700 text-white rounded"
            >
              Generate Payslip
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Payslips</h2>
          <ul className="text-sm space-y-2">
            {slips.map((s) => (
              <li key={s._id || s.slipNo} className="flex justify-between border-b pb-1">
                <div>{s.month}</div>
                <a
                  href={`/files/${s.slipNo}.pdf`}
                  target="_blank"
                  className="text-emerald-700 underline"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardShell>
  );
}

import React, { useEffect, useState } from 'react';
import DashboardShell from '../../components/common/DashboardShell';
import { getMySalary, listMyPayslips, downloadPayslip } from '../../api/salaryApi';
import Swal from 'sweetalert2';

export default function EmployeeDashboard() {
  const menu = [{ to: '/employee', label: 'My Salary' }];
  const [salary, setSalary] = useState(null);
  const [slips, setSlips] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMySalary();
        setSalary(data);
        const slipsRes = await listMyPayslips();
        setSlips(slipsRes.data);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: err.response?.data?.message || 'Failed to load salary',
          toast: true,
          position: 'top',
        });
      }
    };
    load();
  }, []);

  // ✅ Calculate totals
  const totalOT =
    (Number(salary?.weekdayOtHours) || 0) +
    (Number(salary?.holidayOtHours) || 0);
  const loanBalance = salary?.loan || 0;
  const netSalary = salary?.breakdown?.net || 0;
  const grossSalary = salary?.breakdown?.gross || 0;

  // ✅ YTD totals from payslips
  const totalEarningsYTD = slips.reduce((sum, s) => sum + (s.breakdown?.net || 0), 0);
  const totalOTYTD = slips.reduce(
    (sum, s) => sum + ((s.breakdown?.weekdayOtHours || 0) + (s.breakdown?.holidayOtHours || 0)),
    0
  );

  return (
    <DashboardShell menu={menu}>
      <div className="grid grid-cols-3 gap-6">
        
        {/* ✅ Stats Cards */}
        <div className="col-span-3 grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow text-center">
            <h3 className="text-sm font-medium text-gray-600">Total OT Hours</h3>
            <p className="text-2xl font-bold text-emerald-700">{totalOT}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <h3 className="text-sm font-medium text-gray-600">Loan Balance</h3>
            <p className="text-2xl font-bold text-red-600">LKR {loanBalance}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <h3 className="text-sm font-medium text-gray-600">Net Salary (This Month)</h3>
            <p className="text-2xl font-bold text-emerald-700">LKR {netSalary}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <h3 className="text-sm font-medium text-gray-600">Total Earnings (YTD)</h3>
            <p className="text-2xl font-bold text-indigo-600">LKR {totalEarningsYTD}</p>
          </div>
        </div>

        {/* ✅ Salary Summary */}
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">My Salary Details</h2>
          {salary ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Basic:</strong> {salary.basic}</div>
              <div><strong>Allowances:</strong> {salary.allowances}</div>
              <div><strong>Weekday OT:</strong> {salary.weekdayOtHours} hrs</div>
              <div><strong>Holiday OT:</strong> {salary.holidayOtHours} hrs</div>
              <div><strong>Bonus:</strong> {salary.bonus}</div>
              <div><strong>Loan Balance:</strong> {salary.loan}</div>
              <div><strong>Deductions:</strong> {salary.deductions}</div>
              <div><strong>EPF:</strong> {salary.breakdown?.epf}</div>
              <div><strong>ETF:</strong> {salary.breakdown?.etf}</div>
              <div><strong>Gross Salary:</strong> {grossSalary}</div>
              <div className="col-span-2 text-lg mt-2">
                <span className="font-bold">Net Salary:</span>{' '}
                <span className="text-emerald-700 font-bold">{netSalary}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No salary record found</div>
          )}
        </div>

        {/* ✅ Payslip History */}
        <div className="bg-white p-4 rounded shadow max-h-[400px] overflow-y-auto">
          <h2 className="font-semibold mb-3">Payslips</h2>
          {slips.length ? (
            <ul className="text-sm space-y-2">
              {slips.map((s) => (
                <li key={s._id || s.slipNo} className="flex justify-between border-b pb-1">
                  <div>
                    <div className="font-medium">{s.month}</div>
                    <div className="text-xs text-gray-500">Slip No: {s.slipNo}</div>
                  </div>
                  <button
                    onClick={() => downloadPayslip(s.slipNo)}
                    className="text-emerald-700 underline"
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No payslips available</div>
          )}
        </div>

        {/* ✅ Year-to-date summary */}
        <div className="bg-white p-4 rounded shadow col-span-3">
          <h2 className="font-semibold mb-3">Year-to-Date Summary</h2>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div><strong>Total Earnings:</strong> LKR {totalEarningsYTD}</div>
            <div><strong>Total OT Hours:</strong> {totalOTYTD} hrs</div>
            <div><strong>Payslips Generated:</strong> {slips.length}</div>
            <div><strong>Last Slip Month:</strong> {slips[0]?.month || 'N/A'}</div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

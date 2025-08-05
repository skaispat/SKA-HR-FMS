import React, { useState } from 'react';
import { DollarSign, Download, Eye, Calendar, TrendingUp } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useDataStore from '../store/dataStore';

const MySalary = () => {
  const { user } = useAuthStore();
  const { getFilteredData } = useDataStore();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const salaryData = getFilteredData('salaryData', user);

  // Filter salary by selected year
  const filteredSalary = salaryData.filter(record => {
    return record.month.includes(selectedYear.toString());
  });

  // Calculate yearly statistics
  const totalEarnings = filteredSalary.reduce((sum, record) => sum + record.netSalary, 0);
  const averageSalary = filteredSalary.length > 0 ? totalEarnings / filteredSalary.length : 0;
  const totalDeductions = filteredSalary.reduce((sum, record) => sum + record.deductions, 0);
  const totalOvertime = filteredSalary.reduce((sum, record) => sum + record.overtime, 0);

  const years = [2023, 2024, 2025];

  const handleDownloadPayslip = (salaryRecord) => {
    // In a real app, this would generate and download a PDF payslip
    alert(`Downloading payslip for ${salaryRecord.month}`);
  };

  const handleViewPayslip = (salaryRecord) => {
    // In a real app, this would open a detailed payslip view
    alert(`Viewing payslip for ${salaryRecord.month}`);
  };

  return (
    <div className="space-y-6 page-content p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Salary</h1>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Earnings</p>
              <h3 className="text-2xl font-bold text-gray-800">₹{totalEarnings.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Average Salary</p>
              <h3 className="text-2xl font-bold text-gray-800">₹{Math.round(averageSalary).toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <DollarSign size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Deductions</p>
              <h3 className="text-2xl font-bold text-gray-800">₹{totalDeductions.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 mr-4">
              <DollarSign size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Overtime</p>
              <h3 className="text-2xl font-bold text-gray-800">₹{totalOvertime.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Records Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Salary Records - {selectedYear}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSalary.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{record.basicSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{record.allowances.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{record.overtime.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{record.deductions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{record.netSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        record.status === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.payDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPayslip(record)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Payslip"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDownloadPayslip(record)}
                          className="text-green-600 hover:text-green-900"
                          title="Download Payslip"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSalary.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No salary records found for the selected year.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Salary Breakdown Chart (Latest Month) */}
      {filteredSalary.length > 0 && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Latest Salary Breakdown - {filteredSalary[0].month}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Basic Salary</p>
              <p className="text-xl font-bold text-green-600">₹{filteredSalary[0].basicSalary.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Allowances</p>
              <p className="text-xl font-bold text-blue-600">₹{filteredSalary[0].allowances.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-gray-600">Overtime</p>
              <p className="text-xl font-bold text-amber-600">₹{filteredSalary[0].overtime.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Deductions</p>
              <p className="text-xl font-bold text-red-600">₹{filteredSalary[0].deductions.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySalary;
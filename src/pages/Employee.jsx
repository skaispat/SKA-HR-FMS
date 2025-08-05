import React, { useState } from 'react';
import { Filter, Search, Clock, CheckCircle } from 'lucide-react';
import useDataStore from '../store/dataStore';

const Employee = () => {
  const { employeeData, leavingData } = useDataStore();
  const [activeTab, setActiveTab] = useState('joining');
  const [searchTerm, setSearchTerm] = useState('');

  // Active employees (not in leaving data)
  const joiningEmployees = employeeData.filter(employee => 
    !leavingData.some(leaving => leaving.employeeId === employee.employeeId)
  );

  // Employees who have left
  const leavingEmployees = leavingData;

  const filteredJoiningData = joiningEmployees.filter(item => {
    const matchesSearch = item.nameAsPerAadhar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.designation?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredLeavingData = leavingEmployees.filter(item => {
    const matchesSearch = item.nameAsPerAadhar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.designation?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold ">Employee</h1>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by name, employee ID, or designation..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300   rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white  text-gray-500 "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 " />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-300 ">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'joining'
                     ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
              onClick={() => setActiveTab('joining')}
            >
              <CheckCircle size={16} className="inline mr-2" />
              Joining ({filteredJoiningData.length})
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'leaving'
                   ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
              onClick={() => setActiveTab('leaving')}
            >
              <Clock size={16} className="inline mr-2" />
              Leaving ({filteredLeavingData.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'joining' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white ">
                <thead className="bg-white ">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Of Joining</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Father Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white ">
                  {filteredJoiningData.map((item) => (
                    <tr key={item.id} className="hover:bg-white hover:bg-opacity-5">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.employeeId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nameAsPerAadhar}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.dateOfJoining ? new Date(item.dateOfJoining).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.mobileNo || item.candidatePhone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.fatherName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.joiningPlace || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.designation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredJoiningData.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500 ">No joining employees found.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'leaving' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white ">
                <thead className="bg-white ">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Of Joining</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Of Leaving</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Father Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason Of Leaving</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white ">
                  {filteredLeavingData.map((item) => (
                    <tr key={item.id} className="hover:bg-white ">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.employeeId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nameAsPerAadhar}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.dateOfJoining ? new Date(item.dateOfJoining).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.dateOfLeaving ? new Date(item.dateOfLeaving).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.mobileNumber || item.mobileNo || item.candidatePhone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.fatherName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.joiningPlace || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.designation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.salary}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reasonOfLeaving}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLeavingData.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500 ">No leaving employees found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employee;
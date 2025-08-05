import React, { useState, useEffect } from 'react';
import { Filter, Search, Clock, CheckCircle, X } from 'lucide-react';
import useDataStore from '../store/dataStore';
import toast from 'react-hot-toast';

const Leaving = () => {
  const { afterJoiningData, leavingData, addLeaving } = useDataStore();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    dateOfLeaving: '',
    mobileNumber: '',
    reasonOfLeaving: ''
  });

  // Get completed after joining data for potential leaving
  const completedAfterJoining = afterJoiningData.filter(item => item.completed);
  
  // Filter out items that are already in leaving process
  const pendingData = completedAfterJoining.filter(afterJoiningItem => 
    !leavingData.some(leaving => leaving.employeeId === afterJoiningItem.employeeId)
  );

  const historyData = leavingData;

  const handleLeavingClick = (item) => {
    setSelectedItem(item);
    setFormData({
      dateOfLeaving: '',
      mobileNumber: item.mobileNo || '',
      reasonOfLeaving: ''
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.dateOfLeaving || !formData.reasonOfLeaving) {
      toast.error('Please fill all required fields');
      return;
    }

    addLeaving({
      ...selectedItem,
      ...formData
    });
    
    toast.success('Leaving request added successfully!');
    setShowModal(false);
    setSelectedItem(null);
  };

  const filteredPendingData = pendingData.filter(item => {
    const matchesSearch = item.nameAsPerAadhar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredHistoryData = historyData.filter(item => {
    const matchesSearch = item.nameAsPerAadhar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold ">Leaving</h1>
      </div>

      {/* Filter and Search */}
      <div className="bg-white  p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by name or employee ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300   rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-500 bg-white   text-gray-500    "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500  " />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className=" bg-white  rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-300  ">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'pending'
              ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
               }`}
              onClick={() => setActiveTab('pending')}
            >
              <Clock size={16} className="inline mr-2" />
              Pending ({filteredPendingData.length})
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'history'
           ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              onClick={() => setActiveTab('history')}
            >
              <CheckCircle size={16} className="inline mr-2" />
              History ({filteredHistoryData.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'pending' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white  ">
                <thead className="bg-white  ">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Father Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Of Joining</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white  ">
                  {filteredPendingData.map((item) => (
                    <tr key={item.id} className="hover:bg-white hover: ">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleLeavingClick(item)}
                          className="px-3 py-1 bg-white text-purple-700 rounded-md  text-sm"
                        >
                          Leaving
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.employeeId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nameAsPerAadhar}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.fatherName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.dateOfJoining ? new Date(item.dateOfJoining).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.designation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPendingData.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500  ">No pending leaving requests found.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white  ">
                <thead className="bg-white  ">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Of Joining</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Of Leaving</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason Of Leaving</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white  ">
                  {filteredHistoryData.map((item) => (
                    <tr key={item.id} className="hover:bg-white hover: ">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.employeeId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nameAsPerAadhar}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.dateOfJoining ? new Date(item.dateOfJoining).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.dateOfLeaving ? new Date(item.dateOfLeaving).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.designation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reasonOfLeaving}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredHistoryData.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500  ">No leaving history found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
          <div className="  rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-300  ">
              <h3 className="text-lg font-medium text-gray-500">Leaving Form</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500  ">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Employee ID</label>
                <input
                  type="text"
                  value={selectedItem.employeeId}
                  disabled
                  className="w-full border border-gray-300   rounded-md px-3 py-2 bg-white   text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                <input
                  type="text"
                  value={selectedItem.nameAsPerAadhar}
                  disabled
                  className="w-full border border-gray-300   rounded-md px-3 py-2 bg-white   text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Date Of Leaving *</label>
                <input
                  type="date"
                  name="dateOfLeaving"
                  value={formData.dateOfLeaving}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2  focus:ring-blue-500 bg-white   text-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2  focus:ring-blue-500 bg-white   text-gray-500    "
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Reason Of Leaving *</label>
                <textarea
                  name="reasonOfLeaving"
                  value={formData.reasonOfLeaving}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2  focus:ring-blue-500 bg-white   text-gray-500    "
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300   rounded-md text-gray-500 hover:bg-white  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-purple-700 rounded-md "
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaving;
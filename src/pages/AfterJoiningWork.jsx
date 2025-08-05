import React, { useState, useEffect } from 'react';
import { Filter, Search, Clock, CheckCircle, X } from 'lucide-react';
import useDataStore from '../store/dataStore';
import toast from 'react-hot-toast';

const AfterJoiningWork = () => {
  const { employeeData, afterJoiningData, updateAfterJoining } = useDataStore();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    checkSalarySlipResume: false,
    offerLetterReceived: false,
    welcomeMeeting: false,
    biometricAccess: false,
    officialEmailId: false,
    assignAssets: false,
    pfEsic: false,
    companyDirectory: false,
    assets: []
  });

  // Initialize after joining data from employee data
  useEffect(() => {
    employeeData.forEach(employee => {
      const existsInAfterJoining = afterJoiningData.find(item => item.employeeId === employee.employeeId);
      if (!existsInAfterJoining) {
        useDataStore.getState().afterJoiningData.push({
          ...employee,
          completed: false
        });
      }
    });
  }, [employeeData]);

  const pendingData = afterJoiningData.filter(item => !item.completed);
  const historyData = afterJoiningData.filter(item => item.completed);

  const handleAfterJoiningClick = (item) => {
    setSelectedItem(item);
    setFormData({
      checkSalarySlipResume: false,
      offerLetterReceived: false,
      welcomeMeeting: false,
      biometricAccess: false,
      officialEmailId: false,
      assignAssets: false,
      pfEsic: false,
      companyDirectory: false,
      assets: []
    });
    setShowModal(true);
  };

  const handleCheckboxChange = (name) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    updateAfterJoining(selectedItem.id, formData);
    toast.success('After joining work updated successfully!');
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
        <h1 className="text-2xl font-bold  ">After Joining Work</h1>
      </div>

      {/* Filter and Search */}
      <div className="bg-white  p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by name or employee ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300   rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white   text-gray-500    "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2  text-gray-500  " />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white  rounded-lg shadow overflow-hidden">
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
              <table className="min-w-full divide-y   divide-white  ">
                <thead className="bg-white  ">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Father Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Date Of Joining</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y   divide-white  ">
                  {filteredPendingData.map((item) => (
                    <tr key={item.id} className="hover:bg-white hover: ">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleAfterJoiningClick(item)}
                          className="px-3 py-1 bg-white text-purple-700 rounded-md   text-sm"
                        >
                          Process
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">{item.employeeId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">{item.nameAsPerAadhar}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">{item.fatherName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">
                        {item.dateOfJoining ? new Date(item.dateOfJoining).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">{item.designation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">{item.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPendingData.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className=" text-gray-500  ">No pending after joining work found.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y   divide-white  ">
                <thead className="bg-white  ">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Date Of Joining</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y   divide-white  ">
                  {filteredHistoryData.map((item) => (
                    <tr key={item.id} className="hover:bg-white hover: ">
                      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">{item.employeeId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">{item.nameAsPerAadhar}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">{item.designation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">
                        {item.dateOfJoining ? new Date(item.dateOfJoining).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-500   text-green-400">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredHistoryData.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className=" text-gray-500  ">No after joining work history found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
          <div className="  rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-300  ">
              <h3 className="text-lg font-medium  text-gray-500">After Joining Work Checklist</h3>
              <button onClick={() => setShowModal(false)} className=" text-gray-500  ">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium  text-gray-500 mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={selectedItem.employeeId}
                    disabled
                    className="w-full border border-gray-300   rounded-md px-3 py-2 bg-white    text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  text-gray-500 mb-1">Name</label>
                  <input
                    type="text"
                    value={selectedItem.nameAsPerAadhar}
                    disabled
                    className="w-full border border-gray-300   rounded-md px-3 py-2 bg-white    text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-md font-medium  text-gray-500">Checklist Items</h4>
                
                {[
                  { key: 'checkSalarySlipResume', label: 'Check Salary Slip & Resume Copy' },
                  { key: 'offerLetterReceived', label: 'Offer Letter Received' },
                  { key: 'welcomeMeeting', label: 'Welcome Meeting' },
                  { key: 'biometricAccess', label: 'Biometric Access' },
                  { key: 'officialEmailId', label: 'Official Email ID' },
                  { key: 'assignAssets', label: 'Assign Assets' },
                  { key: 'pfEsic', label: 'PF / ESIC' },
                  { key: 'companyDirectory', label: 'Company Directory' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={item.key}
                      checked={formData[item.key]}
                      onChange={() => handleCheckboxChange(item.key)}
                      className="h-4 w-4  text-gray-500  focus:ring-blue-500 border-gray-300   rounded bg-white  "
                    />
                    <label htmlFor={item.key} className="ml-2 text-sm  text-gray-500">
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300   rounded-md  text-gray-500 hover:bg-white  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-purple-700 rounded-md  "
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

export default AfterJoiningWork;
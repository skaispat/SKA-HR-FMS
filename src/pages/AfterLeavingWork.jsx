import React, { useState, useEffect } from 'react';
import { Filter, Search, Clock, CheckCircle, X } from 'lucide-react';
import useDataStore from '../store/dataStore';
import toast from 'react-hot-toast';

const AfterLeavingWork = () => {
  const { leavingData, afterLeavingData, updateAfterLeaving } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    resignationLetterReceived: false,
    resignationAcceptance: false,
    handoverOfAssets: false,
    idCard: false,
    visitingCard: false,
    cancellationOfEmailId: false,
    biometricAccess: false,
    finalReleaseDate: '',
    removeBenefitEnrollment: false
  });

  // Initialize after leaving data from leaving data
  useEffect(() => {
    leavingData.forEach(leaving => {
      const existsInAfterLeaving = afterLeavingData.find(item => item.employeeId === leaving.employeeId);
      if (!existsInAfterLeaving) {
        useDataStore.getState().afterLeavingData.push({
          ...leaving,
          completed: false
        });
      }
    });
  }, [leavingData]);

  const pendingData = afterLeavingData.filter(item => !item.completed);

  const handleAfterLeavingClick = (item) => {
    setSelectedItem(item);
    setFormData({
      resignationLetterReceived: false,
      resignationAcceptance: false,
      handoverOfAssets: false,
      idCard: false,
      visitingCard: false,
      cancellationOfEmailId: false,
      biometricAccess: false,
      finalReleaseDate: '',
      removeBenefitEnrollment: false
    });
    setShowModal(true);
  };

  const handleCheckboxChange = (name) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
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
    
    updateAfterLeaving(selectedItem.id, formData);
    toast.success('After leaving work updated successfully!');
    setShowModal(false);
    setSelectedItem(null);
  };

  const filteredPendingData = pendingData.filter(item => {
    const matchesSearch = item.nameAsPerAadhar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold  ">After Leaving Work</h1>
      </div>

      {/* Filter and Search */}
      <div className="bg-white  p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by name or employee ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300   rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-500 bg-white    text-gray-500  "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2  text-gray-500  " />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className=" bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white  ">
              <thead className="bg-white  ">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Date Of Joining</th>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Date Of Leaving</th>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Reason Of Leaving</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white  ">
                {filteredPendingData.map((item) => (
                  <tr key={item.id} className="hover:bg-white hover: ">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleAfterLeavingClick(item)}
                        className="px-3 py-1 bg-white text-purple-700 rounded-md   text-sm"
                      >
                        Process
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">{item.employeeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">{item.nameAsPerAadhar}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">
                      {item.dateOfJoining ? new Date(item.dateOfJoining).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">
                      {item.dateOfLeaving ? new Date(item.dateOfLeaving).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">{item.designation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">{item.reasonOfLeaving}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPendingData.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className=" text-gray-500  ">No pending after leaving work found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
          <div className="  rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-300  ">
              <h3 className="text-lg font-medium  text-gray-500">After Leaving Work Checklist</h3>
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
                  { key: 'resignationLetterReceived', label: 'Resignation Letter Received' },
                  { key: 'resignationAcceptance', label: 'Resignation Acceptance' },
                  { key: 'handoverOfAssets', label: 'Handover Of Assets' },
                  { key: 'idCard', label: 'ID Card' },
                  { key: 'visitingCard', label: 'Visiting Card' },
                  { key: 'cancellationOfEmailId', label: 'Cancellation Of Email ID' },
                  { key: 'biometricAccess', label: 'Biometric Access' },
                  { key: 'removeBenefitEnrollment', label: 'Remove Benefit Enrollment' }
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

              <div>
                <label className="block text-sm font-medium  text-gray-500 mb-1">Final Release Date</label>
                <input
                  type="date"
                  name="finalReleaseDate"
                  value={formData.finalReleaseDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2  focus:ring-blue-500 bg-white    text-gray-500"
                />
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

export default AfterLeavingWork;
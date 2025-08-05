import React, { useState, useEffect } from 'react';
import { Filter, Search, Clock, CheckCircle, X, Upload } from 'lucide-react';
import useDataStore from '../store/dataStore';
import toast from 'react-hot-toast';

const CallTracker = () => {
  const { findEnquiryData, callTrackerData, updateCallTracker, addEmployee } = useDataStore();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showJoiningModal, setShowJoiningModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    candidateSays: '',
    status: '',
    nextDate: ''
  });
  const [joiningFormData, setJoiningFormData] = useState({
    nameAsPerAadhar: '',
    fatherName: '',
    dateOfJoining: '',
    joiningPlace: '',
    designation: '',
    salary: '',
    aadharFrontPhoto: null,
    aadharBackPhoto: null,
    panCard: null,
    candidatePhoto: null,
    currentAddress: '',
    addressAsPerAadhar: '',
    dobAsPerAadhar: '',
    gender: '',
    mobileNo: '',
    familyMobileNo: '',
    relationshipWithFamily: '',
    pastPfId: '',
    currentBankAc: '',
    ifscCode: '',
    branchName: '',
    bankPassbookPhoto: null,
    personalEmail: '',
    esicNo: '',
    highestQualification: '',
    pfEligible: '',
    esicEligible: '',
    joiningCompanyName: '',
    emailToBeIssue: '',
    issueMobile: '',
    issueLaptop: '',
    aadharCardNo: '',
    modeOfAttendance: '',
    qualificationPhoto: null,
    paymentMode: '',
    salarySlip: null,
    resumeCopy: null
  });

  // Initialize call tracker data from find enquiry data
  useEffect(() => {
    findEnquiryData.forEach(enquiry => {
      const existsInCallTracker = callTrackerData.find(call => call.enquiryId === enquiry.id);
      if (!existsInCallTracker) {
        useDataStore.getState().callTrackerData.push({
          ...enquiry,
          enquiryId: enquiry.id,
          status: 'pending',
          callHistory: []
        });
      }
    });
  }, [findEnquiryData]);

  const pendingData = callTrackerData.filter(item => 
    !['Joining', 'Reject'].includes(item.finalStatus)
  );
  const historyData = callTrackerData.filter(item => 
    ['Joining', 'Reject'].includes(item.finalStatus)
  );

  const handleCallClick = (item) => {
    setSelectedItem(item);
    setFormData({
      candidateSays: '',
      status: '',
      nextDate: ''
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

  const handleJoiningInputChange = (e) => {
    const { name, value } = e.target;
    setJoiningFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setJoiningFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.candidateSays || !formData.status) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.status === 'Joining') {
      // Show joining form
      setShowModal(false);
      setShowJoiningModal(true);
      return;
    }

    if (formData.status === 'Reject') {
      // Direct submit for reject
      updateCallTracker(selectedItem.id, {
        candidateSays: formData.candidateSays,
        finalStatus: 'Reject',
        lastCallDate: new Date().toISOString()
      });
      toast.success('Call tracker updated successfully!');
      setShowModal(false);
      return;
    }

    // For other statuses, require next date
    if (!formData.nextDate) {
      toast.error('Please select next date');
      return;
    }

    updateCallTracker(selectedItem.id, {
      candidateSays: formData.candidateSays,
      status: formData.status,
      nextDate: formData.nextDate,
      lastCallDate: new Date().toISOString()
    });
    
    toast.success('Call tracker updated successfully!');
    setShowModal(false);
  };

  const handleJoiningSubmit = (e) => {
    e.preventDefault();
    if (!joiningFormData.nameAsPerAadhar || !joiningFormData.dateOfJoining || !joiningFormData.designation) {
      toast.error('Please fill all required fields');
      return;
    }

    // Create URLs for uploaded files
    const fileUrls = {};
    Object.keys(joiningFormData).forEach(key => {
      if (joiningFormData[key] instanceof File) {
        fileUrls[key] = URL.createObjectURL(joiningFormData[key]);
      }
    });

    // Add employee
    addEmployee({
      ...selectedItem,
      ...joiningFormData,
      ...fileUrls,
      candidateSays: formData.candidateSays
    });

    // Update call tracker
    updateCallTracker(selectedItem.id, {
      candidateSays: formData.candidateSays,
      finalStatus: 'Joining',
      lastCallDate: new Date().toISOString()
    });

    toast.success('Employee added successfully!');
    setShowJoiningModal(false);
    setSelectedItem(null);
  };

  const filteredPendingData = pendingData.filter(item => {
    const matchesSearch = item.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.candidateEnquiryNo?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredHistoryData = historyData.filter(item => {
    const matchesSearch = item.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.candidateEnquiryNo?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold  ">Call Tracker</h1>
      </div>

      {/* Filter and Search */}
      <div className=" p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 bg-white">
        <div className="flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by candidate name or enquiry number..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white  text-gray-500   "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 " />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className=" rounded-lg shadow overflow-hidden bg-white">
        <div className="border-b border-gray-300 ">
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
              <table className="min-w-full divide-y divide-white ">
                <thead className="bg-white ">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indent No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Enquiry No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applying For Post</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white ">
                  {filteredPendingData.map((item) => (
                    <tr key={item.id} className="hover:bg-white ">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleCallClick(item)}
                          className="px-3 py-1 bg-white text-purple-700 rounded-md  text-sm"
                        >
                          Call
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.indentNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.candidateEnquiryNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.applyingForPost}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.candidateName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.candidatePhone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.candidateEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.candidatePhoto && (
                          <button
                            onClick={() => window.open(item.candidatePhoto, '_blank')}
                            className="text-gray-500  text-sm underline"
                          >
                            View
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.candidateResume && (
                          <button
                            onClick={() => window.open(item.candidateResume, '_blank')}
                            className="text-gray-500  text-sm underline"
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPendingData.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500 ">No pending calls found.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white ">
                <thead className="bg-white ">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">What Candidate Says</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Call Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white ">
                  {filteredHistoryData.map((item) => (
                    <tr key={item.id} className="hover:bg-white ">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.candidateName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.candidatePhone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.candidateEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.candidateSays || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.finalStatus === 'Joining' 
                            ? 'bg-green-500  text-green-400' 
                            : 'bg-red-500  text-red-400'
                        }`}>
                          {item.finalStatus === 'Joining' ? 'Joined' : 'Rejected'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.lastCallDate ? new Date(item.lastCallDate).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredHistoryData.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500 ">No call history found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Call Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-300 ">
              <h3 className="text-lg font-medium text-gray-500">Call Tracker</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 ">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Candidate Enquiry No.</label>
                <input
                  type="text"
                  value={selectedItem.candidateEnquiryNo}
                  disabled
                  className="w-full border border-gray-300  rounded-md px-3 py-2 bg-white text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">What Did The Candidate Says *</label>
                <textarea
                  name="candidateSays"
                  value={formData.candidateSays}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white  text-gray-500   "
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white   text-gray-500"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Interview">Interview</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Joining">Joining</option>
                  <option value="Reject">Reject</option>
                </select>
              </div>
              {formData.status && !['Joining', 'Reject'].includes(formData.status) && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Next Date *</label>
                  <input
                    type="date"
                    name="nextDate"
                    value={formData.nextDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white   text-gray-500"
                    required
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300   rounded-md text-gray-500 hover:bg-white hover: "
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

      {/* Joining Modal */}
      {showJoiningModal && selectedItem && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-300  ">
              <h3 className="text-lg font-medium text-gray-500">Employee Joining Form</h3>
              <button onClick={() => setShowJoiningModal(false)} className="text-gray-500  ">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleJoiningSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={`EMP-${String(useDataStore.getState().employeeData.length + 1).padStart(4, '0')}`}
                    disabled
                    className="w-full border border-gray-300   rounded-md px-3 py-2 bg-white   text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Name As Per Aadhar *</label>
                  <input
                    type="text"
                    name="nameAsPerAadhar"
                    value={joiningFormData.nameAsPerAadhar}
                    onChange={handleJoiningInputChange}
                    className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white   text-gray-500    "
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Father Name</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={joiningFormData.fatherName}
                    onChange={handleJoiningInputChange}
                    className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white   text-gray-500    "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Date Of Joining *</label>
                  <input
                    type="date"
                    name="dateOfJoining"
                    value={joiningFormData.dateOfJoining}
                    onChange={handleJoiningInputChange}
                    className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white   text-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Joining Place</label>
                  <input
                    type="text"
                    name="joiningPlace"
                    value={joiningFormData.joiningPlace}
                    onChange={handleJoiningInputChange}
                    className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white   text-gray-500    "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Designation *</label>
                  <input
                    type="text"
                    name="designation"
                    value={joiningFormData.designation}
                    onChange={handleJoiningInputChange}
                    className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white   text-gray-500    "
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Salary</label>
                  <input
                    type="number"
                    name="salary"
                    value={joiningFormData.salary}
                    onChange={handleJoiningInputChange}
                    className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white   text-gray-500    "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={joiningFormData.gender}
                    onChange={handleJoiningInputChange}
                    className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white   text-gray-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Mobile No.</label>
                  <input
                    type="tel"
                    name="mobileNo"
                    value={joiningFormData.mobileNo}
                    onChange={handleJoiningInputChange}
                    className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white   text-gray-500    "
                  />
                </div>
              </div>

              {/* File Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Aadhar Frontside Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'aadharFrontPhoto')}
                    className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white   text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-purple-700  "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Aadhar Backside Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'aadharBackPhoto')}
                    className="w-full border border-gray-300   rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white   text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-purple-700  "
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowJoiningModal(false)}
                  className="px-4 py-2 border border-gray-300   rounded-md text-gray-500 hover:bg-white hover: "
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

export default CallTracker;
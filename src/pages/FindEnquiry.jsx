import React, { useState, useEffect } from 'react';
import { Filter, Search, Clock, CheckCircle, X, Upload } from 'lucide-react';
import useDataStore from '../store/dataStore';
import toast from 'react-hot-toast';

const FindEnquiry = () => {
  const { socialSiteData, findEnquiryData, addEnquiry } = useDataStore();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateDOB: '',
    candidatePhone: '',
    candidateEmail: '',
    previousCompany: '',
    jobExperience: '',
    lastSalary: '',
    previousPosition: '',
    reasonForLeaving: '',
    maritalStatus: '',
    lastEmployerMobile: '',
    candidatePhoto: null,
    candidateResume: null,
    referenceBy: '',
    presentAddress: '',
    aadharNo: ''
  });

  // Get completed social site data for pending enquiries
  const completedSocialSite = socialSiteData.filter(item => item.status === 'completed');
  
  // Filter out items that already have enquiries
  const pendingData = completedSocialSite.filter(socialItem => 
    !findEnquiryData.some(enquiry => enquiry.indentId === socialItem.id)
  );

  const historyData = findEnquiryData;

  const handleEnquiryClick = (item) => {
    setSelectedItem(item);
    setFormData({
      candidateName: '',
      candidateDOB: '',
      candidatePhone: '',
      candidateEmail: '',
      previousCompany: '',
      jobExperience: '',
      lastSalary: '',
      previousPosition: '',
      reasonForLeaving: '',
      maritalStatus: '',
      lastEmployerMobile: '',
      candidatePhoto: null,
      candidateResume: null,
      referenceBy: '',
      presentAddress: '',
      aadharNo: ''
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

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.candidateName || !formData.candidatePhone || !formData.candidateEmail) {
      toast.error('Please fill all required fields');
      return;
    }

    // Create URLs for uploaded files (in real app, these would be uploaded to server)
    const photoUrl = formData.candidatePhoto ? URL.createObjectURL(formData.candidatePhoto) : null;
    const resumeUrl = formData.candidateResume ? URL.createObjectURL(formData.candidateResume) : null;
    
    addEnquiry({
      ...formData,
      indentId: selectedItem.id,
      indentNo: selectedItem.indentNo,
      applyingForPost: selectedItem.post,
      candidatePhoto: photoUrl,
      candidateResume: resumeUrl
    });
    
    toast.success('Enquiry added successfully!');
    setShowModal(false);
    setSelectedItem(null);
  };

  const filteredPendingData = pendingData.filter(item => {
    const matchesSearch = item.post?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.indentNo?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredHistoryData = historyData.filter(item => {
    const matchesSearch = item.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.candidateEnquiryNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.indentNo?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Find Enquiry</h1>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-400 border-opacity-30 rounded-lg focus:outline-none focus:ring-2  bg-white bg-opacity-10 focus:ring-indigo-500 text-gray-600  "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 opacity-60" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-300 border-opacity-20">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'pending'
                  ?'border-indigo-500 text-indigo-600'
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
              <table className="min-w-full divide-y divide-gray-200 ">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Indent No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Post</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Prefer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Number Of Post</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Competition Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPendingData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEnquiryClick(item)}
                          className="px-3 py-1 bg-white text-purple-700 rounded-md hover:bg-opacity-90 text-sm"
                        >
                          Enquiry
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.indentNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.post}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.prefer || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.numberOfPost}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.competitionDate ? new Date(item.competitionDate).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPendingData.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500">No pending enquiries found.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y  divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indent No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Enquiry No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applying For Post</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHistoryData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.indentNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.candidateEnquiryNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.applyingForPost}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.candidateName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.candidatePhone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.candidateEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jobExperience}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.candidatePhoto && (
                          <button
                            onClick={() => window.open(item.candidatePhoto, '_blank')}
                            className="text-gray-500 hover:text-opacity-80 text-sm underline"
                          >
                            View
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.candidateResume && (
                          <button
                            onClick={() => window.open(item.candidateResume, '_blank')}
                            className="text-gray-500 hover:text-opacity-80 text-sm underline"
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredHistoryData.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500 ">No enquiry history found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-300 border-opacity-20">
              <h3 className="text-lg font-medium text-gray-400">Candidate Enquiry Form</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-opacity-80">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Indent No.</label>
                  <input
                    type="text"
                    value={selectedItem.indentNo}
                    disabled
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 bg-white bg-opacity-5 text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Candidate Enquiry No.</label>
                  <input
                    type="text"
                    value={`EN-${String(findEnquiryData.length + 1).padStart(3, '0')}`}
                    disabled
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 bg-white bg-opacity-5 text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Applying For Post</label>
                  <input
                    type="text"
                    value={selectedItem.post}
                    disabled
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 bg-white bg-opacity-5 text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Candidate Name *</label>
                  <input
                    type="text"
                    name="candidateName"
                    value={formData.candidateName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-10 text-gray-400 placeholder-white placeholder-opacity-60"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Candidate DOB</label>
                  <input
                    type="date"
                    name="candidateDOB"
                    value={formData.candidateDOB}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-10 text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Candidate Phone *</label>
                  <input
                    type="tel"
                    name="candidatePhone"
                    value={formData.candidatePhone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-10 text-gray-400 placeholder-white placeholder-opacity-60"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Candidate Email *</label>
                  <input
                    type="email"
                    name="candidateEmail"
                    value={formData.candidateEmail}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-10 text-gray-400 placeholder-white placeholder-opacity-60"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Previous Company</label>
                  <input
                    type="text"
                    name="previousCompany"
                    value={formData.previousCompany}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-10 text-gray-400 placeholder-white placeholder-opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Job Experience</label>
                  <input
                    type="text"
                    name="jobExperience"
                    value={formData.jobExperience}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-10 text-gray-400 placeholder-white placeholder-opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Last Salary Drawn</label>
                  <input
                    type="number"
                    name="lastSalary"
                    value={formData.lastSalary}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-10 text-gray-400 placeholder-white placeholder-opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Previous Position</label>
                  <input
                    type="text"
                    name="previousPosition"
                    value={formData.previousPosition}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-10 text-gray-400 placeholder-white placeholder-opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Reason for Leaving</label>
                  <input
                    type="text"
                    name="reasonForLeaving"
                    value={formData.reasonForLeaving}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-10 text-gray-400 placeholder-white placeholder-opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Marital Status</label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-10 text-gray-400"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Last Employer Mobile</label>
                  <input
                    type="tel"
                    name="lastEmployerMobile"
                    value={formData.lastEmployerMobile}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-10 text-gray-400 placeholder-white placeholder-opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Reference By</label>
                  <input
                    type="text"
                    name="referenceBy"
                    value={formData.referenceBy}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-10 text-gray-400 placeholder-white placeholder-opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Aadhar No.</label>
                  <input
                    type="text"
                    name="aadharNo"
                    value={formData.aadharNo}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-10 text-gray-400 placeholder-white placeholder-opacity-60"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Present Address</label>
                <textarea
                  name="presentAddress"
                  value={formData.presentAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 border-opacity-30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-10 text-gray-400 placeholder-white placeholder-opacity-60"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Candidate Photo</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'candidatePhoto')}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex items-center px-4 py-2 border border-gray-300 border-opacity-30 rounded-md cursor-pointer hover:bg-white hover:bg-opacity-10 text-gray-400"
                    >
                      <Upload size={16} className="mr-2" />
                      Upload Photo
                    </label>
                    {formData.candidatePhoto && (
                      <span className="text-sm text-gray-400 opacity-80">{formData.candidatePhoto.name}</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Candidate Resume</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'candidateResume')}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex items-center px-4 py-2 border border-gray-300 border-opacity-30 rounded-md cursor-pointer hover:bg-white hover:bg-opacity-10 text-gray-400"
                    >
                      <Upload size={16} className="mr-2" />
                      Upload Resume
                    </label>
                    {formData.candidateResume && (
                      <span className="text-sm text-gray-400 opacity-80">{formData.candidateResume.name}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 border-opacity-30 rounded-md text-gray-400 hover:bg-white hover:bg-opacity-10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-purple-700 rounded-md hover:bg-opacity-90"
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

export default FindEnquiry;
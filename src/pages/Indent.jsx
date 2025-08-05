import React, { useEffect, useState } from 'react';
import { HistoryIcon, Plus, X } from 'lucide-react';
import useDataStore from '../store/dataStore';
import toast from 'react-hot-toast';

const Indent = () => {
  const { addIndent } = useDataStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    post: '',
    gender: '',
    prefer: '',
    numberOfPost: '',
    competitionDate: '',
    socialSite: '',
    indentNumber: '',
    timestamp: '',
  });
  // const [lastIndentNumber, setLastIndentNumber] = useState(0);

// useEffect(() => {
//   const loadData = async () => {
//     const result = await fetchLastIndentNumber();
//     console.log('Fetch result:', result); // Debug
    
//     if (result.success) {
//       setLastIndentNumber(result.lastIndentNumber);
//       toast.success(`Last indent: ${result.fullLastIndent || result.lastIndentNumber}`);
//     } else {
//       toast.error(result.error);
//       // Fallback to starting from 1 if detection fails
//       setLastIndentNumber(1);
//     }
//   };
  
//   loadData();
// }, []);

useEffect(() => {
  const loadData = async () => {
    const result = await fetchIndentDataFromRow7();
    if (result.success) {
      console.log('Data from row 7:', result.data);
      // Process your data here
    } else {
      console.error('Error:', result.error);
    }
  };
  loadData();
}, []);

const generateIndentNumber = async () => {
  try {
    const result = await fetchLastIndentNumber();
    
    if (result.success) {
      const nextNumber = result.lastIndentNumber + 1;
      return `REC-${String(nextNumber).padStart(2, '0')}`;
    }
    // Fallback if fetch fails
    return 'REC-01';
  } catch (error) {
    console.error('Error generating indent number:', error);
    return 'REC-01';
  }
};

  const getCurrentTimestamp = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const fetchIndentDataFromRow7 = async () => {
  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbzEGpaPLO-ybl9buMbgvidleJA_i56lzRiDiEPlRjf0ZhLovMWd7lX86p5ItL5NrmwYSA/exec?sheet=INDENT&action=fetch'
    );
    
    const result = await response.json();
    
    if (result.success && result.data && result.data.length >= 7) {
      // Get data starting from row 7 (array index 6) to end
      const dataFromRow7 = result.data.slice(6);
      
      // Find headers (assuming they're in row 6 - array index 5)
      const headers = result.data[5].map(h => h.trim());
      
      // Find column indices for important fields
      const timestampIndex = headers.indexOf('Timestamp');
      const indentNumberIndex = headers.indexOf('Indent Number');
      const postIndex = headers.indexOf('Post');
      const GenderIndex = headers.indexOf('Gender');
      // Add other column indices as needed
      
      // Process the data
      const processedData = dataFromRow7.map(row => ({
        timestamp: row[timestampIndex],
        indentNumber: row[indentNumberIndex],
        post: row[postIndex],
        // Add other fields as needed
      }));
      
      return {
        success: true,
        data: processedData,
        headers: headers
      };
    } else {
      return {
        success: false,
        error: 'Not enough rows in sheet data'
      };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const fetchLastIndentNumber = async () => {
  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbzEGpaPLO-ybl9buMbgvidleJA_i56lzRiDiEPlRjf0ZhLovMWd7lX86p5ItL5NrmwYSA/exec?sheet=INDENT&action=fetch'
    );
    
    const result = await response.json();
    console.log('Full sheet data:', result); // Debugging
    
    if (result.success && result.data && result.data.length > 1) {
      // Find the first row with actual headers (skip empty rows)
      let headerRowIndex = 0;
      while (headerRowIndex < result.data.length && 
             result.data[headerRowIndex].every(cell => !cell || cell.trim() === '')) {
        headerRowIndex++;
      }
      
      if (headerRowIndex >= result.data.length) {
        throw new Error('No header row found in sheet');
      }
      
      const headers = result.data[headerRowIndex].map(h => h ? h.trim().toLowerCase() : '');
      console.log('Headers found:', headers);
      
      // Try to find the indent number column by common names
      const possibleNames = ['indent number', 'indentnumber', 'indent_no', 'indentno', 'indent'];
      let indentNumberIndex = -1;
      
      for (const name of possibleNames) {
        indentNumberIndex = headers.indexOf(name);
        if (indentNumberIndex !== -1) break;
      }
      
      if (indentNumberIndex === -1) {
        // If still not found, try to find by position (from your screenshot it's column B/index 1)
        indentNumberIndex = 1;
        console.warn('Using fallback column index 1 for indent number');
      }
      
      // Find the last non-empty row with data
      let lastDataRowIndex = result.data.length - 1;
      while (lastDataRowIndex > headerRowIndex && 
             (!result.data[lastDataRowIndex][indentNumberIndex] || 
              result.data[lastDataRowIndex][indentNumberIndex].trim() === '')) {
        lastDataRowIndex--;
      }
      
      if (lastDataRowIndex <= headerRowIndex) {
        return {
          success: true,
          lastIndentNumber: 0,
          message: 'No data rows found'
        };
      }
      
      const lastIndentNumber = result.data[lastDataRowIndex][indentNumberIndex];
      console.log('Last indent number found:', lastIndentNumber);
      
      // Extract numeric part from "REC-01" format
      let numericValue = 0;
      if (typeof lastIndentNumber === 'string') {
        const match = lastIndentNumber.match(/\d+/);
        numericValue = match ? parseInt(match[0]) : 0;
      } else {
        numericValue = parseInt(lastIndentNumber) || 0;
      }
      
      return {
        success: true,
        lastIndentNumber: numericValue,
        fullLastIndent: lastIndentNumber
      };
    } else {
      return {
        success: true,
        lastIndentNumber: 0,
        message: 'Sheet is empty or has no data rows'
      };
    }
  } catch (error) {
    console.error('Error in fetchLastIndentNumber:', error);
    return {
      success: false,
      error: error.message,
      lastIndentNumber: 0
    };
  }
};





  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.post ||
      !formData.gender ||
      !formData.numberOfPost ||
      !formData.competitionDate ||
      !formData.socialSite
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      // Generate indent number and timestamp
      const indentNumber = await generateIndentNumber();
      const timestamp = getCurrentTimestamp();

      // Format the competition date to MM/DD/YYYY for Google Sheets
      const formattedDate = formatDateForSheet(formData.competitionDate);
console.log(indentNumber);

      const rowData = [
        timestamp,
        indentNumber,
        formData.post,
        formData.gender,
        formData.prefer,
        formData.numberOfPost,
        formattedDate, // Use formatted date here
        formData.socialSite,
      ];

      const response = await fetch('https://script.google.com/macros/s/AKfycbzEGpaPLO-ybl9buMbgvidleJA_i56lzRiDiEPlRjf0ZhLovMWd7lX86p5ItL5NrmwYSA/exec', {
        method: 'POST',
        body: new URLSearchParams({
          sheetName: 'INDENT',
          action: 'insert',
          rowData: JSON.stringify(rowData),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Indent submitted successfully!');
        setFormData({
          post: '',
          gender: '',
          prefer: '',
          numberOfPost: '',
          competitionDate: '',
          socialSite: '',
          indentNumber: '',
          timestamp: '',
        });
        setShowModal(false);
      } else {
        toast.error('Failed to insert: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Insert error:', error);
      toast.error('Something went wrong!');
    }
  };

  // Helper function to format date for Google Sheets
  const formatDateForSheet = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleCancel = () => {
    setFormData({
      post: '',
      gender: '',
      prefer: '',
      numberOfPost: '',
      competitionDate: '',
      socialSite: '',
      indentNumber: '',
      timestamp: '',
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6 page-content p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Indent</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
        >
          <Plus size={16} className="mr-2" />
          Create Indent
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Create New Indent</h3>
              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Post *</label>
                <input
                  type="text"
                  name="post"
                  value={formData.post}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter post title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Any">Any</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prefer</label>
                <input
                  type="text"
                  name="prefer"
                  value={formData.prefer}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter preferences"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number Of Post *</label>
                <input
                  type="number"
                  name="numberOfPost"
                  value={formData.numberOfPost}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter number of posts"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Competition Date *</label>
                <input
                  type="date"
                  name="competitionDate"
                  value={formData.competitionDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
 <div> 
  <label className="block text-sm font-medium text-gray-700 mb-1">Social Site *</label>
  <select 
    name="socialSite"
    value={formData.socialSite}
    onChange={handleInputChange}
    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    required
  >
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>


              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-200"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Indent Management</h2>
        <p className="text-gray-600">
          Create new indents for job positions. Once created, indents will be available in the Social Site section for further processing.
        </p>
      </div>

        <div className=" bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white  ">
              <thead className="bg-white  ">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Indent Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Post</th>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Prefer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">No. of Post</th>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Completion Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">Social Site</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white  ">
                <tr><td>hii</td></tr>
                {/* {filteredPendingData.map((item) => (
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
                ))} */}
              </tbody>
            </table>
            {/* {filteredPendingData.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className=" text-gray-500  ">No pending after leaving work found.</p>
              </div>
            )} */}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Indent;
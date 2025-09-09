import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Building, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to get displayable image URL from Google Drive
  const getDisplayableImageUrl = (url) => {
    if (!url) return null;

    try {
      // Handle direct file ID URLs (https://drive.google.com/file/d/FILE_ID/view)
      const directMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (directMatch && directMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${directMatch[1]}&sz=w400`;
      }
      
      // Handle uc?export=view&id= format (https://drive.google.com/uc?export=view&id=FILE_ID)
      const ucMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (ucMatch && ucMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${ucMatch[1]}&sz=w400`;
      }
      
      // Handle open?id= format (https://drive.google.com/open?id=FILE_ID)
      const openMatch = url.match(/open\?id=([a-zA-Z0-9_-]+)/);
      if (openMatch && openMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${openMatch[1]}&sz=w400`;
      }
      
      // If it's already a thumbnail URL, return as is
      if (url.includes("thumbnail?id=")) {
        return url;
      }
      
      // If URL contains a file ID but doesn't match any pattern above
      // Try to extract any potential file ID (at least 25 characters)
      const anyIdMatch = url.match(/([a-zA-Z0-9_-]{25,})/);
      if (anyIdMatch && anyIdMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${anyIdMatch[1]}&sz=w400`;
      }
      
      // If no file ID found, return the original URL with cache buster
      const cacheBuster = Date.now();
      return url.includes("?") ? `${url}&cb=${cacheBuster}` : `${url}?cb=${cacheBuster}`;
    } catch (e) {
      console.error("Error processing image URL:", url, e);
      return url; // Return original URL as fallback
    }
  };

  const fetchJoiningData = async () => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found in localStorage');
      }

      const currentUser = JSON.parse(userData);
      const userName = currentUser.Name;

      // Fetch data from the sheet API
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbwfGaiHaPhexcE9i-A7q9m81IX6zWqpr4lZBe4AkhlTjVl4wCl0v_ltvBibfduNArBVoA/exec?sheet=JOINING&action=fetch'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data from JOINING sheet');
      }
      
      const rawData = result.data || result;
      
      if (!Array.isArray(rawData)) {
        throw new Error('Expected array data not received');
      }

      // Find the header row by looking for the 'SKA-Joining ID' column
      let headerRowIndex = -1;
      let headers = [];
      
      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];
        if (row && Array.isArray(row)) {
          const joiningIdIndex = row.findIndex(cell => 
            cell && cell.toString().trim().toLowerCase().includes('ska-joining id')
          );
          
          if (joiningIdIndex !== -1) {
            headerRowIndex = i;
            headers = row.map(h => h?.toString().trim());
            break;
          }
        }
      }
      
      if (headerRowIndex === -1) {
        throw new Error('Could not find header row with SKA-Joining ID column');
      }

      const dataRows = rawData.length > headerRowIndex + 1 ? rawData.slice(headerRowIndex + 1) : [];
      
      const getIndex = (headerName) => {
        const index = headers.findIndex(h => 
          h && h.toString().trim().toLowerCase() === headerName.toLowerCase()
        );
        if (index === -1) {
          console.warn(`Column "${headerName}" not found in sheet`);
        }
        return index;
      };

      const processedData = dataRows.map(row => ({
        timestamp: row[getIndex('Timestamp')] || '',
        joiningNo: row[getIndex('SKA-Joining ID')] || '',
        candidateName: row[getIndex('Name As Per Aadhar')] || '',
        candidatePhoto: row[getIndex("Candidate's Photo")] || '',
        fatherName: row[getIndex('Father Name')] || '',
        dateOfJoining: row[getIndex('Date Of Joining')] || '',
        joiningPlace: '',
        designation: row[getIndex('Designation')] || '',
        salary: row[getIndex('Department')] || '',
        currentAddress: row[getIndex('Current Address')] || '',
        addressAsPerAadhar: '',
        bodAsPerAadhar: row[getIndex('Date Of Birth As Per Aadhar Card')] || '',
        gender: row[getIndex('Gender')] || '',
        mobileNo: row[getIndex('Mobile No.')] || '',
        familyMobileNo: row[getIndex('Family Mobile No')] || '',
        relationWithFamily: row[getIndex('Relationship With Family Person')] || '',
        email: row[getIndex('Personal Email-Id')] || '', 
        companyName: row[getIndex('Department')] || '',
        aadharNo: row[getIndex('Aadhar Card No')] || '',
      }));

      console.log(processedData);
      

      // Filter data for the current user
      const filteredData = processedData.filter(task => 
        task.candidateName?.trim().toLowerCase() === userName.trim().toLowerCase()
      );

      if (filteredData.length > 0) {
        const profile = filteredData[0];
        
        // Fetch profile image from ENQUIRY sheet
        try {
          const enquiryResponse = await fetch(
            'https://script.google.com/macros/s/AKfycbwfGaiHaPhexcE9i-A7q9m81IX6zWqpr4lZBe4AkhlTjVl4wCl0v_ltvBibfduNArBVoA/exec?sheet=ENQUIRY&action=fetch'
          );
          
          if (enquiryResponse.ok) {
            const enquiryResult = await enquiryResponse.json();
            if (enquiryResult.success) {
              const enquiryData = enquiryResult.data || enquiryResult;
              
              // Find the header row in ENQUIRY sheet
              let enquiryHeaderRowIndex = -1;
              let enquiryHeaders = [];
              
              for (let i = 0; i < enquiryData.length; i++) {
                const row = enquiryData[i];
                if (row && Array.isArray(row)) {
                  const candidatePhotoIndex = row.findIndex(cell => 
                    cell && cell.toString().trim().toLowerCase().includes("candidate's photo")
                  );
                  
                  if (candidatePhotoIndex !== -1) {
                    enquiryHeaderRowIndex = i;
                    enquiryHeaders = row.map(h => h?.toString().trim());
                    break;
                  }
                }
              }
              
              if (enquiryHeaderRowIndex !== -1) {
                const photoIndex = enquiryHeaders.findIndex(h => 
                  h && h.toLowerCase().includes("candidate's photo")
                );
                
                // Find the row with matching employee ID
                const employeeIdIndex = enquiryHeaders.findIndex(h => 
                  h && h.toLowerCase().includes('ska-joining id')
                );
                
                if (employeeIdIndex !== -1 && photoIndex !== -1) {
                  for (let i = enquiryHeaderRowIndex + 1; i < enquiryData.length; i++) {
                    const row = enquiryData[i];
                    if (row[employeeIdIndex] === profile.joiningNo && row[photoIndex]) {
                      profile.candidatePhoto = row[photoIndex];
                      break;
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error fetching profile image from ENQUIRY sheet:', error);
          // Continue without the profile image if there's an error
        }
        
        setProfileData(profile);
        setFormData(profile);
        localStorage.setItem("employeeId", profile.joiningNo);
      } else {
        toast.error('No profile data found for current user');
      }
      
    } catch (error) {
      console.error('Error fetching joining data:', error);
      toast.error(`Failed to load profile data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoiningData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch current data from JOINING sheet
      const fullDataResponse = await fetch(
        'https://script.google.com/macros/s/AKfycbwfGaiHaPhexcE9i-A7q9m81IX6zWqpr4lZBe4AkhlTjVl4wCl0v_ltvBibfduNArBVoA/exec?sheet=JOINING&action=fetch'
      );
      
      if (!fullDataResponse.ok) {
        throw new Error(`HTTP error! status: ${fullDataResponse.status}`);
      }

      const fullDataResult = await fullDataResponse.json();
      const allData = fullDataResult.data || fullDataResult;

      // 2. Find header row by looking for the 'SKA-Joining ID' column
      let headerRowIndex = -1;
      let headers = [];
      
      for (let i = 0; i < allData.length; i++) {
        const row = allData[i];
        if (row && Array.isArray(row)) {
          const joiningIdIndex = row.findIndex(cell => 
            cell && cell.toString().trim().toLowerCase().includes('ska-joining id')
          );
          
          if (joiningIdIndex !== -1) {
            headerRowIndex = i;
            headers = row.map(h => h?.toString().trim());
            break;
          }
        }
      }
      
      if (headerRowIndex === -1) {
        throw new Error("Could not find header row with 'SKA-Joining ID' column");
      }

      // 3. Find Employee ID column index
      const employeeIdIndex = headers.findIndex(h => 
        h && h.toLowerCase().includes('ska-joining id')
      );
      
      if (employeeIdIndex === -1) {
        throw new Error("Could not find 'SKA-Joining ID' column");
      }

      // 4. Find the employee row index
      const rowIndex = allData.findIndex((row, idx) =>
        idx > headerRowIndex &&
        row[employeeIdIndex]?.toString().trim() === profileData.joiningNo?.toString().trim()
      );
      
      if (rowIndex === -1) throw new Error(`Employee ${profileData.joiningNo} not found`);

      // 5. Get a copy of the existing row
      let currentRow = [...allData[rowIndex]];

      // 6. Apply updates to the row data
      // Map form fields to their respective column indices
      const headerMap = {
        'mobileNo': headers.findIndex(h => h && h.toLowerCase().includes('mobile no')),
        'familyMobileNo': headers.findIndex(h => h && h.toLowerCase().includes('family mobile no')),
        'email': headers.findIndex(h => h && h.toLowerCase().includes('personal email-id')),
        'currentAddress': headers.findIndex(h => h && h.toLowerCase().includes('current address'))
      };

      // Only update fields that are editable in the form
      if (headerMap['mobileNo'] !== -1) {
        currentRow[headerMap['mobileNo']] = formData.mobileNo || '';
      }
      if (headerMap['familyMobileNo'] !== -1) {
        currentRow[headerMap['familyMobileNo']] = formData.familyMobileNo || '';
      }
      if (headerMap['email'] !== -1) {
        currentRow[headerMap['email']] = formData.email || '';
      }
      if (headerMap['currentAddress'] !== -1) {
        currentRow[headerMap['currentAddress']] = formData.currentAddress || '';
      }

      // 7. Prepare payload
      const payload = {
        sheetName: "JOINING",
        action: "update",
        rowIndex: rowIndex + 1, // Convert to 1-based index
        rowData: JSON.stringify(currentRow)
      };

      console.log("Final payload being sent:", payload);

      // 8. Send update request
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwfGaiHaPhexcE9i-A7q9m81IX6zWqpr4lZBe4AkhlTjVl4wCl0v_ltvBibfduNArBVoA/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(payload).toString(),
        }
      );

      const result = await response.json();
      console.log("Update result:", result);

      if (result.success) {
        // Update local state only after successful API update
        setProfileData(formData);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        throw new Error(result.error || "Failed to update data");
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData || {});
    setIsEditing(false);
  };

  if (loading) {
    return <div className="page-content p-6"><div className="flex justify-center flex-col items-center">
                        <div className="w-6 h-6 border-4 border-indigo-500 border-dashed rounded-full animate-spin mb-2"></div>
                        <span className="text-gray-600 text-sm">Loading profile data...</span>
                      </div></div>;
  }

  if (!profileData) {
    return <div className="page-content p-6">No profile data available</div>;
  }

  return (
    <div className="space-y-6 page-content p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <div className="flex space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Edit3 size={16} className="mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save size={16} className="mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X size={16} className="mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="text-center">
            <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              {profileData.candidatePhoto ? (
                <img
                  src={getDisplayableImageUrl(profileData.candidatePhoto)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log("Image failed to load:", e.target.src);
                    // First try the original URL directly
                    if (e.target.src !== profileData.candidatePhoto) {
                      console.log("Trying original URL:", profileData.candidatePhoto);
                      e.target.src = profileData.candidatePhoto;
                    } else {
                      // If that also fails, show user icon
                      console.log("Both thumbnail and original URL failed");
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }
                  }}
                  onLoad={(e) => {
                    console.log("Image loaded successfully:", e.target.src);
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full flex items-center justify-center ${
                  profileData.candidatePhoto ? "hidden" : "flex"
                }`}
              >
                <User size={48} className="text-indigo-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {profileData.candidateName}
            </h2>
            <p className="text-gray-600">{profileData.designation}</p>
            <p className="text-sm text-gray-500">{profileData.joiningNo}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Full Name
                </label>
                <p className="text-gray-800 font-medium">{profileData.candidateName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building size={16} className="inline mr-2" />
                  Designation
                </label>
                <p className="text-gray-800">{profileData.designation}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building size={16} className="inline mr-2" />
                  Department
                </label>
                <p className="text-gray-800">{profileData.companyName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Date of Birth
                </label>
                <p className="text-gray-800">{profileData.bodAsPerAadhar}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <p className="text-gray-800">{profileData.gender}</p>
              </div>
            </div>

            {/* Second Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
                <p className="text-gray-800">{profileData.fatherName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Joining Date
                </label>
                <p className="text-gray-800">{profileData.dateOfJoining}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-gray-800">{profileData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="mobileNo"
                    value={formData.mobileNo || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-gray-800">{profileData.mobileNo}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="familyMobileNo"
                    value={formData.familyMobileNo || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-gray-800">{profileData.familyMobileNo}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Current Address - Full width below the two columns */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Current Address
            </label>
            {isEditing ? (
              <textarea
                name="currentAddress"
                value={formData.currentAddress || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-800 whitespace-pre-line">{profileData.currentAddress}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
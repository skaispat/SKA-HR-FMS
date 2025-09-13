import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer
} from 'recharts';
import {
  Users,
  UserCheck,
  UserX,
  Clock, 
  UserPlus,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [activeEmployee, setActiveEmployee] = useState(0);
  const [leftEmployee, setLeftEmployee] = useState(0);
  const [leaveThisMonth, setLeaveThisMonth] = useState(0);
  const [monthlyHiringData, setMonthlyHiringData] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const [postRequiredData, setPostRequiredData] = useState([]);
  const [leaveAnalyticsData, setLeaveAnalyticsData] = useState([]);

  // Parse DD/MM/YYYY format date
  const parseSheetDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new Date(year, month, day);
  };

  // Fetch Leave Management Data for Analytics
  const fetchLeaveAnalytics = async () => {
    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbwfGaiHaPhexcE9i-A7q9m81IX6zWqpr4lZBe4AkhlTjVl4wCl0v_ltvBibfduNArBVoA/exec?sheet=Leave%20Management&action=fetch'
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data from Leave Management sheet');
      }

      const rawData = result.data || result;
      if (!Array.isArray(rawData)) {
        throw new Error('Expected array data not received');
      }

      const headers = rawData[0];
      const dataRows = rawData.slice(1);

      const statusIndex = headers.findIndex(h => h && h.toString().trim().toLowerCase() === "status");
      const fromIndex = headers.findIndex(h => h && h.toString().trim().toLowerCase().includes("leave date start"));
      const toIndex = headers.findIndex(h => h && h.toString().trim().toLowerCase().includes("leaave date en"));
      const nameIndex = headers.findIndex(h => h && h.toString().trim().toLowerCase().includes("employee name"));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let todayLeaves = 0;
      let upcomingLeaves = 0;

      dataRows.forEach(row => {
        const status = row[statusIndex]?.toString().trim().toLowerCase();
        if (status !== "approved") return;

        const fromDate = parseSheetDate(row[fromIndex]);
        const toDate = parseSheetDate(row[toIndex]);

        if (fromDate && toDate) {
          if (today >= fromDate && today <= toDate) {
            todayLeaves += 1;
          } else if (fromDate > today) {
            upcomingLeaves += 1;
          }
        }
      });

      const analytics = [
        { type: "Today's Leaves", count: todayLeaves },
        { type: "Upcoming Leaves", count: upcomingLeaves }
      ];

      setLeaveAnalyticsData(analytics);
    } catch (error) {
      console.error("Error fetching leave analytics:", error);
      setLeaveAnalyticsData([]);
    }
  };

  // Fetch Post Required Data
  const fetchPostRequiredData = async () => {
    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbwfGaiHaPhexcE9i-A7q9m81IX6zWqpr4lZBe4AkhlTjVl4wCl0v_ltvBibfduNArBVoA/exec?sheet=INDENT&action=fetch'
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data from INDENT sheet');
      }

      const rawData = result.data || result;
      if (!Array.isArray(rawData)) {
        throw new Error('Expected array data not received');
      }

      const headers = rawData[5];
      const dataRows = rawData.slice(6);

      const postNameIndex = 2; // Column C
      const numberOfPostsIndex = 5; // Column F
      const statusIndex = 8; // Column I

      const needMoreData = dataRows.filter(row =>
        row[statusIndex]?.toString().trim().toLowerCase() === "need more"
      );

      const postData = needMoreData.map(row => ({
        postName: row[postNameIndex]?.toString().trim() || 'Unnamed Post',
        numberOfPosts: parseInt(row[numberOfPostsIndex]) || 0
      }));

      setPostRequiredData(postData);
    } catch (error) {
      console.error("Error fetching post required data:", error);
      setPostRequiredData([]);
    }
  };


// const parseSheetDate = (dateStr) => {
//   // Expecting format DD/MM/YYYY
//   const parts = dateStr.split('/');
//   if (parts.length !== 3) return null;

//   const day = parseInt(parts[0], 10);
//   const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
//   const year = parseInt(parts[2], 10);

//   if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

//   return new Date(year, month, day);
// };

const fetchLeaveData = async () => {
  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbwfGaiHaPhexcE9i-A7q9m81IX6zWqpr4lZBe4AkhlTjVl4wCl0v_ltvBibfduNArBVoA/exec?sheet=Leave Management&action=fetch'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch data from Leave Management sheet');
    }

    const rawData = result.data || result;
    if (!Array.isArray(rawData)) {
      throw new Error('Expected array data not received');
    }

    const dataRows = rawData.slice(6); // Row 7 onwards

    // Find column indexes
    const leaveStartIndex = 4; // Column E
    const leaveEndIndex = 5;   // Column F
    const statusIndex = 7;     // Column H
    
    // Filter only approved leaves
    const approvedLeaves = dataRows.filter(row => 
      row[statusIndex]?.toString().trim().toLowerCase() === "approved"
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todaysLeavesCount = 0;
    let upcomingLeavesCount = 0;

    approvedLeaves.forEach(row => {
      const startDateStr = row[leaveStartIndex];
      const endDateStr = row[leaveEndIndex];
      
      if (!startDateStr || !endDateStr) return;
      
      const startDate = parseSheetDate(startDateStr);
      const endDate = parseSheetDate(endDateStr);
      
      if (!startDate || !endDate) return;
      
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      // Expand day-by-day between startDate and endDate
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        if (d.getTime() === today.getTime()) {
          todaysLeavesCount++;
        } else if (d > today) {
          upcomingLeavesCount++;
        }
      }
    });

    const leaveData = [
      { name: "Today's Leaves", count: todaysLeavesCount },
      { name: "Upcoming Leaves", count: upcomingLeavesCount }
    ];

    setLeaveAnalyticsData(leaveData);

  } catch (error) {
    console.error("Error fetching leave data:", error);
    setLeaveAnalyticsData([
      { name: "Today's Leaves", count: 0 },
      { name: "Upcoming Leaves", count: 0 }
    ]);
  }
};


  const fetchJoiningCount = async () => {
    try {
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
  
      // Headers are row 6 → index 5
      const headers = rawData[5];
      const dataRows = rawData.length > 6 ? rawData.slice(6) : [];
  
      // Find index of "Status", "Date of Joining", and "Designation" columns
      const statusIndex = headers.findIndex(
        h => h && h.toString().trim().toLowerCase() === "status"
      );
      
      const dateOfJoiningIndex = headers.findIndex(
        h => h && h.toString().trim().toLowerCase().includes("date of joining")
      );

      const designationIndex = headers.findIndex(
        h => h && h.toString().trim().toLowerCase() === "designation"
      );
  
      let activeCount = 0;
      const monthlyHiring = {};
      const designationCounts = {};
      
      // Initialize monthly hiring data for the last 6 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentDate.getMonth() - i + 12) % 12;
        const monthYear = `${months[monthIndex]} ${currentDate.getFullYear()}`;
        monthlyHiring[monthYear] = { hired: 0 };
      }
  
      if (statusIndex !== -1) {
        activeCount = dataRows.filter(
          row => row[statusIndex]?.toString().trim().toLowerCase() === "active"
        ).length;
      }
  
      // Count hires by month if date of joining column exists
      if (dateOfJoiningIndex !== -1) {
        dataRows.forEach(row => {
          const dateStr = row[dateOfJoiningIndex];
          if (dateStr) {
            const date = parseSheetDate(dateStr);
            if (date) {
              const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
              if (monthlyHiring[monthYear]) {
                monthlyHiring[monthYear].hired += 1;
              } else {
                monthlyHiring[monthYear] = { hired: 1 };
              }
            }
          }
        });
      }

      // Count employees by designation
      if (designationIndex !== -1) {
        dataRows.forEach(row => {
          const designation = row[designationIndex]?.toString().trim();
          if (designation) {
            if (designationCounts[designation]) {
              designationCounts[designation] += 1;
            } else {
              designationCounts[designation] = 1;
            }
          }
        });

        // Convert to array format for the chart
        const designationArray = Object.keys(designationCounts).map(key => ({
          designation: key,
          employees: designationCounts[key]
        }));

        setDesignationData(designationArray);
      }
  
      // Update state
      setActiveEmployee(dataRows.length);
      
      // Return both counts and monthly hiring data
      return { 
        total: dataRows.length, 
        active: activeCount,
        monthlyHiring 
      };
  
    } catch (error) {
      console.error("Error fetching joining count:", error);
      return { total: 0, active: 0, monthlyHiring: {} };
    }
  };

const fetchLeaveCount = async () => {
  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbwfGaiHaPhexcE9i-A7q9m81IX6zWqpr4lZBe4AkhlTjVl4wCl0v_ltvBibfduNArBVoA/exec?sheet=LEAVING&action=fetch'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch data from LEAVING sheet');
    }

    const rawData = result.data || result;
    if (!Array.isArray(rawData)) {
      throw new Error('Expected array data not received');
    }

    const headers = rawData[5];       // Row 6 headers
    const dataRows = rawData.slice(6); // Row 7 onwards

    // Check for Column D (index 3) for "Left This Month" count
    let thisMonthCount = 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    if (dataRows.length > 0) {
      // Use column D (index 3) for date of leaving
      thisMonthCount = dataRows.filter(row => {
        const dateStr = row[3]; // Column D (index 3)
        if (dateStr) {
          const parsedDate = parseSheetDate(dateStr);
          return (
            parsedDate &&
            parsedDate.getMonth() === currentMonth &&
            parsedDate.getFullYear() === currentYear
          );
        }
        return false;
      }).length;
    }

    // Count leaving by month (for the chart)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyLeaving = {};
    
    // Initialize monthly leaving data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (now.getMonth() - i + 12) % 12;
      const monthYear = `${months[monthIndex]} ${now.getFullYear()}`;
      monthlyLeaving[monthYear] = { left: 0 };
    }

    dataRows.forEach(row => {
      const dateStr = row[3]; // Use Column D (index 3) for date of leaving
      if (dateStr) {
        const date = parseSheetDate(dateStr);
        if (date) {
          const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
          if (monthlyLeaving[monthYear]) {
            monthlyLeaving[monthYear].left += 1;
          } else {
            monthlyLeaving[monthYear] = { left: 1 };
          }
        }
      }
    });

    // Update states
    setLeftEmployee(dataRows.length);
    setLeaveThisMonth(thisMonthCount);

    return { total: dataRows.length, monthlyLeaving };

  } catch (error) {
    console.error("Error fetching leave count:", error);
    return { total: 0, monthlyLeaving: {} };
  }
};

  const prepareMonthlyHiringData = (hiringData, leavingData) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const result = [];
    
    // Get data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentDate.getMonth() - i + 12) % 12;
      const monthYear = `${months[monthIndex]} ${currentDate.getFullYear()}`;
      
      result.push({
        month: months[monthIndex],
        hired: hiringData[monthYear]?.hired || 0,
        left: leavingData[monthYear]?.left || 0
      });
    }
    
    return result;
  };

useEffect(() => {
    const fetchData = async () => {
      try {
        const [joiningResult, leavingResult] = await Promise.all([
          fetchJoiningCount(),
          fetchLeaveCount(),
          fetchPostRequiredData(),
          fetchLeaveAnalytics()
        ]);

        setTotalEmployee(joiningResult.total + leavingResult.total);

        const monthlyData = prepareMonthlyHiringData(
          joiningResult.monthlyHiring,
          leavingResult.monthlyLeaving
        );

        setMonthlyHiringData(monthlyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

return (
    <div className="space-y-6 page-content p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">HR Dashboard</h1>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border p-6 flex items-start">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <Users size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Total Employees</p>
            <h3 className="text-2xl font-bold text-gray-800">{totalEmployee}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6 flex items-start">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <UserCheck size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Active Employees</p>
            <h3 className="text-2xl font-bold text-gray-800">{activeEmployee}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6 flex items-start">
          <div className="p-3 rounded-full bg-amber-100 mr-4">
            <Clock size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">On Resigned</p>
            <h3 className="text-2xl font-bold text-gray-800">{leftEmployee}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6 flex items-start">
          <div className="p-3 rounded-full bg-red-100 mr-4">
            <UserX size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Left This Month</p>
            <h3 className="text-2xl font-bold text-gray-800">{leaveThisMonth}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Analytics Chart */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Clock size={20} className="mr-2" />
            Leave Analytics (Today vs Upcoming)
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaveAnalyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="type" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#374151'
                  }}
                />
                <Bar dataKey="count" name="Employees on Leave" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Posts Requiring More Candidates */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp size={20} className="mr-2" />
            Posts Requiring More Candidates
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={postRequiredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="postName" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#374151'
                  }}
                />
                <Bar dataKey="numberOfPosts" name="Posts Required" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Designation-wise Employee Count */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <UserPlus size={20} className="mr-2" />
          Designation-wise Employee Count
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={designationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="designation" stroke="#374151" />
              <YAxis stroke="#374151" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#374151'
                }}
              />
              <Bar dataKey="employees" name="Employees">
                {designationData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 3 === 0 ? '#EF4444' : index % 3 === 1 ? '#10B981' : '#3B82F6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

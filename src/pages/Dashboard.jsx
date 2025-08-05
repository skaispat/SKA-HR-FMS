import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Users, 
  UserCheck, 
  UserX, 
  UserPlus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  // Mock data for charts
  const employeeStatusData = [
    { name: 'Active', value: 85, color: '#10B981' },
    { name: 'On Leave', value: 12, color: '#F59E0B' },
    { name: 'Resigned', value: 8, color: '#EF4444' }
  ];

  const monthlyHiringData = [
    { month: 'Jan', hired: 12, left: 3 },
    { month: 'Feb', hired: 15, left: 5 },
    { month: 'Mar', hired: 18, left: 2 },
    { month: 'Apr', hired: 22, left: 7 },
    { month: 'May', hired: 20, left: 4 },
    { month: 'Jun', hired: 25, left: 6 }
  ];

  const departmentData = [
    { department: 'IT', employees: 45 },
    { department: 'HR', employees: 12 },
    { department: 'Finance', employees: 18 },
    { department: 'Marketing', employees: 25 },
    { department: 'Operations', employees: 35 }
  ];

  const performanceData = [
    { month: 'Jan', productivity: 85, satisfaction: 78 },
    { month: 'Feb', productivity: 88, satisfaction: 82 },
    { month: 'Mar', productivity: 92, satisfaction: 85 },
    { month: 'Apr', productivity: 89, satisfaction: 88 },
    { month: 'May', productivity: 94, satisfaction: 90 },
    { month: 'Jun', productivity: 96, satisfaction: 92 }
  ];

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
            <h3 className="text-2xl font-bold text-gray-800">135</h3>
            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6 flex items-start">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <UserCheck size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Active Employees</p>
            <h3 className="text-2xl font-bold text-gray-800">128</h3>
            <p className="text-xs text-green-600 mt-1">+8% from last month</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6 flex items-start">
          <div className="p-3 rounded-full bg-amber-100 mr-4">
            <Clock size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">On Leave</p>
            <h3 className="text-2xl font-bold text-gray-800">7</h3>
            <p className="text-xs text-amber-600 mt-1">2 pending approvals</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6 flex items-start">
          <div className="p-3 rounded-full bg-red-100 mr-4">
            <UserX size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Left This Month</p>
            <h3 className="text-2xl font-bold text-gray-800">3</h3>
            <p className="text-xs text-red-600 mt-1">2 resignations, 1 termination</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Users size={20} className="mr-2" />
            Employee Status Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employeeStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {employeeStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ color: '#374151' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp size={20} className="mr-2" />
            Monthly Hiring vs Attrition
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyHiringData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="month" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#374151'
                  }} 
                />
                <Legend wrapperStyle={{ color: '#374151' }} />
                <Bar dataKey="hired" name="Hired" fill="#10B981" />
                <Bar dataKey="left" name="Left" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <UserPlus size={20} className="mr-2" />
            Department-wise Employee Count
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis type="number" stroke="#374151" />
                <YAxis dataKey="department" type="category" stroke="#374151" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#374151'
                  }} 
                />
                <Bar dataKey="employees" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <CheckCircle size={20} className="mr-2" />
            Performance Metrics
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="month" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#374151'
                  }} 
                />
                <Legend wrapperStyle={{ color: '#374151' }} />
                <Line type="monotone" dataKey="productivity" name="Productivity %" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="satisfaction" name="Satisfaction %" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Recent HR Activities</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-start pb-4 border-b border-gray-200">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-800">New employee onboarded</p>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  John Doe joined as Software Developer in IT Department
                </p>
                <div className="mt-2 flex items-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
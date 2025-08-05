import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Globe,
  Search,
  Phone,
  UserCheck,
  UserX,
  UserMinus,
  Users,
  Calendar,
  DollarSign,
  FileText as LeaveIcon,
  User as ProfileIcon,
  Clock,
  LogOut as LogOutIcon,
  X,
  User
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = ({ onClose }) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminMenuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/indent', icon: FileText, label: 'Indent' },
    // { path: '/social-site', icon: Globe, label: 'Social Site' },
    { path: '/find-enquiry', icon: Search, label: 'Find Enquiry' },
    { path: '/call-tracker', icon: Phone, label: 'Call Tracker' },
    { path: '/after-joining-work', icon: UserCheck, label: 'After Joining Work' },
    { path: '/leaving', icon: UserX, label: 'Leaving' },
    { path: '/after-leaving-work', icon: UserMinus, label: 'After Leaving Work' },
    { path: '/employee', icon: Users, label: 'Employee' },
     { path: '/leave-management', icon: Users, label: 'Leave Management' },
      { path: '/attendance', icon: Users, label: 'Attendance' },
  ];

  const employeeMenuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/my-profile', icon: ProfileIcon, label: 'My Profile' },
    { path: '/my-attendance', icon: Clock, label: 'My Attendance' },
    { path: '/leave-request', icon: LeaveIcon, label: 'Leave Request' },
    { path: '/my-salary', icon: DollarSign, label: 'My Salary' },
    { path: '/company-calendar', icon: Calendar, label: 'Company Calendar' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : employeeMenuItems;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-indigo-800">
        <h1 className="text-xl font-bold flex items-center gap-2 text-white">
          <Users size={24} />
          <span>HR FMS</span>
          {user?.role === 'employee' && (
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Employee</span>
          )}
        </h1>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path} 
            className={({ isActive }) => 
              `flex items-center py-2.5 px-4 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-indigo-800 text-white' 
                : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
           }`
            }
            onClick={onClose}
          >
            <item.icon className="mr-3" size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white border-opacity-20">
        <div className="flex items-center space-x-4 mb-4">
         
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
              <User size={20} className="text-indigo-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">{user?.id || 'Guest'}</p>
              <p className="text-xs text-white">{user?.role === 'admin' ? 'Administrator' : 'Maintenance Team'}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            handleLogout();
            onClose?.();
          }}
          className="flex items-center py-2.5 px-4 rounded-lg text-white opacity-80 hover:bg-white hover:bg-opacity-10 hover:opacity-100 cursor-pointer transition-colors w-full"
        >
          <LogOutIcon className="mr-3" size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
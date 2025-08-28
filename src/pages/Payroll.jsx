import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Calendar, Clock, Download, Upload, Check, X, DollarSign, FileText, BarChart3, CreditCard, Receipt, Calculator, Filter, Eye, MoreVertical, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Payroll = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ctc');
  const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    employmentType: '',
    location: ''
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [hoveredDeduction, setHoveredDeduction] = useState(null);
  const [payFrequency, setPayFrequency] = useState('Monthly');
  const [customDays, setCustomDays] = useState(1);
  const [selectedEmployeeForPayslip, setSelectedEmployeeForPayslip] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showEarningOptions, setShowEarningOptions] = useState(false);
  const [showDeductionOptions, setShowDeductionOptions] = useState(false);
  const [customEarnings, setCustomEarnings] = useState([]);
  const [customDeductions, setCustomDeductions] = useState([]);

  // Earning and deduction options
  const earningOptions = [
    { id: 'lta', label: 'Leave Travel Allowance', default: 0 },
    { id: 'bonus', label: 'Bonus', default: 0 },
    { id: 'overtime', label: 'Overtime', default: 0 }
  ];

  const deductionOptions = [
    { id: 'incomeTax', label: 'Loan', default: 0 },
    { id: 'professionalTax', label: 'Professional Tax', default: 0 }
  ];

  // Simple notification system to replace toast
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Calculate salary based on pay frequency
  const calculateSalaryByFrequency = (baseSalary, frequency, days = 1, isDeduction = false) => {
    // For deductions, only PF should be calculated based on frequency
    if (isDeduction && frequency !== 'Custom') {
      return baseSalary;
    }
    
    switch (frequency) {
      case 'Hourly':
        return baseSalary / (30 * 8);
      case 'Daily':
        return baseSalary / 30;
      case 'Weekly':
        return baseSalary / 4;
      case 'Custom':
        return (baseSalary / 30) * days;
      case 'Monthly':
      default:
        return baseSalary;
    }
  };

  // Add a custom earning
  const addCustomEarning = (option) => {
    if (!customEarnings.find(earning => earning.id === option.id)) {
      setCustomEarnings([...customEarnings, { ...option, value: option.default }]);
      setShowEarningOptions(false);
      showNotification(`${option.label} added to earnings`);
    }
  };

  // Add a custom deduction
  const addCustomDeduction = (option) => {
    if (!customDeductions.find(deduction => deduction.id === option.id)) {
      setCustomDeductions([...customDeductions, { ...option, value: option.default }]);
      setShowDeductionOptions(false);
      showNotification(`${option.label} added to deductions`);
    }
  };

  // Update custom earning value
  const updateCustomEarning = (id, value) => {
    setCustomEarnings(customEarnings.map(earning => 
      earning.id === id ? { ...earning, value: parseFloat(value) || 0 } : earning
    ));
  };

  // Update custom deduction value
  const updateCustomDeduction = (id, value) => {
    setCustomDeductions(customDeductions.map(deduction => 
      deduction.id === id ? { ...deduction, value: parseFloat(value) || 0 } : deduction
    ));
  };

  // Remove custom earning
  const removeCustomEarning = (id) => {
    setCustomEarnings(customEarnings.filter(earning => earning.id !== id));
  };

  // Remove custom deduction
  const removeCustomDeduction = (id) => {
    setCustomDeductions(customDeductions.filter(deduction => deduction.id !== id));
  };

  // Sample data for demonstration
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample employee data
        const sampleEmployees = [
          { employeeId: 'EMP001', employeeName: 'John Doe', designation: 'Developer', department: 'IT', status: 'active' },
          { employeeId: 'EMP002', employeeName: 'Jane Smith', designation: 'Designer', department: 'Creative', status: 'active' },
          { employeeId: 'EMP003', employeeName: 'Robert Johnson', designation: 'Manager', department: 'Operations', status: 'active' },
          { employeeId: 'EMP004', employeeName: 'Sarah Williams', designation: 'HR Executive', department: 'HR', status: 'active' },
        ];
        
        // Sample payroll data with updated structure
        const samplePayrollData = [
          { 
            employeeId: 'EMP001', 
            period: '2023-08', 
            basic: 50000, 
            otherAllowances: 3000, 
            pf: 1800, 
            other: 2000, 
            net: 49200, 
            gross: 53000, 
            status: 'processed' 
          },
          { 
            employeeId: 'EMP002', 
            period: '2023-08', 
            basic: 45000, 
            otherAllowances: 2500, 
            pf: 1620, 
            other: 1800, 
            net: 44080, 
            gross: 47500, 
            status: 'processed' 
          },
        ];
        
        setEmployees(sampleEmployees);
        setPayrollData(samplePayrollData);
      } catch (error) {
        setError(error.message);
        showNotification(`Failed to load data: ${error.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleExport = (format) => {
    showNotification(`Exporting to ${format.toUpperCase()}...`);
    // Export logic would go here
  };

  const handleProcessPayouts = () => {
    showNotification('Processing payouts...');
    // Payout processing logic would go here
  };

  const handleRecalculate = () => {
    showNotification('Recalculating payroll...');
    // Recalculation logic would go here
  };

  const handleValidate = () => {
    showNotification('Validating payroll data...');
    // Validation logic would go here
  };

  const handleViewCTCBreakdown = (employeeId) => {
    const employeeData = payrollData.find(item => item.employeeId === employeeId);
    const employeeInfo = employees.find(e => e.employeeId === employeeId);
    
    if (employeeData && employeeInfo) {
      setSelectedEmployee({
        ...employeeData,
        employeeName: employeeInfo.employeeName
      });
      setActiveTab('ctc');
    }
  };

  // Render CTC Breakdown tab with selected employee data
  const renderCTCBreakdown = () => {
    const employeeData = selectedEmployee || payrollData[0];
      
    const basicSalary = calculateSalaryByFrequency(
      employeeData?.basic || 0, 
      payFrequency, 
      customDays
    );
    
    // Other allowances should not change for custom frequency
    const otherAllowances = payFrequency === 'Custom' 
      ? (employeeData?.otherAllowances || 0)
      : calculateSalaryByFrequency(
          employeeData?.otherAllowances || 0, 
          payFrequency, 
          customDays
        );
    
    // Only PF deduction should be calculated for custom frequency
    const pfDeduction = calculateSalaryByFrequency(
      employeeData?.pf || 0, 
      payFrequency, 
      customDays,
      true // This flag indicates it's a deduction
    );
    
    // Other deductions should not change for custom frequency
    const otherDeduction = payFrequency === 'Custom' 
      ? (employeeData?.other || 0)
      : calculateSalaryByFrequency(
          employeeData?.other || 0, 
          payFrequency, 
          customDays
        );
      
    // Calculate total custom earnings
    const totalCustomEarnings = customEarnings.reduce((sum, earning) => sum + earning.value, 0);
    
    // Calculate total custom deductions
    const totalCustomDeductions = customDeductions.reduce((sum, deduction) => sum + deduction.value, 0);
    
    const grossSalary = basicSalary + otherAllowances + totalCustomEarnings;
    const totalDeductions = pfDeduction + otherDeduction + totalCustomDeductions;
    const netSalary = grossSalary - totalDeductions;
      
      return (
        <div className="space-y-6">
          {selectedEmployee && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-blue-900">Viewing CTC for: {selectedEmployee.employeeName}</h3>
                <p className="text-sm text-blue-700">Employee ID: {selectedEmployee.employeeId}</p>
              </div>
            </div>
          )}
            
          <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Pay Frequency</h3>
            <div className="flex flex-wrap gap-4 mb-6">
              {['Hourly', 'Daily', 'Weekly', 'Monthly', 'Custom'].map(freq => (
                <button
                  key={freq}
                  onClick={() => setPayFrequency(freq)}
                  className={`px-4 py-2 rounded-lg ${
                    payFrequency === freq 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  } transition-colors`}
                >
                  {freq}
                </button>
              ))}
            </div>
            
            {payFrequency === 'Custom' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Days</label>
                <input
                  type="number"
                  min="1"
                  value={customDays}
                  onChange={(e) => setCustomDays(parseInt(e.target.value) || 1)}
                  className="w-32 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-blue-900">Earnings</h4>
                  <button 
                    onClick={() => setShowEarningOptions(!showEarningOptions)}
                    className="p-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {showEarningOptions && (
                  <div className="bg-gray-50 p-3 rounded-md mb-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Add Earning:</h5>
                    <div className="grid grid-cols-1 gap-2">
                      {earningOptions.map(option => (
                        <button
                          key={option.id}
                          onClick={() => addCustomEarning(option)}
                          className="text-left px-3 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-sm"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {[
                  { label: 'Basic Pay', value: basicSalary },
                  { label: 'Other Allowances', value: otherAllowances },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.label}</span>
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-700">₹</span>
                      <span className="w-32 bg-gray-50 border border-gray-300 rounded-md px-3 py-1 text-gray-900">
                        {item.value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                
                {customEarnings.map(earning => (
                  <div key={earning.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-gray-700 mr-2">{earning.label}</span>
                      <button 
                        onClick={() => removeCustomEarning(earning.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-700">₹</span>
                      <input
                        type="number"
                        value={earning.value}
                        onChange={(e) => updateCustomEarning(earning.id, e.target.value)}
                        className="w-32 bg-gray-50 border border-gray-300 rounded-md px-3 py-1 text-gray-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-blue-900">Deductions</h4>
                  <button 
                    onClick={() => setShowDeductionOptions(!showDeductionOptions)}
                    className="p-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {showDeductionOptions && (
                  <div className="bg-gray-50 p-3 rounded-md mb-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Add Deduction:</h5>
                    <div className="grid grid-cols-1 gap-2">
                      {deductionOptions.map(option => (
                        <button
                          key={option.id}
                          onClick={() => addCustomDeduction(option)}
                          className="text-left px-3 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-sm"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {[
                  { label: 'PF', value: pfDeduction, key: 'pf' },
                  { label: 'Other Deductions', value: otherDeduction, key: 'other' },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center relative"
                    onMouseEnter={() => setHoveredDeduction(item.key)}
                    onMouseLeave={() => setHoveredDeduction(null)}
                  >
                    <span className="text-gray-700">{item.label}</span>
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-700">₹</span>
                      <span className="w-32 bg-gray-50 border border-gray-300 rounded-md px-3 py-1 text-gray-900">
                        {item.value.toFixed(2)}
                      </span>
                    </div>
                    
                    {hoveredDeduction === item.key && (
                      <div className="absolute top-full right-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded-md z-10 shadow-lg">
                        <div className="font-semibold">{item.label} Details</div>
                        <div>Rate: {item.key === 'pf' ? '12%' : 'As per company policy'}</div>
                        <div>Calculated on: Basic Salary</div>
                      </div>
                    )}
                  </div>
                ))}
                
                {customDeductions.map(deduction => (
                  <div key={deduction.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-gray-700 mr-2">{deduction.label}</span>
                      <button 
                        onClick={() => removeCustomDeduction(deduction.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-700">₹</span>
                      <input
                        type="number"
                        value={deduction.value}
                        onChange={(e) => updateCustomDeduction(deduction.id, e.target.value)}
                        className="w-32 bg-gray-50 border border-gray-300 rounded-md px-3 py-1 text-gray-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Gross Salary</span>
                <span className="text-blue-900 font-semibold">₹{grossSalary.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Total Deductions</span>
                <span className="text-blue-900 font-semibold">
                  ₹{totalDeductions.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold mt-2 pt-2 border-t border-gray-200">
                <span className="text-gray-900">Net Salary</span>
                <span className="text-blue-900">₹{netSalary.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      );
    };

  // Render Payslips tab
  const renderPayslips = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-900">Payslip Templates</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
          <Plus size={18} className="mr-2" />
          New Template
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(item => (
          <div key={item} className="bg-white bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg hover:border-blue-500 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-gray-900">Template {item}</h4>
              <div className="flex space-x-2">
                <button className="p-1 rounded-md hover:bg-gray-100">
                  <FileText size={16} className="text-gray-600" />
                </button>
                <button className="p-1 rounded-md hover:bg-gray-100">
                  <Download size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Last modified: 15 Aug 2023
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Salary Sheet tab with action buttons
  const renderSalarySheet = () => (
    <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
      <table className="min-w-full h-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Emp ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Basic</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Other Allowance</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Gross</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Deductions</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Net Pay</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payrollData.map((item, index) => {
            const employee = employees.find(e => e.employeeId === item.employeeId);
            const totalDeductions = item.pf + item.other;
            
            return (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.employeeId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee?.employeeName || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.basic.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.otherAllowances.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.gross.toLocaleString()}</td>
                <td 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative"
                  onMouseEnter={() => setHoveredDeduction(item.employeeId)}
                  onMouseLeave={() => setHoveredDeduction(null)}
                >
                  ₹{totalDeductions.toLocaleString()}
                  
                  {hoveredDeduction === item.employeeId && (
                    <div className="absolute top-full left-0 mt-1 p-3 bg-gray-800 text-white text-xs rounded-md z-10 shadow-lg w-48">
                      <div className="font-semibold mb-2">Deduction Breakdown</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>PF:</span>
                          <span>₹{item.pf.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Other:</span>
                          <span>₹{item.other.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-1 mt-1 flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>₹{totalDeductions.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-900">₹{item.net.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'processed' ? 'bg-green-100 text-green-800' : 
                    item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="relative group">
                    <button className="p-1 rounded-md hover:bg-gray-100">
                      <MoreVertical size={16} />
                    </button>
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 border border-gray-200">
                      <button 
                        onClick={() => handleViewCTCBreakdown(item.employeeId)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-md text-gray-700 flex items-center"
                      >
                        <Eye size={14} className="mr-2" />
                        CTC Breakdown
                      </button>
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center">
                        <FileText size={14} className="mr-2" />
                        View Payslip
                      </button>
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-md text-gray-700 flex items-center">
                        <Download size={14} className="mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Render the appropriate tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'ctc':
        return renderCTCBreakdown();
      case 'payslips':
        return renderPayslips();
      case 'salary':
        return renderSalarySheet();
      default:
        return renderCTCBreakdown();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'
        }`}>
          {notification.message}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Payroll Management</h1>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
              <Plus size={18} className="mr-2" />
              New Payroll
            </button>
            <div className="relative group">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center text-gray-700">
                <Download size={18} className="mr-2" />
                Export
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 border border-gray-200">
                <button 
                  onClick={() => handleExport('pdf')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg text-gray-700"
                >
                  Export as PDF
                </button>
                <button 
                  onClick={() => handleExport('excel')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-lg text-gray-700"
                >
                  Export as Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Row */}
        <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-gray-200 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or employee ID..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <input
                  type="month"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <div className="relative group">
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 p-4 space-y-2 border border-gray-200">
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">Department</label>
                    <select 
                      value={filters.department}
                      onChange={(e) => handleFilterChange('department', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-1 text-gray-900 text-sm"
                    >
                      <option value="">All Departments</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">Status</label>
                    <select 
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-1 text-gray-900 text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="processed">Processed</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">Employment Type</label>
                    <select 
                      value={filters.employmentType}
                      onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-1 text-gray-900 text-sm"
                    >
                      <option value="">All Types</option>
                      <option value="fulltime">Full Time</option>
                      <option value="parttime">Part Time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto -mb-px">
              {[
                { id: 'ctc', label: 'CTC Breakdown', icon: BarChart3 },
                { id: 'payslips', label: 'Payslips', icon: FileText },
                { id: 'salary', label: 'Salary Sheet', icon: CreditCard },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent size={18} className="mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="px-6 py-12 text-center">
                <p className="text-red-600">Error: {error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .text-blue-900 {
          color: #1e3a8a;
        }
        .bg-blue-600 {
          background-color: #2563eb;
        }
        .bg-blue-700 {
          background-color: #1d4ed8;
        }
        .border-blue-600 {
          border-color: #2563eb;
        }
        .text-blue-600 {
          color: #2563eb;
        }
        .focus\:ring-blue-500:focus {
          --tw-ring-color: #3b82f6;
          ring-color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default Payroll;
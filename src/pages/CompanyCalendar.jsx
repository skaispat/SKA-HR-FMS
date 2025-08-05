import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';

const CompanyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Mock company events data
  const companyEvents = [
    {
      id: 1,
      title: 'Team Meeting',
      date: '2024-01-15',
      time: '10:00 AM',
      location: 'Conference Room A',
      type: 'meeting',
      description: 'Monthly team sync and project updates'
    },
    {
      id: 2,
      title: 'Company Holiday - Republic Day',
      date: '2024-01-26',
      time: 'All Day',
      location: 'Office Closed',
      type: 'holiday',
      description: 'National Holiday - Office will be closed'
    },
    {
      id: 3,
      title: 'Training Session - React Advanced',
      date: '2024-01-20',
      time: '2:00 PM',
      location: 'Training Room',
      type: 'training',
      description: 'Advanced React concepts and best practices'
    },
    {
      id: 4,
      title: 'Performance Review',
      date: '2024-01-25',
      time: '3:00 PM',
      location: 'HR Office',
      type: 'review',
      description: 'Quarterly performance evaluation'
    }
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return companyEvents.filter(event => event.date === dateString);
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'holiday': return 'bg-red-100 text-red-800';
      case 'training': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (day) => {
    return day && 
           currentDate.getFullYear() === today.getFullYear() &&
           currentDate.getMonth() === today.getMonth() &&
           day === today.getDate();
  };

  return (
    <div className="space-y-6 page-content p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Company Calendar</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const events = getEventsForDate(day);
              return (
                <div
                  key={index}
                  className={`min-h-[80px] p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    isToday(day) ? 'bg-indigo-50 border-indigo-200' : ''
                  }`}
                  onClick={() => setSelectedDate(day)}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium ${isToday(day) ? 'text-indigo-600' : 'text-gray-900'}`}>
                        {day}
                      </div>
                      <div className="space-y-1 mt-1">
                        {events.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${getEventTypeColor(event.type)}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Calendar size={20} className="mr-2" />
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {companyEvents
                .filter(event => new Date(event.date) >= today)
                .slice(0, 5)
                .map(event => (
                  <div key={event.id} className="border-l-4 border-indigo-500 pl-3 py-2">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Clock size={14} className="mr-1" />
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-1" />
                      {event.location}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Event Types Legend */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Event Types</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Meetings</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 border border-red-200 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Holidays</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Training</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Reviews</span>
              </div>
            </div>
          </div>

          {/* Selected Date Events */}
          {selectedDate && (
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Events on {months[currentDate.getMonth()]} {selectedDate}
              </h3>
              <div className="space-y-3">
                {getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map(event => (
                    <div key={event.id} className="border rounded-lg p-3">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Clock size={14} className="mr-1" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={14} className="mr-1" />
                        {event.location}
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{event.description}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No events scheduled for this date.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCalendar;
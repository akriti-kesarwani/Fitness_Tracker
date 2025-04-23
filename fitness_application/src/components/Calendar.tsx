import React from 'react';
import './Calendar.css';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
    onDateSelect?.(newDate);
  };

  const handleMonthChange = (increment: number) => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + increment,
        1
      )
    );
  };

  const renderDays = () => {
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Render week days header
    days.push(
      <div key="weekdays" className="weekdays">
        {weekDays.map(day => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>
    );

    // Render calendar grid
    let dayCounter = 1;
    const rows = [];
    let cells = [];

    // Fill in empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="day empty" />);
    }

    // Fill in the days of the month
    while (dayCounter <= daysInMonth) {
      const isSelected = selectedDate?.getDate() === dayCounter &&
                        selectedDate?.getMonth() === currentDate.getMonth() &&
                        selectedDate?.getFullYear() === currentDate.getFullYear();

      cells.push(
        <div
          key={dayCounter}
          className={`day ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(dayCounter)}
        >
          {dayCounter}
        </div>
      );

      if ((firstDayOfMonth + dayCounter) % 7 === 0 || dayCounter === daysInMonth) {
        rows.push(
          <div key={dayCounter} className="week">
            {cells}
          </div>
        );
        cells = [];
      }

      dayCounter++;
    }

    return (
      <div className="calendar-grid">
        {days}
        {rows}
      </div>
    );
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={() => handleMonthChange(-1)}>&lt;</button>
        <h2>
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
          })}
        </h2>
        <button onClick={() => handleMonthChange(1)}>&gt;</button>
      </div>
      {renderDays()}
    </div>
  );
};

export default Calendar;
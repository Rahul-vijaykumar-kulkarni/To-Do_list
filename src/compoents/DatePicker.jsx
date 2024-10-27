import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ selectedDate, setSelectedDate }) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={date => setSelectedDate(date)}
      dateFormat="dd/MM/yyyy"
      placeholderText="Select a start date"
      className="mt-2 border rounded p-2 w-full"
    />
  );
};

export default CustomDatePicker;

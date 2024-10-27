import React, { useState } from 'react';
import DatePicker from './DatePicker';

const Recurrence = ({ recurrenceOptions, setRecurrenceOptions }) => {
    const [selectedDate, setSelectedDate] = useState(recurrenceOptions.startDate || null);
    const daysOfWeek = [
        { name: 'Sunday', value: 0 },
        { name: 'Monday', value: 1 },
        { name: 'Tuesday', value: 2 },
        { name: 'Wednesday', value: 3 },
        { name: 'Thursday', value: 4 },
        { name: 'Friday', value: 5 },
        { name: 'Saturday', value: 6 },
    ];

    const handleDayChange = (event) => {
        const { value, checked } = event.target;
        setRecurrenceOptions((prev) => {
            const selectedDays = prev.specificDays ? prev.specificDays.split(',').map(Number) : [];
            if (checked) {
                selectedDays.push(Number(value));
            } else {
                const index = selectedDays.indexOf(Number(value));
                if (index > -1) {
                    selectedDays.splice(index, 1);
                }
            }
            return { ...prev, specificDays: selectedDays.join(',') };
        });
    };

    const setStartDate = () => setRecurrenceOptions((prev) => ({ ...prev, startDate: selectedDate }));

    return (
        <div className='mt-4'>
            <h3 className='text-lg font-semibold'>Set Recurrence</h3>
            <select 
                name="type" 
                value={recurrenceOptions.type || ''} 
                onChange={(e) => setRecurrenceOptions((prev) => ({ ...prev, type: e.target.value }))} 
                className='border rounded p-2'>
                <option value="">No Recurrence</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
            </select>
            <input 
                type="number" 
                name="interval" 
                value={recurrenceOptions.interval || ''} 
                onChange={(e) => setRecurrenceOptions((prev) => ({ ...prev, interval: e.target.value }))} 
                min="1" 
                className='ml-2 w-16 p-2 border rounded' 
                placeholder="Every X"
            />
            <div className='my-2'>
                <h4 className='text-sm font-medium'>Select Specific Days:</h4>
                {daysOfWeek.map(day => (
                    <label key={day.value} className='block'>
                        <input 
                            type="checkbox" 
                            value={day.value} 
                            checked={recurrenceOptions.specificDays && recurrenceOptions.specificDays.split(',').includes(day.value.toString())} 
                            onChange={handleDayChange} 
                        />
                        {day.name}
                    </label>
                ))}
            </div>
            <input 
                type="number" 
                name="nthDay" 
                value={recurrenceOptions.nthDay || ''} 
                onChange={(e) => setRecurrenceOptions((prev) => ({ ...prev, nthDay: e.target.value }))} 
                min="1" 
                className='mt-2 w-16 p-2 border rounded' 
                placeholder="Nth Day"
            />
            <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <button 
                onClick={setStartDate} 
                className='mt-2 bg-blue-500 text-white rounded p-2'
            >
                Set Start Date
            </button>
        </div>
    );
};

export default Recurrence;

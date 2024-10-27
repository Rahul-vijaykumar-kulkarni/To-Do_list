import React, { useEffect, useRef, useState } from 'react';
import todo_icon from '../assets/todo_icon.png';
import Todoitems from './Todoitems';
import Recurrence from './Recurrence';
import { format, addDays, addMonths, addYears, isAfter, startOfToday } from 'date-fns';

const Todo = () => {
  const [todolist, setTodoList] = useState(
    localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : []
  );
  const [editingTodo, setEditingTodo] = useState(null);
  const [recurrenceOptions, setRecurrenceOptions] = useState({});
  const inputRef = useRef();

  const addTodo = () => {
    const inputtext = inputRef.current.value.trim();
    if (!inputtext) return;

    const newTodo = {
      id: Date.now(),
      text: inputtext,
      isComplete: false,
      recurrence: recurrenceOptions,
      nextOccurrence: calculateNextOccurrence(recurrenceOptions),
    };

    setTodoList((prev) => [...prev, newTodo]);
    inputRef.current.value = "";
    setRecurrenceOptions({});
  };

    //
    const calculateNextOccurrence = (recurrence) => {
        if (!recurrence.startDate || !recurrence.interval || !recurrence.type) return null;
    
        const startDate = new Date(recurrence.startDate);
        const interval = parseInt(recurrence.interval);
        let nextDate = new Date(startDate);
    
        switch (recurrence.type) {
            case "Daily":
                return format(addDays(startDate, interval), 'dd/MM/yyyy');
    
            case "Weekly":
                if (recurrence.specificDays) {
                    const daysOfWeek = recurrence.specificDays.split(',').map(Number);
                    let found = false;
    
                    while (!found) {
                        nextDate.setDate(nextDate.getDate() + 1);
                        if (daysOfWeek.includes(nextDate.getDay())) {
                            found = true;
                        }
                    }
                    return format(nextDate, 'dd/MM/yyyy');
                }
                return format(addDays(startDate, 7 * interval), 'dd/MM/yyyy');
    
            case "Monthly":
                if (recurrence.nthDay && recurrence.specificDays) {
                    const specificDays = recurrence.specificDays.split(',').map(Number);
                    let occurrences = 0;
                    let dayToFind = specificDays[0]; // You can adjust to choose the specific day based on your requirements
    
                    while (occurrences < interval) {
                        nextDate.setMonth(nextDate.getMonth() + 1);
                        nextDate.setDate(1); // Reset to first of the month
                        while (nextDate.getDay() !== dayToFind) {
                            nextDate.setDate(nextDate.getDate() + 1);
                        }
                        occurrences++;
                    }
                    return format(nextDate, 'dd/MM/yyyy');
                } else if (recurrence.nthDay) {
                    nextDate.setMonth(startDate.getMonth() + interval);
                    nextDate.setDate(1); // Set to first day of the next month
                    return format(nextDate, 'dd/MM/yyyy');
                } else {
                    return format(addMonths(startDate, interval), 'dd/MM/yyyy');
                }
    
            case "Yearly":
                return format(addYears(startDate, interval), 'dd/MM/yyyy');
    
            default:
                return null;
        }
    };
    
    
    
    //
    

  const updateTodo = () => {
    const inputtext = inputRef.current.value.trim();
    if (!inputtext || !editingTodo) return;

    setTodoList((prev) =>
      prev.map((todo) =>
        todo.id === editingTodo.id
          ? { ...todo, text: inputtext, recurrence: recurrenceOptions, nextOccurrence: calculateNextOccurrence(recurrenceOptions) }
          : todo
      )
    );

    setEditingTodo(null);
    inputRef.current.value = "";
    setRecurrenceOptions({});
  };

  const startEditing = (todo) => {
    setEditingTodo(todo);
    inputRef.current.value = todo.text;
    setRecurrenceOptions(todo.recurrence);
  };

  const deltodo = (id) => {
    setTodoList((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodoList((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo))
    );
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todolist));
  }, [todolist]);

  return (
    <div className='bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl'>
      <div className='flex items-center mt-7 gap-2'>
        <img src={todo_icon} alt="img" className='w-8' />
        <h1 className='text-3xl font-semibold'>To-Do List</h1>
      </div>
      <div className='flex items-center my-7 bg-gray-200 rounded-full'>
        <input
          ref={inputRef}
          className='bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600'
          type="text"
          placeholder='Add Your Task'
        />
        <button
          onClick={editingTodo ? updateTodo : addTodo}
          className='border-none rounded-full bg-orange-600 w-32 h-14 text-white text-large font-medium cursor-pointer'
        >
          {editingTodo ? "Update" : "Add +"}
        </button>
      </div>
      <Recurrence recurrenceOptions={recurrenceOptions} setRecurrenceOptions={setRecurrenceOptions} />
      <div>
        {todolist.map((item) => (
          <Todoitems
            key={item.id}
            text={item.text}
            id={item.id}
            isComplete={item.isComplete}
            deltodo={deltodo}
            toggleComplete={toggleComplete}
            startEditing={startEditing}
            recurrence={item.recurrence}
            nextOccurrence={item.nextOccurrence}
          />
        ))}
      </div>
    </div>
  );
};

export default Todo;

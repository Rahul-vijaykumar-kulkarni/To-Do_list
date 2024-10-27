import React from 'react';
import tick from '../assets/tick.png';
import not_tick from '../assets/not_tick.png';
import delete_icon from '../assets/delete.png';

const Todoitems = ({ text, id, isComplete, deltodo, toggleComplete, startEditing, recurrence, nextOccurrence }) => {
  return (
    <div className='flex items-center my-3 gap-2'>
      <div onClick={() => toggleComplete(id)} className='flex flex-1 items-center cursor-pointer'>
        <img src={isComplete ? tick : not_tick} alt="" className='w-7' />
        <p className={`text-slate-800 ml-4 text-[17px] decoration-slate-500 ${isComplete ? 'line-through' : ''}`}>
          {text}
        </p>
      </div>
      <button onClick={() => startEditing({ id, text, recurrence })} className='edit-button'>
        ✏️
      </button>
      <img onClick={() => deltodo(id)} src={delete_icon} alt="delete" className='w-3.5 cursor-pointer' />
      <div className='text-sm text-gray-500'>
        {recurrence?.type ? `Recurrence: ${recurrence.type}, Next: ${nextOccurrence}` : 'No Recurrence'}
      </div>
    </div>
  );
};

export default Todoitems;

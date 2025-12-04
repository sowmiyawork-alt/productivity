import React, { useState, useEffect, useCallback } from 'react';
import { Todo, TodoCategory, Priority } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import CheckIcon from './icons/CheckIcon';
import RefreshIcon from './icons/RefreshIcon';

interface AddTodoFormProps {
  addTodo: (text: string, time: string, priority: Priority) => void;
  category: TodoCategory;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ addTodo, category }) => {
  const [text, setText] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.Medium);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text.trim(), time, priority);
      setText('');
      setTime('');
      setPriority(Priority.Medium);
    }
  };
  
  const accentColor = category === TodoCategory.Personal ? 'purple' : 'blue';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <div className="flex-grow flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New task..."
          className={`flex-grow bg-slate-800 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 transition min-w-0 text-slate-100 placeholder-slate-500`}
        />
      </div>
      <div className="flex gap-2 shrink-0">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className={`bg-slate-800 border border-slate-700 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 transition text-slate-300`}
        >
          <option value={Priority.High}>High</option>
          <option value={Priority.Medium}>Medium</option>
          <option value={Priority.Low}>Low</option>
        </select>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={`bg-slate-800 border border-slate-700 rounded-md px-2 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 transition text-slate-300`}
        />
        <button
          type="submit"
          className={`bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white font-bold p-2 rounded-md transition duration-200 flex items-center justify-center w-10`}
          aria-label="Add task"
        >
          <PlusIcon />
        </button>
      </div>
    </form>
  );
};

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  category: TodoCategory;
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.High:
      return 'border-red-500 text-red-400';
    case Priority.Medium:
      return 'border-amber-500 text-amber-400';
    case Priority.Low:
      return 'border-emerald-500 text-emerald-400';
    default:
      return 'border-slate-600 text-slate-400';
  }
};

const getPriorityBg = (priority: Priority) => {
  switch (priority) {
    case Priority.High:
      return 'bg-red-500/10';
    case Priority.Medium:
      return 'bg-amber-500/10';
    case Priority.Low:
      return 'bg-emerald-500/10';
    default:
      return 'bg-slate-500/10';
  }
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleTodo, deleteTodo, category }) => {
  const accentColor = category === TodoCategory.Personal ? 'purple' : 'blue';
  const priorityClass = getPriorityColor(todo.priority || Priority.Medium);
  const priorityBg = getPriorityBg(todo.priority || Priority.Medium);

  return (
    <li className={`flex items-center justify-between bg-slate-800 p-3 rounded-lg transition-all duration-300 border-l-4 ${priorityClass.split(' ')[0]}`}>
      <div className="flex items-center gap-3 flex-grow min-w-0">
        <button
          onClick={() => toggleTodo(todo.id)}
          className={`shrink-0 w-6 h-6 rounded-full border-2 ${todo.completed ? `bg-${accentColor}-500 border-${accentColor}-500` : `border-slate-600 hover:border-${accentColor}-500`} flex items-center justify-center transition`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && <CheckIcon />}
        </button>
        <div className="flex-grow min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-0.5">
             <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${priorityBg} ${priorityClass.split(' ')[1]}`}>
              {todo.priority || 'Medium'}
            </span>
             {todo.time && (
              <span className={`text-xs font-mono text-slate-400 ${todo.completed ? 'line-through' : ''}`}>
                {todo.time}
              </span>
            )}
          </div>
          <p className={`transition truncate ${todo.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{todo.text}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-2 shrink-0">
        <button
          onClick={() => deleteTodo(todo.id)}
          className="text-slate-500 hover:text-red-500 transition p-1"
          aria-label="Delete task"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};

const TodoList: React.FC = () => {
  const [personalTodos, setPersonalTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('personalTodos');
    return saved ? JSON.parse(saved) : [];
  });
  const [professionalTodos, setProfessionalTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('professionalTodos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('personalTodos', JSON.stringify(personalTodos));
  }, [personalTodos]);

  useEffect(() => {
    localStorage.setItem('professionalTodos', JSON.stringify(professionalTodos));
  }, [professionalTodos]);

  const sortTodos = (todos: Todo[]) => {
    const priorityOrder = { [Priority.High]: 3, [Priority.Medium]: 2, [Priority.Low]: 1 };
    return [...todos].sort((a, b) => {
      const pA = priorityOrder[a.priority || Priority.Medium];
      const pB = priorityOrder[b.priority || Priority.Medium];
      return pB - pA;
    });
  };

  const addTodo = useCallback((category: TodoCategory) => (text: string, time: string, priority: Priority) => {
    const newTodo: Todo = { id: crypto.randomUUID(), text, time, priority, completed: false };
    const setTodos = category === TodoCategory.Personal ? setPersonalTodos : setProfessionalTodos;
    setTodos(prev => {
       const newList = [newTodo, ...prev];
       return sortTodos(newList);
    });
  }, []);

  const toggleTodo = useCallback((category: TodoCategory) => (id: string) => {
    const setTodos = category === TodoCategory.Personal ? setPersonalTodos : setProfessionalTodos;
    setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  }, []);

  const deleteTodo = useCallback((category: TodoCategory) => (id: string) => {
    const setTodos = category === TodoCategory.Personal ? setPersonalTodos : setProfessionalTodos;
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const resetAllTasks = useCallback(() => {
    if (window.confirm("Are you sure you want to start a new day? This will clear all current tasks.")) {
      setPersonalTodos([]);
      setProfessionalTodos([]);
    }
  }, []);
  
  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg relative">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-100">To-Do List</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={resetAllTasks}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-slate-600 hover:border-red-500 transition-colors"
            title="Clear all tasks"
          >
            <RefreshIcon className="w-3.5 h-3.5" />
            Start New Day
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal List */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-purple-400">Personal</h3>
          <AddTodoForm addTodo={addTodo(TodoCategory.Personal)} category={TodoCategory.Personal} />
          <ul className="mt-4 space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {personalTodos.length === 0 && <p className="text-slate-500 italic text-sm text-center py-4">No personal tasks yet.</p>}
            {personalTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo(TodoCategory.Personal)} deleteTodo={deleteTodo(TodoCategory.Personal)} category={TodoCategory.Personal} />
            ))}
          </ul>
        </div>

        {/* Professional List */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Professional</h3>
          <AddTodoForm addTodo={addTodo(TodoCategory.Professional)} category={TodoCategory.Professional} />
          <ul className="mt-4 space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {professionalTodos.length === 0 && <p className="text-slate-500 italic text-sm text-center py-4">No professional tasks yet.</p>}
            {professionalTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo(TodoCategory.Professional)} deleteTodo={deleteTodo(TodoCategory.Professional)} category={TodoCategory.Professional} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
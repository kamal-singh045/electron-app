import { useState, useEffect } from 'react';
import { FaPlus, FaTasks, FaCheck, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ITodoResponse } from '../api/types';
import TaskItem from '../components/tasks/TaskItem';
import CreateUpdateModal from '../components/tasks/CreateUpdateModal';

const Tasks = () => {
  const [todos, setTodos] = useState<ITodoResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTodo = async (data: { text: string; file?: File }) => {
    const response = await window.electron.createTodo({ text: data.text, image: data.file });
    if (!response.success) {
      toast.error('Failed to add task');
      throw new Error('Failed to add task');
    }

    const newTodo: ITodoResponse = {
      id: Date.now(),
      user_id: 1,
      text: data.text,
      completed: false,
      image: data.file ? URL.createObjectURL(data.file) : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTodos([newTodo, ...todos]);
    setIsModalOpen(false);
    toast.success('Task added successfully!');
  };

  const handleDeleteTodo = async (id: number) => {
    const response = await window.electron.deleteTodo(id);
    if (response.success) {
      setTodos(todos.filter(todo => todo.id !== id));
      toast.success('Task deleted successfully!');
    } else {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleComplete = async (id: number) => {
    // IPC call to toggle completion
    const response = await window.electron.updateTodo({ id, completed: true });
    if (!response.success) {
      toast.error('Failed to update task');
      throw new Error('Failed to update task');
    }
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    toast.success('Task updated successfully!');
  };

  const handleUpdateTodo = async (id: number, text: string) => {
    // IPC call to update todo
    const response = await window.electron.updateTodo({ id, text });
    if (!response.success) {
      toast.error('Failed to update task');
      throw new Error('Failed to update task');
    }
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    ));
    toast.success('Task updated successfully!');
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await window.electron.getAllTodos();
      if (response.success && response.data) {
        setTodos(response.data);
      }
    };
    fetchTodos();
  }, []);

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Tasks</h1>
        <p className="text-gray-600">Manage your tasks efficiently</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-indigo-600">{totalCount}</p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg">
              <FaTasks className="text-2xl text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedCount}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <FaCheck className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-amber-500">{totalCount - completedCount}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <FaEdit className="text-2xl text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
      >
        <FaPlus />
        <span>Add New Task</span>
      </button>

      {/* Tasks List */}
      <div className="space-y-4">
        {todos.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
            <FaTasks className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No tasks yet. Create your first task!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <TaskItem
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
            />
          ))
        )}
      </div>

      {/* Add Task Modal */}
      <CreateUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTodo}
      />
    </div>
  );
};

export default Tasks;

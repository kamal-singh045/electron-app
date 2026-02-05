import { useState } from 'react';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import { ITodoResponse } from '../../api/types';

interface TaskItemProps {
  todo: ITodoResponse;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, text: string) => void;
}

const TaskItem = ({ todo, onToggleComplete, onDelete, onUpdate }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md ${todo.completed ? 'opacity-75' : ''
        }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(todo.id)}
          className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${todo.completed
            ? 'bg-green-600 border-green-600'
            : 'border-gray-300 hover:border-indigo-600'
            }`}
          disabled={todo.completed}
        >
          {!!todo.completed && <FaCheck className="text-white text-xs" />}
        </button>

        {/* Content */}
        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
              />
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p
              className={`text-lg mb-2 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                }`}
            >
              {todo.text}
            </p>
          )}

          {todo.image && (
            <img
              src={todo.image}
              alt="Task attachment"
              className="mt-3 max-w-xs rounded-lg shadow-sm border border-gray-200"
            />
          )}

          <div className='flex items-center'>
            <p className="text-xs text-gray-400 mt-2">
              Created: {new Date(todo.created_at).toLocaleString()}
            </p>
            {todo.completed_at && <p className="text-xs text-gray-400 mt-2">
              Completed: {new Date(todo.completed_at).toLocaleString()}
            </p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit"
            >
              <FaEdit />
            </button>
          )}
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;

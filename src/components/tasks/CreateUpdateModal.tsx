import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaTimes, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Validation schema
const todoSchema = yup.object({
  text: yup.string().required('Task description is required').min(3, 'Task must be at least 3 characters'),
}).required();

interface TodoFormData {
  text: string;
}

interface CreateUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { text: string; file?: File }) => Promise<void>;
  initialData?: { id: number; text: string };
}

const CreateUpdateModal = ({ isOpen, onClose, onSubmit, initialData }: CreateUpdateModalProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TodoFormData>({
    resolver: yupResolver(todoSchema),
    defaultValues: {
      text: initialData?.text || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue('text', initialData.text);
    } else {
      reset();
    }
  }, [initialData, setValue, reset]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onFormSubmit = async (data: TodoFormData) => {
    setIsSubmitting(true);
    try {
      const file = fileInputRef.current?.files?.[0];
      await onSubmit({ text: data.text, file });
      reset();
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to save task');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Update Task' : 'Create New Task'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <FaTimes className="text-xl text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Task Input */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Task Description
            </label>
            <textarea
              {...register('text')}
              placeholder="What needs to be done?"
              className={`w-full px-4 py-3 border rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none ${errors.text ? 'border-red-500' : 'border-gray-300'
                }`}
              rows={3}
              autoFocus
            />
            {errors.text && (
              <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
            )}
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg"
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* Image Actions */}
          {!initialData && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <FaImage />
                <span>Upload Image</span>
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Task' : 'Add Task'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUpdateModal;

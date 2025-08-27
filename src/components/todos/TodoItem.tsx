import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Check, X, Edit2, Trash2, Save } from 'lucide-react';
import { TodoItem as TodoItemType, UpdateTodoRequest } from '@/types';
import { ButtonLoadingSpinner } from '@/components/ui/LoadingSpinner';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (todo: TodoItemType) => Promise<void>;
  onUpdate: (id: number, data: UpdateTodoRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

/**
 * Individual todo item component with inline editing
 */
export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTodoRequest>({
    defaultValues: {
      title: todo.title,
      isCompleted: todo.isCompleted,
    },
  });

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      await onToggle(todo);
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: UpdateTodoRequest) => {
    try {
      setIsLoading(true);
      await onUpdate(todo.id, data);
      setIsEditing(false);
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        setIsLoading(true);
        await onDelete(todo.id);
      } catch (error) {
        // Error is handled by parent component
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset({
      title: todo.title,
      isCompleted: todo.isCompleted,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card p-4 mb-3 transition-all duration-200 hover:shadow-md">
      {isEditing ? (
        // Edit Mode
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-3">
          <div>
            <input
              {...register('title', {
                required: 'Todo title is required',
                minLength: {
                  value: 1,
                  message: 'Title must not be empty',
                },
                maxLength: {
                  value: 200,
                  message: 'Title must be less than 200 characters',
                },
              })}
              type="text"
              className={`input ${errors.title ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              {...register('isCompleted')}
              type="checkbox"
              id={`completed-${todo.id}`}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              disabled={isLoading}
            />
            <label htmlFor={`completed-${todo.id}`} className="text-sm text-gray-700">
              Mark as completed
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary text-sm px-3 py-1 h-8"
            >
              {isLoading && <ButtonLoadingSpinner />}
              <Save className="w-3 h-3 mr-1" />
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isLoading}
              className="btn-secondary text-sm px-3 py-1 h-8"
            >
              <X className="w-3 h-3 mr-1" />
              Cancel
            </button>
          </div>
        </form>
      ) : (
        // View Mode
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <button
              onClick={handleToggle}
              disabled={isLoading}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                todo.isCompleted
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-gray-300 hover:border-primary-500'
              }`}
            >
              {isLoading ? (
                <div className="w-3 h-3 border border-gray-300 border-t-primary-600 rounded-full animate-spin" />
              ) : (
                todo.isCompleted && <Check className="w-3 h-3" />
              )}
            </button>
            
            <div className="flex-1">
              <h3
                className={`text-sm font-medium transition-all ${
                  todo.isCompleted
                    ? 'text-gray-500 line-through'
                    : 'text-gray-900'
                }`}
              >
                {todo.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Created {formatDate(todo.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
              title="Edit todo"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete todo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
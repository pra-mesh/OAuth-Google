import React from 'react';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { CreateTodoRequest } from '@/types';
import { ButtonLoadingSpinner } from '@/components/ui/LoadingSpinner';

interface TodoFormProps {
  onSubmit: (data: CreateTodoRequest) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Form component for creating new todos
 */
export function TodoForm({ onSubmit, isLoading = false }: TodoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTodoRequest>();

  const handleFormSubmit = async (data: CreateTodoRequest) => {
    try {
      await onSubmit(data);
      reset(); // Clear form after successful submission
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  return (
    <div className="card p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Todo</h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Todo Title
          </label>
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
            id="title"
            className={`input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Enter todo title..."
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex items-center justify-center"
        >
          {isLoading && <ButtonLoadingSpinner />}
          <Plus className="w-4 h-4 mr-2" />
          Add Todo
        </button>
      </form>
    </div>
  );
}
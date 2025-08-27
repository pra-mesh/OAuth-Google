import { useState, useEffect, useCallback } from 'react';
import { todoService } from '@/services/todoService';
import { TodoItem, CreateTodoRequest, UpdateTodoRequest } from '@/types';
import toast from 'react-hot-toast';

interface UseTodosReturn {
  todos: TodoItem[];
  isLoading: boolean;
  error: string | null;
  createTodo: (data: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: number, data: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodo: (todo: TodoItem) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

/**
 * Custom hook for managing todos
 * Provides CRUD operations with loading states and error handling
 */
export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch todos from API
   */
  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const todosData = await todoService.getTodos();
      setTodos(todosData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch todos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new todo
   */
  const createTodo = async (data: CreateTodoRequest) => {
    try {
      const newTodo = await todoService.createTodo(data);
      setTodos(prev => [newTodo, ...prev]);
      toast.success('Todo created successfully!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create todo';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Update an existing todo
   */
  const updateTodo = async (id: number, data: UpdateTodoRequest) => {
    try {
      await todoService.updateTodo(id, data);
      setTodos(prev => 
        prev.map(todo => 
          todo.id === id 
            ? { ...todo, ...data }
            : todo
        )
      );
      toast.success('Todo updated successfully!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update todo';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Delete a todo
   */
  const deleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast.success('Todo deleted successfully!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete todo';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Toggle todo completion status
   */
  const toggleTodo = async (todo: TodoItem) => {
    try {
      await todoService.toggleTodo(todo);
      setTodos(prev => 
        prev.map(t => 
          t.id === todo.id 
            ? { ...t, isCompleted: !t.isCompleted }
            : t
        )
      );
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to toggle todo';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Refresh todos
   */
  const refreshTodos = useCallback(async () => {
    await fetchTodos();
  }, [fetchTodos]);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    isLoading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refreshTodos,
  };
}
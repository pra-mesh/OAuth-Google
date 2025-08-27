import { apiService } from './api';
import { API_CONFIG } from '@/config/api';
import { TodoItem, CreateTodoRequest, UpdateTodoRequest } from '@/types';

/**
 * Todo service that handles all todo-related API calls
 */
export class TodoService {
  /**
   * Get all todos for the current user
   */
  async getTodos(): Promise<TodoItem[]> {
    const response = await apiService.get<TodoItem[]>(API_CONFIG.ENDPOINTS.TODOS);
    return response.data;
  }

  /**
   * Get a specific todo by ID
   */
  async getTodoById(id: number): Promise<TodoItem> {
    const response = await apiService.get<TodoItem>(
      API_CONFIG.ENDPOINTS.TODO_BY_ID(id)
    );
    return response.data;
  }

  /**
   * Create a new todo
   */
  async createTodo(data: CreateTodoRequest): Promise<TodoItem> {
    const response = await apiService.post<TodoItem>(
      API_CONFIG.ENDPOINTS.TODOS,
      data
    );
    return response.data;
  }

  /**
   * Update an existing todo
   */
  async updateTodo(id: number, data: UpdateTodoRequest): Promise<void> {
    await apiService.put(API_CONFIG.ENDPOINTS.TODO_BY_ID(id), data);
  }

  /**
   * Delete a todo
   */
  async deleteTodo(id: number): Promise<void> {
    await apiService.delete(API_CONFIG.ENDPOINTS.TODO_BY_ID(id));
  }

  /**
   * Toggle todo completion status
   */
  async toggleTodo(todo: TodoItem): Promise<void> {
    const updateData: UpdateTodoRequest = {
      title: todo.title,
      isCompleted: !todo.isCompleted,
    };
    await this.updateTodo(todo.id, updateData);
  }
}

// Export singleton instance
export const todoService = new TodoService();
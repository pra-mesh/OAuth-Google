import React, { useState } from 'react';
import { Search, Filter, CheckCircle, Circle, Clock } from 'lucide-react';
import { TodoItem as TodoItemType } from '@/types';
import { TodoItem } from './TodoItem';
import { TodoListSkeleton } from '@/components/ui/SkeletonLoader';

interface TodoListProps {
  todos: TodoItemType[];
  isLoading: boolean;
  onToggle: (todo: TodoItemType) => Promise<void>;
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

type FilterType = 'all' | 'active' | 'completed';

/**
 * Todo list component with filtering and search functionality
 */
export function TodoList({ todos, isLoading, onToggle, onUpdate, onDelete }: TodoListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Filter and search todos
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'active' && !todo.isCompleted) ||
      (filter === 'completed' && todo.isCompleted);
    
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.isCompleted).length;
  const activeTodos = totalTodos - completedTodos;

  if (isLoading) {
    return <TodoListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalTodos}</p>
              <p className="text-sm text-gray-600">Total Todos</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <Circle className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeTodos}</p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{completedTodos}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search todos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="input w-auto"
            >
              <option value="all">All Todos</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div>
        {filteredTodos.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-gray-400 mb-4">
              <CheckCircle className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filter !== 'all' ? 'No todos found' : 'No todos yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first todo to get started!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
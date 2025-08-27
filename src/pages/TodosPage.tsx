import React from 'react';
import { Header } from '@/components/layout/Header';
import { TodoForm } from '@/components/todos/TodoForm';
import { TodoList } from '@/components/todos/TodoList';
import { useTodos } from '@/hooks/useTodos';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

/**
 * Main todos page component
 */
export function TodosPage() {
  const {
    todos,
    isLoading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  } = useTodos();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Todos</h1>
            <p className="text-gray-600 mt-2">
              Organize your tasks and stay productive
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="card p-4 mb-6 bg-red-50 border-red-200">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Todo Form */}
          <TodoForm onSubmit={createTodo} />

          {/* Todo List */}
          <TodoList
            todos={todos}
            isLoading={isLoading}
            onToggle={toggleTodo}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}
import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
}

/**
 * Basic skeleton loader component
 */
export function SkeletonLoader({ className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

/**
 * Todo item skeleton loader
 */
export function TodoItemSkeleton() {
  return (
    <div className="card p-4 mb-3">
      <div className="flex items-center space-x-3">
        <SkeletonLoader className="w-5 h-5 rounded" />
        <div className="flex-1">
          <SkeletonLoader className="h-4 w-3/4 mb-2" />
          <SkeletonLoader className="h-3 w-1/2" />
        </div>
        <SkeletonLoader className="w-8 h-8 rounded" />
      </div>
    </div>
  );
}

/**
 * Todo list skeleton loader
 */
export function TodoListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <TodoItemSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Card skeleton loader
 */
export function CardSkeleton() {
  return (
    <div className="card p-6">
      <SkeletonLoader className="h-6 w-1/3 mb-4" />
      <SkeletonLoader className="h-4 w-full mb-2" />
      <SkeletonLoader className="h-4 w-2/3 mb-4" />
      <SkeletonLoader className="h-10 w-1/4" />
    </div>
  );
}
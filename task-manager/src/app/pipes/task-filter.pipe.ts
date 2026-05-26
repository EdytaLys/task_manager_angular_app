import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskStatus, TaskPriority } from '../models/task.model';
import { getPriorityOrder } from '../utils/status-helpers';

export interface TaskFilters {
  text: string;
  status: TaskStatus | 'ALL';
  priority: TaskPriority | 'ALL';
  tag: string;
  sortBy: 'createdAt' | 'dueDate' | 'status' | 'priority';
}

@Pipe({ name: 'taskFilter', standalone: true, pure: false })
export class TaskFilterPipe implements PipeTransform {
  transform(tasks: Task[], filters: TaskFilters): Task[] {
    let result = [...tasks];

    if (filters.text.trim()) {
      const lower = filters.text.toLowerCase();
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(lower) ||
          t.description?.toLowerCase().includes(lower) ||
          (t.tags ?? []).some(tag => tag.toLowerCase().includes(lower))
      );
    }

    if (filters.status !== 'ALL') {
      result = result.filter(t => t.status === filters.status);
    }

    if (filters.priority !== 'ALL') {
      result = result.filter(t => t.priority === filters.priority);
    }

    if (filters.tag) {
      result = result.filter(t => (t.tags ?? []).includes(filters.tag));
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'priority':
          return getPriorityOrder(a.priority) - getPriorityOrder(b.priority);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'dueDate': {
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return aDate - bDate;
        }
        default: {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        }
      }
    });

    return result;
  }
}

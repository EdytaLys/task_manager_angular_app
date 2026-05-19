import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskStatus, TaskPriority } from '../models/task.model';

export interface StatusCounts {
  TODO: number;
  IN_PROGRESS: number;
  DONE: number;
}

export interface PriorityCounts {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private _tasks = signal<Task[]>([]);

  readonly totalCount = computed(() => this._tasks().length);

  readonly byStatus = computed<StatusCounts>(() => {
    const tasks = this._tasks();
    return {
      TODO: tasks.filter(t => t.status === 'TODO').length,
      IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      DONE: tasks.filter(t => t.status === 'DONE').length,
    };
  });

  readonly byPriority = computed<PriorityCounts>(() => {
    const tasks = this._tasks();
    return {
      LOW: tasks.filter(t => t.priority === 'LOW').length,
      MEDIUM: tasks.filter(t => t.priority === 'MEDIUM').length,
      HIGH: tasks.filter(t => t.priority === 'HIGH').length,
    };
  });

  readonly completionRate = computed(() => {
    const total = this._tasks().length;
    if (total === 0) return 0;
    return Math.round((this.byStatus().DONE / total) * 100);
  });

  readonly overdueTasks = computed(() => {
    const now = new Date();
    return this._tasks().filter(t => {
      if (!t.dueDate || t.status === 'DONE') return false;
      return new Date(t.dueDate) < now;
    });
  });

  readonly highPriorityInProgress = computed(() =>
    this._tasks().filter(t => t.priority === 'HIGH' && t.status === 'IN_PROGRESS')
  );

  readonly allTags = computed(() => {
    const tagSet = new Set<string>();
    this._tasks().forEach(t => (t.tags ?? []).forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  });

  setTasks(tasks: Task[]): void {
    this._tasks.set(tasks);
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFilterPipe, TaskFilters } from '../../pipes/task-filter.pipe';
import { PRIORITY_OPTIONS } from '../../constants/app.constants';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent, TaskFilterPipe],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Output() showDetails = new EventEmitter<Task>();

  priorityOptions = PRIORITY_OPTIONS;

  filters: TaskFilters = {
    text: '',
    status: 'ALL',
    priority: 'ALL',
    tag: '',
    sortBy: 'createdAt',
  };

  get allTags(): string[] {
    const tagSet = new Set<string>();
    this.tasks.forEach(t => (t.tags ?? []).forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }

  onStatusFilterChange(value: string): void {
    this.filters = { ...this.filters, status: value as TaskStatus | 'ALL' };
  }

  onPriorityFilterChange(value: string): void {
    this.filters = { ...this.filters, priority: value as TaskPriority | 'ALL' };
  }

  clearFilters(): void {
    this.filters = { text: '', status: 'ALL', priority: 'ALL', tag: '', sortBy: 'createdAt' };
  }
}

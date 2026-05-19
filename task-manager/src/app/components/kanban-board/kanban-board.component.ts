import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../../models/task.model';
import { getStatusClass, getPriorityClass } from '../../utils/status-helpers';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { HighlightPriorityDirective } from '../../directives/highlight-priority.directive';

interface Column { status: TaskStatus; label: string; color: string; }

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, StatusLabelPipe, HighlightPriorityDirective],
  templateUrl: './kanban-board.component.html',
})
export class KanbanBoardComponent {
  @Input() tasks: Task[] = [];
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<{ taskId: number; newStatus: TaskStatus }>();
  @Output() showDetails = new EventEmitter<Task>();

  draggedTask: Task | null = null;

  columns: Column[] = [
    { status: 'TODO', label: 'To Do', color: '#ffc107' },
    { status: 'IN_PROGRESS', label: 'In Progress', color: '#2196f3' },
    { status: 'DONE', label: 'Done', color: '#4caf50' },
  ];

  getPriorityClass = getPriorityClass;
  getStatusClass = getStatusClass;

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(t => t.status === status);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === 'DONE') return false;
    return new Date(task.dueDate) < new Date();
  }

  onDragStart(task: Task): void {
    this.draggedTask = task;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(status: TaskStatus): void {
    if (this.draggedTask && this.draggedTask.id != null && this.draggedTask.status !== status) {
      this.statusChange.emit({ taskId: this.draggedTask.id, newStatus: status });
    }
    this.draggedTask = null;
  }

  onEdit(event: MouseEvent, task: Task): void {
    event.stopPropagation();
    this.edit.emit(task);
  }

  onDelete(event: MouseEvent, task: Task): void {
    event.stopPropagation();
    if (task.id != null) this.delete.emit(task.id);
  }
}

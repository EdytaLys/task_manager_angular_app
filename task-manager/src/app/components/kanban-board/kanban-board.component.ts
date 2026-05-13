import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../../models/task.model';

interface Column { status: TaskStatus; label: string; color: string; }

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule],
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

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(t => t.status === status);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }

  onDragStart(task: Task) {
    this.draggedTask = task;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(status: TaskStatus) {
    if (this.draggedTask && this.draggedTask.id != null && this.draggedTask.status !== status) {
      this.statusChange.emit({ taskId: this.draggedTask.id, newStatus: status });
    }
    this.draggedTask = null;
  }

  onEdit(event: MouseEvent, task: Task) {
    event.stopPropagation();
    this.edit.emit(task);
  }

  onDelete(event: MouseEvent, task: Task) {
    event.stopPropagation();
    if (task.id != null) this.delete.emit(task.id);
  }
}

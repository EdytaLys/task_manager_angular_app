import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { getStatusLabel, getStatusClass } from '../../utils/status-helpers';

@Component({
  selector: 'app-task-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-details-modal.component.html',
})
export class TaskDetailsModalComponent {
  @Input() task!: Task;
  @Output() closed = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();

  getStatusLabel = getStatusLabel;
  getStatusClass = getStatusClass;

  formatDate(dateString?: string): string {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatDateTime(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) this.closed.emit();
  }

  onEdit() {
    this.edit.emit(this.task);
    this.closed.emit();
  }

  onDelete() {
    if (this.task.id === undefined) return;
    this.delete.emit(this.task.id);
    this.closed.emit();
  }
}

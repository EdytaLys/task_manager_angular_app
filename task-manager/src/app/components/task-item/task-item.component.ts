import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { getStatusLabel, getStatusClass } from '../../utils/status-helpers';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Output() showDetails = new EventEmitter<Task>();

  getStatusLabel = getStatusLabel;
  getStatusClass = getStatusClass;

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }

  onEdit(event: MouseEvent) {
    event.stopPropagation();
    this.edit.emit(this.task);
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    if (this.task.id != null) this.delete.emit(this.task.id);
  }
}

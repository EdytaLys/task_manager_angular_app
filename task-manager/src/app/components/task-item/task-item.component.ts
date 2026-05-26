import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { getStatusClass, getPriorityClass } from '../../utils/status-helpers';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { HighlightPriorityDirective } from '../../directives/highlight-priority.directive';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, StatusLabelPipe, HighlightPriorityDirective],
  templateUrl: './task-item.component.html',
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Output() showDetails = new EventEmitter<Task>();

  getStatusClass = getStatusClass;
  getPriorityClass = getPriorityClass;

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }

  isOverdue(): boolean {
    if (!this.task.dueDate || this.task.status === 'DONE') return false;
    return new Date(this.task.dueDate) < new Date();
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit(this.task);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    if (this.task.id != null) this.delete.emit(this.task.id);
  }
}

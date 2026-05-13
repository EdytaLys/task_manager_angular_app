import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './task-form-modal.component.html',
})
export class TaskFormModalComponent {
  @Input() isOpen = false;
  @Input() initialTask?: Task;
  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>();

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }

  onSubmit(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    this.submitted.emit(task);
    this.closed.emit();
  }
}

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../../models/task.model';

interface ValidationErrors {
  title?: string;
  description?: string;
  status?: string;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent implements OnInit {
  @Input() initialTask?: Task;
  @Output() submitted = new EventEmitter<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>();
  @Output() cancelled = new EventEmitter<void>();

  title = '';
  description = '';
  status: TaskStatus = 'TODO';
  dueDate = '';
  errors: ValidationErrors = {};
  touched: Record<string, boolean> = {};

  ngOnInit() {
    if (this.initialTask) {
      this.title = this.initialTask.title;
      this.description = this.initialTask.description;
      this.status = this.initialTask.status;
      this.dueDate = this.formatDateForInput(this.initialTask.dueDate);
    }
  }

  get todayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  private formatDateForInput(isoDate?: string): string {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
  }

  private validateField(field: string, value: string): string | undefined {
    switch (field) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.length > 100) return 'Title must not exceed 100 characters';
        break;
      case 'description':
        if (value && value.length > 500) return 'Description must not exceed 500 characters';
        break;
      case 'status':
        if (!value) return 'Status is required';
        break;
    }
    return undefined;
  }

  onBlur(field: string) {
    this.touched[field] = true;
    const value = field === 'title' ? this.title : field === 'description' ? this.description : this.status;
    this.errors = { ...this.errors, [field]: this.validateField(field, value) };
  }

  onTitleChange(value: string) {
    this.title = value;
    this.errors = { ...this.errors, title: this.validateField('title', value) };
    if (value.length > 0) this.touched['title'] = true;
  }

  onDescriptionChange(value: string) {
    this.description = value;
    this.errors = { ...this.errors, description: this.validateField('description', value) };
    if (value.length > 0) this.touched['description'] = true;
  }

  onSubmit() {
    this.errors = {
      title: this.validateField('title', this.title),
      description: this.validateField('description', this.description),
      status: this.validateField('status', this.status),
    };
    this.touched = { title: true, description: true, status: true, dueDate: true };

    if (Object.values(this.errors).some(e => e)) return;

    const dueDateInstant = this.dueDate ? new Date(this.dueDate).toISOString() : undefined;
    this.submitted.emit({ title: this.title, description: this.description, status: this.status, dueDate: dueDateInstant });

    if (!this.initialTask) {
      this.title = '';
      this.description = '';
      this.status = 'TODO';
      this.dueDate = '';
      this.errors = {};
      this.touched = {};
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}

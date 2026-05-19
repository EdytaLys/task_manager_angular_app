import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { PreferencesService } from '../../services/preferences.service';
import { AutofocusDirective } from '../../directives/autofocus.directive';
import { PRIORITY_OPTIONS, MAX_TAGS_PER_TASK } from '../../constants/app.constants';

function maxLengthTrimmed(max: number) {
  return (control: AbstractControl) =>
    control.value?.trim().length > max ? { maxLengthTrimmed: { max } } : null;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AutofocusDirective],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent implements OnInit {
  @Input() initialTask?: Task;
  @Output() submitted = new EventEmitter<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>();
  @Output() cancelled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private prefsService = inject(PreferencesService);

  priorityOptions = PRIORITY_OPTIONS;
  maxTags = MAX_TAGS_PER_TASK;
  newTagInput = '';
  tagError = '';

  form!: FormGroup;

  get title() { return this.form.get('title')!; }
  get description() { return this.form.get('description')!; }
  get status() { return this.form.get('status')!; }
  get priority() { return this.form.get('priority')!; }
  get dueDate() { return this.form.get('dueDate')!; }
  get tags() { return this.form.get('tags') as FormArray; }

  get todayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const defaultPriority = this.prefsService.defaultPriority();
    this.form = this.fb.group({
      title: [
        this.initialTask?.title ?? '',
        [Validators.required, maxLengthTrimmed(100)],
      ],
      description: [
        this.initialTask?.description ?? '',
        [maxLengthTrimmed(500)],
      ],
      status: [this.initialTask?.status ?? 'TODO', Validators.required],
      priority: [this.initialTask?.priority ?? defaultPriority, Validators.required],
      dueDate: [this.formatDateForInput(this.initialTask?.dueDate)],
      tags: this.fb.array(
        (this.initialTask?.tags ?? []).map(tag => this.fb.control(tag))
      ),
    });
  }

  private formatDateForInput(isoDate?: string): string {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
  }

  addTag(): void {
    const tag = this.newTagInput.trim();
    this.tagError = '';
    if (!tag) return;
    if (this.tags.length >= this.maxTags) {
      this.tagError = `Maximum ${this.maxTags} tags allowed`;
      return;
    }
    if ((this.tags.value as string[]).includes(tag)) {
      this.tagError = 'Tag already added';
      return;
    }
    this.tags.push(this.fb.control(tag));
    this.newTagInput = '';
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  onTagInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { title, description, status, priority, dueDate, tags } = this.form.value;
    const dueDateInstant = dueDate ? new Date(dueDate).toISOString() : undefined;

    this.submitted.emit({
      title: title.trim(),
      description: description?.trim() ?? '',
      status: status as TaskStatus,
      priority: priority as TaskPriority,
      tags: tags as string[],
      dueDate: dueDateInstant,
    });

    if (!this.initialTask) {
      this.form.reset({
        title: '',
        description: '',
        status: 'TODO',
        priority: this.prefsService.defaultPriority(),
        dueDate: '',
      });
      while (this.tags.length) this.tags.removeAt(0);
      this.newTagInput = '';
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}

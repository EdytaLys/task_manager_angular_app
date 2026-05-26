import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { StatsService } from '../../services/stats.service';
import { PreferencesService } from '../../services/preferences.service';
import { TaskListComponent } from '../task-list/task-list.component';
import { KanbanBoardComponent } from '../kanban-board/kanban-board.component';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';
import { TaskDetailsModalComponent } from '../task-details-modal/task-details-modal.component';
import { MESSAGE_DISMISS_TIMEOUT } from '../../constants/app.constants';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    TaskListComponent,
    KanbanBoardComponent,
    TaskFormModalComponent,
    TaskDetailsModalComponent,
  ],
  templateUrl: './tasks-page.component.html',
})
export class TasksPageComponent implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  private statsService = inject(StatsService);
  readonly prefsService = inject(PreferencesService);

  tasks: Task[] = [];
  editingTask: Task | null = null;
  selectedTask: Task | null = null;
  isFormModalOpen = false;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  private errorTimer?: ReturnType<typeof setTimeout>;
  private successTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.loadTasks();
  }

  ngOnDestroy(): void {
    clearTimeout(this.errorTimer);
    clearTimeout(this.successTimer);
  }

  private setError(msg: string): void {
    clearTimeout(this.errorTimer);
    this.error = msg;
    this.errorTimer = setTimeout(() => (this.error = null), MESSAGE_DISMISS_TIMEOUT);
  }

  private setSuccess(msg: string): void {
    clearTimeout(this.successTimer);
    this.successMessage = msg;
    this.successTimer = setTimeout(() => (this.successMessage = null), MESSAGE_DISMISS_TIMEOUT);
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getAllTasks().subscribe({
      next: ({ tasks }) => {
        this.tasks = tasks;
        this.statsService.setTasks(tasks);
        this.loading = false;
      },
      error: err => {
        this.setError(err.message || 'Failed to load tasks.');
        this.loading = false;
      },
    });
  }

  handleFormSubmit(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (this.editingTask) {
      if (!this.editingTask.id) return;
      this.taskService.updateTask(this.editingTask.id, task).subscribe({
        next: ({ message }) => { this.setSuccess(message); this.editingTask = null; this.loadTasks(); },
        error: err => this.setError(err.message || 'Failed to update task'),
      });
    } else {
      this.taskService.createTask(task).subscribe({
        next: ({ message }) => { this.setSuccess(message); this.loadTasks(); },
        error: err => this.setError(err.message || 'Failed to create task'),
      });
    }
  }

  handleDeleteTask(id: number): void {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    this.taskService.deleteTask(id).subscribe({
      next: ({ message }) => { this.setSuccess(message); this.loadTasks(); },
      error: err => this.setError(err.message || 'Failed to delete task'),
    });
  }

  handleStatusChange(event: { taskId: number; newStatus: TaskStatus }): void {
    const task = this.tasks.find(t => t.id === event.taskId);
    if (!task) return;
    this.taskService.updateTask(event.taskId, { ...task, status: event.newStatus }).subscribe({
      next: () => { this.setSuccess(`Status updated`); this.loadTasks(); },
      error: err => this.setError(err.message || 'Failed to update status'),
    });
  }

  openCreateModal(): void {
    this.editingTask = null;
    this.isFormModalOpen = true;
  }

  openEditModal(task: Task): void {
    this.editingTask = task;
    this.isFormModalOpen = true;
    this.selectedTask = null;
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.editingTask = null;
  }

  setViewMode(mode: 'list' | 'kanban'): void {
    this.prefsService.setViewMode(mode);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from './models/task.model';
import { TaskService } from './services/task.service';
import { TaskFormModalComponent } from './components/task-form-modal/task-form-modal.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';
import { TaskDetailsModalComponent } from './components/task-details-modal/task-details-modal.component';
import { MESSAGE_DISMISS_TIMEOUT } from './constants/app.constants';

type ViewMode = 'list' | 'kanban';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskFormModalComponent, TaskListComponent, KanbanBoardComponent, TaskDetailsModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  tasks: Task[] = [];
  editingTask: Task | null = null;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  viewMode: ViewMode = 'kanban';
  selectedTask: Task | null = null;
  isFormModalOpen = false;

  private errorTimer?: ReturnType<typeof setTimeout>;
  private successTimer?: ReturnType<typeof setTimeout>;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  ngOnDestroy() {
    clearTimeout(this.errorTimer);
    clearTimeout(this.successTimer);
  }

  private setError(msg: string) {
    clearTimeout(this.errorTimer);
    this.error = msg;
    this.errorTimer = setTimeout(() => (this.error = null), MESSAGE_DISMISS_TIMEOUT);
  }

  private setSuccess(msg: string) {
    clearTimeout(this.successTimer);
    this.successMessage = msg;
    this.successTimer = setTimeout(() => (this.successMessage = null), MESSAGE_DISMISS_TIMEOUT);
  }

  loadTasks() {
    this.loading = true;
    this.error = null;
    this.taskService.getAllTasks().subscribe({
      next: ({ tasks }) => { this.tasks = tasks; this.loading = false; },
      error: (err) => { this.setError(err.message || 'Failed to load tasks. Make sure the backend is running.'); this.loading = false; },
    });
  }

  handleCreateTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    this.taskService.createTask(task).subscribe({
      next: ({ message }) => { this.setSuccess(message); this.loadTasks(); },
      error: (err) => this.setError(err.message || 'Failed to create task'),
    });
  }

  handleUpdateTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!this.editingTask?.id) return;
    this.taskService.updateTask(this.editingTask.id, task).subscribe({
      next: ({ message }) => { this.setSuccess(message); this.editingTask = null; this.loadTasks(); },
      error: (err) => this.setError(err.message || 'Failed to update task'),
    });
  }

  handleFormSubmit(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    if (this.editingTask) {
      this.handleUpdateTask(task);
    } else {
      this.handleCreateTask(task);
    }
  }

  handleDeleteTask(id: number) {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    this.taskService.deleteTask(id).subscribe({
      next: ({ message }) => { this.setSuccess(message); this.loadTasks(); },
      error: (err) => this.setError(err.message || 'Failed to delete task'),
    });
  }

  handleStatusChange(event: { taskId: number; newStatus: TaskStatus }) {
    const task = this.tasks.find(t => t.id === event.taskId);
    if (!task) return;
    this.taskService.updateTask(event.taskId, { ...task, status: event.newStatus }).subscribe({
      next: () => { this.setSuccess(`Task status updated to ${event.newStatus.replace('_', ' ')}`); this.loadTasks(); },
      error: (err) => this.setError(err.message || 'Failed to update task status'),
    });
  }

  openCreateModal() {
    this.editingTask = null;
    this.isFormModalOpen = true;
  }

  openEditModal(task: Task) {
    this.editingTask = task;
    this.isFormModalOpen = true;
    this.selectedTask = null;
  }

  closeFormModal() {
    this.isFormModalOpen = false;
    this.editingTask = null;
  }
}

import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

type SortOption = 'status' | 'dueDate' | 'createdAt';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnChanges {
  @Input() tasks: Task[] = [];
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Output() showDetails = new EventEmitter<Task>();

  sortBy: SortOption = 'createdAt';
  filterText = '';
  filteredTasks: Task[] = [];

  ngOnChanges() {
    this.updateFilteredTasks();
  }

  updateFilteredTasks() {
    let result = [...this.tasks];
    if (this.filterText.trim()) {
      result = result.filter(t => t.title.toLowerCase().includes(this.filterText.toLowerCase()));
    }
    result.sort((a, b) => {
      switch (this.sortBy) {
        case 'status': return a.status.localeCompare(b.status);
        case 'dueDate': {
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return aDate - bDate;
        }
        default: {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        }
      }
    });
    this.filteredTasks = result;
  }
}

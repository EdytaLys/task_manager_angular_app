import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsService } from '../../services/stats.service';
import { TaskService } from '../../services/task.service';
import { getPriorityClass } from '../../utils/status-helpers';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusLabelPipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private statsService = inject(StatsService);
  private taskService = inject(TaskService);

  loading = false;

  readonly totalCount = this.statsService.totalCount;
  readonly byStatus = this.statsService.byStatus;
  readonly byPriority = this.statsService.byPriority;
  readonly completionRate = this.statsService.completionRate;
  readonly overdueTasks = this.statsService.overdueTasks;
  readonly highPriorityInProgress = this.statsService.highPriorityInProgress;
  readonly allTags = this.statsService.allTags;

  getPriorityClass = getPriorityClass;

  ngOnInit(): void {
    this.loading = true;
    this.taskService.getAllTasks().subscribe({
      next: ({ tasks }) => {
        this.statsService.setTasks(tasks);
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }
}

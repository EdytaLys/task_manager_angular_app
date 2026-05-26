export function getStatusLabel(status: string): string {
  switch (status) {
    case 'TODO': return 'To Do';
    case 'IN_PROGRESS': return 'In Progress';
    case 'DONE': return 'Done';
    default: return status;
  }
}

export function getStatusClass(status: string): string {
  switch (status) {
    case 'TODO': return 'status-todo';
    case 'IN_PROGRESS': return 'status-in-progress';
    case 'DONE': return 'status-done';
    default: return '';
  }
}

export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'LOW': return 'Low';
    case 'MEDIUM': return 'Medium';
    case 'HIGH': return 'High';
    default: return priority;
  }
}

export function getPriorityClass(priority: string): string {
  switch (priority) {
    case 'LOW': return 'priority-low';
    case 'MEDIUM': return 'priority-medium';
    case 'HIGH': return 'priority-high';
    default: return '';
  }
}

export function getPriorityOrder(priority: string): number {
  switch (priority) {
    case 'HIGH': return 0;
    case 'MEDIUM': return 1;
    case 'LOW': return 2;
    default: return 3;
  }
}

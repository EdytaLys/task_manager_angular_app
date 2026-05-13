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

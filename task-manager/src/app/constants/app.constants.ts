import { TaskPriority } from '../models/task.model';

export const MESSAGE_DISMISS_TIMEOUT = 5000;

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

export const LOCAL_STORAGE_KEYS = {
  VIEW_MODE: 'task-manager-view-mode',
  THEME: 'task-manager-theme',
  DEFAULT_PRIORITY: 'task-manager-default-priority',
} as const;

export const MAX_TAGS_PER_TASK = 5;

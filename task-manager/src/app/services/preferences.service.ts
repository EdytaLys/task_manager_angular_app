import { Injectable, signal, computed } from '@angular/core';
import { TaskPriority } from '../models/task.model';
import { LOCAL_STORAGE_KEYS } from '../constants/app.constants';

export type ViewMode = 'list' | 'kanban';
export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private _viewMode = signal<ViewMode>(
    (localStorage.getItem(LOCAL_STORAGE_KEYS.VIEW_MODE) as ViewMode) ?? 'kanban'
  );
  private _theme = signal<Theme>(
    (localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as Theme) ?? 'light'
  );
  private _defaultPriority = signal<TaskPriority>(
    (localStorage.getItem(LOCAL_STORAGE_KEYS.DEFAULT_PRIORITY) as TaskPriority) ?? 'MEDIUM'
  );

  readonly viewMode = this._viewMode.asReadonly();
  readonly theme = this._theme.asReadonly();
  readonly defaultPriority = this._defaultPriority.asReadonly();

  readonly isDarkTheme = computed(() => this._theme() === 'dark');

  setViewMode(mode: ViewMode): void {
    this._viewMode.set(mode);
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIEW_MODE, mode);
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
    document.body.setAttribute('data-theme', theme);
  }

  setDefaultPriority(priority: TaskPriority): void {
    this._defaultPriority.set(priority);
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEFAULT_PRIORITY, priority);
  }

  applyStoredTheme(): void {
    document.body.setAttribute('data-theme', this._theme());
  }
}

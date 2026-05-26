import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreferencesService, ViewMode, Theme } from '../../services/preferences.service';
import { HasUnsavedChanges } from '../../guards/unsaved-changes.guard';
import { TaskPriority } from '../../models/task.model';
import { PRIORITY_OPTIONS } from '../../constants/app.constants';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements HasUnsavedChanges {
  private prefsService = inject(PreferencesService);

  priorityOptions = PRIORITY_OPTIONS;

  viewMode = signal<ViewMode>(this.prefsService.viewMode());
  theme = signal<Theme>(this.prefsService.theme());
  defaultPriority = signal<TaskPriority>(this.prefsService.defaultPriority());

  saved = false;

  hasUnsavedChanges(): boolean {
    return (
      this.viewMode() !== this.prefsService.viewMode() ||
      this.theme() !== this.prefsService.theme() ||
      this.defaultPriority() !== this.prefsService.defaultPriority()
    );
  }

  onViewModeChange(mode: string): void {
    this.viewMode.set(mode as ViewMode);
    this.saved = false;
  }

  onThemeChange(theme: string): void {
    this.theme.set(theme as Theme);
    this.saved = false;
  }

  onDefaultPriorityChange(priority: string): void {
    this.defaultPriority.set(priority as TaskPriority);
    this.saved = false;
  }

  saveSettings(): void {
    this.prefsService.setViewMode(this.viewMode());
    this.prefsService.setTheme(this.theme());
    this.prefsService.setDefaultPriority(this.defaultPriority());
    this.saved = true;
  }

  resetToDefaults(): void {
    this.viewMode.set('kanban');
    this.theme.set('light');
    this.defaultPriority.set('MEDIUM');
    this.saved = false;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { getStatusLabel, getPriorityLabel } from '../utils/status-helpers';

@Pipe({ name: 'statusLabel', standalone: true, pure: true })
export class StatusLabelPipe implements PipeTransform {
  transform(value: string, type: 'status' | 'priority' = 'status'): string {
    return type === 'priority' ? getPriorityLabel(value) : getStatusLabel(value);
  }
}

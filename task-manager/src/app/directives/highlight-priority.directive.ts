import { Directive, Input, OnChanges, ElementRef, Renderer2 } from '@angular/core';
import { TaskPriority } from '../models/task.model';

@Directive({ selector: '[appHighlightPriority]', standalone: true })
export class HighlightPriorityDirective implements OnChanges {
  @Input('appHighlightPriority') priority!: TaskPriority;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.renderer.removeStyle(this.el.nativeElement, 'border-left');
    if (this.priority === 'HIGH') {
      this.renderer.setStyle(this.el.nativeElement, 'border-left', '4px solid #dc3545');
    } else if (this.priority === 'MEDIUM') {
      this.renderer.setStyle(this.el.nativeElement, 'border-left', '4px solid #ffc107');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'border-left', '4px solid #28a745');
    }
  }
}

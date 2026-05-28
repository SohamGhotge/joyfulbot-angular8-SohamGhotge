import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 8px rgba(0,123,255,0.6)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'box-shadow 0.3s ease');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
  }
}

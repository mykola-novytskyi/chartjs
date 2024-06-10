import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding, inject,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  QueryList
} from '@angular/core';

@Directive({
  selector: '[iaTabSelected]',
  standalone: true,
})
export class TabSelectedDirective implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) selectedTabIndex!: number;
  @Input({ required: true }) parentElement!: Element;
  @Input({ required: true }) tabsElements?: QueryList<ElementRef> | undefined;

  @HostBinding('style.transform') private chipTransform?: string;
  @HostBinding('style.width.px') tabWidth!: number;

  #cdr = inject(ChangeDetectorRef);

  #resizeObserver?: ResizeObserver;

  ngOnInit(): void {
    if (window.ResizeObserver) {
      this.#resizeObserver = new ResizeObserver(() => {
        this.#calculateStyles();
      });
      this.#resizeObserver.observe(this.parentElement);
    }
  }

  ngOnChanges(): void {
    this.#calculateStyles();
  }

  ngOnDestroy(): void {
    this.#resizeObserver?.unobserve(this.parentElement);
    this.#resizeObserver?.disconnect();
  }

  #calculateStyles(): void {
    this.chipTransform = `translateX(${this.tabsElements?.reduce(
      (sum, element, index) => (index < this.selectedTabIndex ? sum + element.nativeElement.clientWidth : sum),
      0,
    )}px)`;
    this.tabWidth = this.tabsElements?.get(this.selectedTabIndex)?.nativeElement.clientWidth;
    this.#cdr.detectChanges();
  }
}

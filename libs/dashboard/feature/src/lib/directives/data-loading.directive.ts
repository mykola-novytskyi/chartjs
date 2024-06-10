import {
  ComponentRef,
  Directive,
  ElementRef,
  HostBinding,
  inject,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Directive({
  selector: '[iaSpinner]',
  standalone: true,
})
export class DataLoadingDirective implements OnChanges {
  @Input('iaSpinner') loading = false;
  @Input() spinnerDiameter = 75;

  @HostBinding('class') hostClass = 'relative';

  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);
  readonly #viewContainerRef = inject(ViewContainerRef);
  readonly #loadingContainer: HTMLDivElement;
  readonly #progressElement: HTMLDivElement;
  readonly #matProgress: ComponentRef<MatProgressSpinner>;

  constructor() {
    this.#loadingContainer = this.#renderer.createElement('div');
    this.#loadingContainer.classList.add(
      'flex',
      'items-center',
      'justify-center',
      'absolute',
      'top-0',
      'w-full',
      'h-full',
      'pointer-events-none',
    );
    this.#matProgress = this.#viewContainerRef.createComponent<MatProgressSpinner>(MatProgressSpinner);
    this.#matProgress.instance.mode = 'indeterminate';
    this.#matProgress.instance.diameter = this.spinnerDiameter;
    this.#progressElement = this.#matProgress.injector.get(MatProgressSpinner)._elementRef
      .nativeElement as HTMLDivElement;
  }

  ngOnChanges({ loading, spinnerDiameter }: SimpleChanges): void {
    if (loading) {
      if (this.loading) {
        this.#renderer.appendChild(this.#elementRef.nativeElement, this.#loadingContainer);
        this.#renderer.appendChild(this.#loadingContainer, this.#progressElement);
      } else {
        this.#renderer.removeChild(this.#loadingContainer, this.#progressElement);
        this.#renderer.removeChild(this.#elementRef.nativeElement, this.#loadingContainer);
      }
    }
    if (spinnerDiameter) {
      this.#matProgress.instance.diameter = this.spinnerDiameter;
    }
  }
}

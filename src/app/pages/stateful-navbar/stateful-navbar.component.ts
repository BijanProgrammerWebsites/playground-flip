import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
    selector: 'app-stateful-navbar',
    templateUrl: './stateful-navbar.component.html',
    styleUrls: ['./stateful-navbar.component.scss'],
})
export class StatefulNavbarComponent implements AfterViewInit {
    public readonly ANIMATION_DURATION: number = 500;
    public readonly ANIMATION_EASING: string = 'ease-in-out';
    private readonly INDICATOR_PADDING_INLINE: number = 2;

    @ViewChild('nav') private nav!: ElementRef<HTMLElement>;

    private isPlaying: boolean = false;

    public constructor(private changeDetectorRef: ChangeDetectorRef) {}

    public ngAfterViewInit(): void {
        const referenceElement: HTMLElement = this.nav.nativeElement.querySelector('.active')!;
        this.updateIndicatorSizeAndPosition(referenceElement);
    }

    public async navigationClickHandler(e: MouseEvent): Promise<void> {
        if (this.isPlaying) return;

        const willBeInactiveElement: HTMLElement = this.nav.nativeElement.querySelector('.active')!;
        const willBeActiveElement = (e.target as HTMLElement).closest('li')!;
        if (willBeInactiveElement === willBeActiveElement) return;

        this.isPlaying = true;

        await this.flip(willBeInactiveElement, () => {
            willBeInactiveElement.className = 'will-be-inactive';
        });

        await this.flip(willBeActiveElement, () => {
            willBeInactiveElement.className = '';
            willBeActiveElement.className = 'active';
        });

        this.isPlaying = false;
    }

    private updateIndicatorSizeAndPosition(referenceElement: HTMLElement): void {
        const indicator: HTMLElement = this.nav.nativeElement.querySelector('.indicator')!;

        const navBoundingRect = this.nav.nativeElement.getBoundingClientRect();
        const referenceDomRect = referenceElement.getBoundingClientRect();

        const top = referenceDomRect.top - navBoundingRect.top;
        const left = referenceDomRect.left - navBoundingRect.left;

        const htmlFontSize = +getComputedStyle(document.documentElement).fontSize.replace('px', '');
        const paddingInline = this.INDICATOR_PADDING_INLINE * htmlFontSize;

        const before: HTMLElement = indicator.querySelector('.before')!;
        before.style.top = `${top}px`;
        before.style.left = `${left - paddingInline / 2}px`;
        before.style.width = `${paddingInline}.px`;
        before.style.height = `${referenceDomRect.height}px`;

        const after: HTMLElement = indicator.querySelector('.after')!;
        after.style.top = `${top}px`;
        after.style.left = `${left - paddingInline / 2 + referenceDomRect.width}px`;
        after.style.width = `${paddingInline}.px`;
        after.style.height = `${referenceDomRect.height}px`;

        const middle: HTMLElement = indicator.querySelector('.middle')!;
        middle.style.top = `${top}px`;
        middle.style.left = `${left}px`;
        middle.style.width = `${referenceDomRect.width}px`;
        middle.style.height = `${referenceDomRect.height}px`;
    }

    private async flip(referenceElement: HTMLElement, callback: Function): Promise<void> {
        const first = [
            ...this.getItemBoundingClientRects(),
            ...this.getIndicatorBoundingClientRect(),
            this.getSelectorBoundingClientRect('.background'),
        ];

        callback();
        this.changeDetectorRef.detectChanges();
        this.updateIndicatorSizeAndPosition(referenceElement);
        this.changeDetectorRef.detectChanges();

        const last = [
            ...this.getItemBoundingClientRects(),
            ...this.getIndicatorBoundingClientRect(),
            this.getSelectorBoundingClientRect('.background'),
        ];

        await this.play(first, last);
    }

    private async play(
        first: {element: HTMLElement; domRect: DOMRect}[],
        last: {element: HTMLElement; domRect: DOMRect}[]
    ): Promise<void> {
        const promises: Promise<void>[] = [];

        const invert: {element: HTMLElement; x: number; y: number; scaleX: number; scaleY: number}[] = [];
        for (let i = 0; i < first.length; i++) {
            invert.push({
                element: first[i].element,
                x: first[i].domRect.left - last[i].domRect.left,
                y: first[i].domRect.top - last[i].domRect.top,
                scaleX: first[i].domRect.width / (last[i].domRect.width || 1),
                scaleY: first[i].domRect.height / last[i].domRect.height,
            });
        }

        invert.forEach((item) => {
            const translate = `translate(${item.x}px, ${item.y}px)`;
            const scale = item.element.className === 'text' ? 'scale(1)' : `scale(${item.scaleX}, ${item.scaleY})`;
            const transform = `${translate} ${scale}`;

            const animation = item.element.animate([{transform}, {transform: 'translate(0) scale(1)'}], {
                duration: this.ANIMATION_DURATION,
                easing: this.ANIMATION_EASING,
            });

            promises.push(
                new Promise((resolve) => {
                    animation.addEventListener('finish', () => resolve());
                })
            );
        });

        await Promise.all(promises);
    }

    private getItemBoundingClientRects(): {element: HTMLElement; domRect: DOMRect}[] {
        const result: {element: HTMLElement; domRect: DOMRect}[] = [];

        const items = Array.from(this.nav.nativeElement.querySelectorAll('li'));
        items.forEach((item) => {
            const icon: HTMLElement = item.querySelector('.icon')!;
            const text: HTMLElement = item.querySelector('.text')!;

            result.push({element: icon, domRect: icon.getBoundingClientRect()});
            result.push({element: text, domRect: text.getBoundingClientRect()});
        });

        return result;
    }

    private getIndicatorBoundingClientRect(): {element: HTMLElement; domRect: DOMRect}[] {
        const indicator: HTMLElement = this.nav.nativeElement.querySelector('.indicator')!;
        const before: HTMLElement = indicator.querySelector('.before')!;
        const middle: HTMLElement = indicator.querySelector('.middle')!;
        const after: HTMLElement = indicator.querySelector('.after')!;

        const beforeDomRect = before.getBoundingClientRect();
        const afterDomRect = after.getBoundingClientRect();
        const middleDomRect = middle.getBoundingClientRect();

        const result: {element: HTMLElement; domRect: DOMRect}[] = [];

        result.push({
            element: before,
            domRect: beforeDomRect,
        });

        result.push({
            element: middle,
            domRect: middleDomRect,
        });

        result.push({
            element: after,
            domRect: afterDomRect,
        });

        return result;
    }

    private getSelectorBoundingClientRect(selector: string): {element: HTMLElement; domRect: DOMRect} {
        const element: HTMLElement = this.nav.nativeElement.querySelector(selector)!;
        const domRect = element.getBoundingClientRect();
        return {element, domRect};
    }
}

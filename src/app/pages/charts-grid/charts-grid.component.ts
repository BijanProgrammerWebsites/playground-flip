import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
    selector: 'app-charts-grid',
    templateUrl: './charts-grid.component.html',
    styleUrls: ['./charts-grid.component.scss'],
})
export class ChartsGridComponent {
    private readonly ANIMATION_DURATION: number = 300;
    private readonly ANIMATION_EASING: string = 'ease-in-out';

    @ViewChild('body') private body!: ElementRef<HTMLElement>;

    private isPlaying: boolean = false;
    private endedTransitionsCount: number = 0;

    public constructor(private changeDetectorRef: ChangeDetectorRef) {}

    public chartClickHandler(className: string): void {
        this.flip(() => {
            const body = this.body.nativeElement;
            if (body.classList.contains(className)) body.className = 'body';
            else body.className = `body ${className}`;
        });
    }

    private flip(callback: Function): void {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.endedTransitionsCount = 0;

        const first = this.generateDomRects();

        callback();
        this.changeDetectorRef.detectChanges();

        const last = this.generateDomRects();

        this.play(first, last);
    }

    private play(first: {[key: string]: DOMRect}, last: {[key: string]: DOMRect}): void {
        const invert: {[key: string]: {x: number; y: number; scaleX: number; scaleY: number}} = {};

        for (const key of Object.keys(first)) {
            invert[key] = {
                x: first[key].left - last[key].left,
                y: first[key].top - last[key].top,
                scaleX: first[key].width / last[key].width,
                scaleY: first[key].height / last[key].height,
            };
        }

        const elements = this.chartElements();
        elements.forEach((element) => {
            const key = element.className;

            const translate = `translate(${invert[key].x}px, ${invert[key].y}px)`;
            const scale = `scale(${invert[key].scaleX}, ${invert[key].scaleY})`;
            const transform = `${translate} ${scale}`;

            const animation = element.animate([{transform}, {transform: 'translate(0) scale(1)'}], {
                duration: this.ANIMATION_DURATION,
                easing: this.ANIMATION_EASING,
            });

            animation.addEventListener('finish', this.transitionEnd.bind(this));
        });
    }

    private generateDomRects(): {[key: string]: DOMRect} {
        const elements = this.chartElements();

        const result: {[key: string]: DOMRect} = {};
        elements.forEach((element) => {
            result[element.className] = element.getBoundingClientRect();
        });

        return result;
    }

    private transitionEnd(): void {
        this.endedTransitionsCount++;
        if (this.endedTransitionsCount === 6) this.isPlaying = false;
    }

    private chartElements(): HTMLElement[] {
        return Array.from(this.body.nativeElement.querySelectorAll('.charts > div'));
    }
}

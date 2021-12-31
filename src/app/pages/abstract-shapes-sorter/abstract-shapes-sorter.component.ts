import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';

interface Shape {
    variant: number;
    color: number;
    value: number;
}

enum ShapeVariant {
    SQUARE,
    DIAMOND,
    CIRCLE,
}

enum ShapeColor {
    RED,
    ORANGE,
    YELLOW,
    GREEN,
    BLUE,
    PURPLE,
}

@Component({
    selector: 'app-abstract-shapes-sorter',
    templateUrl: './abstract-shapes-sorter.component.html',
    styleUrls: ['./abstract-shapes-sorter.component.scss'],
})
export class AbstractShapesSorterComponent {
    public ShapeVariant = ShapeVariant;
    public ShapeColor = ShapeColor;

    private readonly SHAPES_COUNT: number = 50;
    private readonly ANIMATION_DURATION: number = 1000;
    private readonly ANIMATION_EASING: string = 'cubic-bezier(0.7, -0.4, 0.3, 1.4)';

    @ViewChild('body') private body!: ElementRef<HTMLElement>;

    public shapes!: Shape[];

    private isPlaying: boolean = false;
    private endedTransitionsCount: number = 0;

    public constructor(private changeDetectorRef: ChangeDetectorRef) {
        this.initShapes();
    }

    public valueButtonClickHandler(): void {
        this.flip(() => {
            this.shapes.sort((a, b) => a.value - b.value);
        });
    }

    public shapeButtonClickHandler(): void {
        this.flip(() => {
            this.shapes.sort((a, b) => +a.variant - +b.variant);
        });
    }

    public colorButtonClickHandler(): void {
        this.flip(() => {
            this.shapes.sort((a, b) => +a.color - +b.color);
        });
    }

    public randomButtonClickHandler(): void {
        this.flip(() => {
            this.shapes.sort(() => Math.random() - 0.5);
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

    private generateRandomIndex(length: number = this.SHAPES_COUNT): number {
        return Math.floor(Math.random() * length);
    }

    private initShapes(): void {
        this.shapes = [];

        for (let i = 0; i < this.SHAPES_COUNT; i++) {
            const variant = this.generateRandomIndex(3);
            const color = this.generateRandomIndex(6);

            this.shapes.push({variant, color, value: i + 1});
        }
    }

    private play(first: {[key: number]: DOMRect}, last: {[key: number]: DOMRect}): void {
        const invert: {[key: number]: {x: number; y: number}} = [];
        for (let i = 1; i <= this.SHAPES_COUNT; i++) {
            invert[i] = {
                x: first[i].left - last[i].left,
                y: first[i].top - last[i].top,
            };
        }

        const elements = this.shapeElements();
        elements.forEach((element, i) => {
            const {value} = this.shapes[i];

            const animation = element.animate(
                [{transform: `translate(${invert[value].x}px, ${invert[value].y}px)`}, {transform: 'translate(0)'}],
                {
                    duration: this.ANIMATION_DURATION,
                    easing: this.ANIMATION_EASING,
                }
            );

            animation.addEventListener('finish', this.transitionEnd.bind(this));
        });
    }

    private generateDomRects(): {[key: number]: DOMRect} {
        const elements = this.shapeElements();

        const result: {[key: number]: DOMRect} = {};
        elements.forEach((element, i) => {
            result[this.shapes[i].value] = element.getBoundingClientRect();
        });

        return result;
    }

    private transitionEnd(): void {
        this.endedTransitionsCount++;
        if (this.endedTransitionsCount === this.SHAPES_COUNT) this.isPlaying = false;
    }

    private shapeElements(): HTMLElement[] {
        return Array.from(this.body.nativeElement.querySelectorAll('.shape'));
    }
}

import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';

interface Shape {
    variant: ShapeVariant;
    color: ShapeColor;
    value: number;
}

enum ShapeVariant {
    SQUARE,
    CIRCLE,
}

enum ShapeColor {
    RED,
    ORANGE,
    YELLOW,
    GREEN,
    CYAN,
    BLUE,
    PURPLE,
}

@Component({
    selector: 'app-abstract-shapes-sorter',
    templateUrl: './abstract-shapes-sorter.component.html',
    styleUrls: ['./abstract-shapes-sorter.component.scss'],
})
export class AbstractShapesSorterComponent {
    private static readonly SHAPES_COUNT: number = 50;
    private static readonly ANIMATION_DURATION: number = 1000;
    private static readonly EASING: string = 'cubic-bezier(0.68, -0.55, 0.27, 1.55)';

    @ViewChild('body') private body!: ElementRef<HTMLElement>;

    public shapes!: Shape[];

    public constructor(private changeDetectorRef: ChangeDetectorRef) {
        this.initShapes();
    }

    public randomButtonClickHandler(): void {
        const first = this.getBoundingClientRects();

        this.randomizeShapes();
        this.changeDetectorRef.detectChanges();

        const last = this.getBoundingClientRects();

        this.play(first, last);
    }

    private static generateRandomIndex(length: number = AbstractShapesSorterComponent.SHAPES_COUNT): number {
        return Math.floor(Math.random() * length);
    }

    private initShapes(): void {
        this.shapes = [];

        for (let i = 0; i < AbstractShapesSorterComponent.SHAPES_COUNT; i++) {
            const variant = Object.values(ShapeVariant)[
                AbstractShapesSorterComponent.generateRandomIndex(2)
            ] as ShapeVariant;
            const color = Object.values(ShapeColor)[AbstractShapesSorterComponent.generateRandomIndex(7)] as ShapeColor;

            this.shapes.push({variant, color, value: i + 1});
        }
    }

    private play(first: {[key: number]: DOMRect}, last: {[key: number]: DOMRect}): void {
        const invert: {[key: number]: {x: number; y: number}} = [];
        for (let i = 1; i <= AbstractShapesSorterComponent.SHAPES_COUNT; i++) {
            invert[i] = {
                x: first[i].left - last[i].left,
                y: first[i].top - last[i].top,
            };
        }

        const elements = this.shapeElements();
        elements.forEach((element, i) => {
            const {value} = this.shapes[i];

            element.animate(
                [{transform: `translate(${invert[value].x}px, ${invert[value].y}px)`}, {transform: 'translate(0)'}],
                {
                    duration: AbstractShapesSorterComponent.ANIMATION_DURATION,
                    easing: AbstractShapesSorterComponent.EASING,
                }
            );
        });
    }

    private getBoundingClientRects(): {[key: number]: DOMRect} {
        const elements = this.shapeElements();

        const result: {[key: number]: DOMRect} = {};
        elements.forEach((element, i) => {
            result[this.shapes[i].value] = element.getBoundingClientRect();
        });

        return result;
    }

    private randomizeShapes(): void {
        for (let i = 0; i < 100; i++) {
            const firstIndex = AbstractShapesSorterComponent.generateRandomIndex();
            const secondIndex = AbstractShapesSorterComponent.generateRandomIndex();

            const temp = this.shapes[firstIndex];
            this.shapes[firstIndex] = this.shapes[secondIndex];
            this.shapes[secondIndex] = temp;
        }
    }

    private shapeElements(): HTMLElement[] {
        return Array.from(this.body.nativeElement.querySelectorAll('.shape'));
    }
}

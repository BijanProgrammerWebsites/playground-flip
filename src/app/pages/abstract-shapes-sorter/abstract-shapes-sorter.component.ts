import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {FlipService} from '../../services/flip.service';

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

    @ViewChild('body') private body!: ElementRef<HTMLElement>;

    public shapes!: Shape[];

    private isPlaying: boolean = false;

    public constructor(private changeDetectorRef: ChangeDetectorRef) {
        this.initShapes();
    }

    public async valueButtonClickHandler(): Promise<void> {
        await this.flip(() => {
            this.shapes.sort((a, b) => a.value - b.value);
        });
    }

    public async shapeButtonClickHandler(): Promise<void> {
        await this.flip(() => {
            this.shapes.sort((a, b) => +a.variant - +b.variant);
        });
    }

    public async colorButtonClickHandler(): Promise<void> {
        await this.flip(() => {
            this.shapes.sort((a, b) => +a.color - +b.color);
        });
    }

    public async randomButtonClickHandler(): Promise<void> {
        await this.flip(() => {
            this.shapes.sort(() => Math.random() - 0.5);
        });
    }

    private async flip(callback: Function): Promise<void> {
        if (this.isPlaying) return;
        this.isPlaying = true;

        const generateDomRects = this.generateDomRects.bind(this);
        await FlipService.flip(
            generateDomRects,
            generateDomRects,
            () => {
                callback();
                this.changeDetectorRef.detectChanges();
            },
            {
                duration: this.ANIMATION_DURATION,
            }
        );

        this.isPlaying = false;
    }

    private generateDomRects(): Map<HTMLElement, DOMRect> {
        const result = new Map<HTMLElement, DOMRect>();

        const elements: HTMLElement[] = Array.from(this.body.nativeElement.querySelectorAll('.shape'));
        elements.forEach((element) => {
            result.set(element, element.getBoundingClientRect());
        });

        return result;
    }

    private initShapes(): void {
        this.shapes = [];

        for (let i = 0; i < this.SHAPES_COUNT; i++) {
            const variant = this.generateRandomIndex(3);
            const color = this.generateRandomIndex(6);

            this.shapes.push({variant, color, value: i + 1});
        }
    }

    private generateRandomIndex(length: number = this.SHAPES_COUNT): number {
        return Math.floor(Math.random() * length);
    }
}

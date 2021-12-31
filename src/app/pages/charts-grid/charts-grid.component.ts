import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {FlipService} from '../../services/flip.service';

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

    public constructor(private changeDetectorRef: ChangeDetectorRef) {}

    public async chartClickHandler(className: string): Promise<void> {
        if (this.isPlaying) return;
        this.isPlaying = true;

        const generateDomRects = this.generateDomRects.bind(this);
        await FlipService.flip(
            generateDomRects,
            generateDomRects,
            () => {
                const body = this.body.nativeElement;
                if (body.classList.contains(className)) body.className = 'body';
                else body.className = `body ${className}`;

                this.changeDetectorRef.detectChanges();
            },
            {
                duration: this.ANIMATION_DURATION,
                easing: this.ANIMATION_EASING,
            }
        );

        this.isPlaying = false;
    }

    private generateDomRects(): Map<HTMLElement, DOMRect> {
        const result = new Map<HTMLElement, DOMRect>();

        const elements: HTMLElement[] = Array.from(this.body.nativeElement.querySelectorAll('.charts > div'));
        elements.forEach((element) => {
            result.set(element, element.getBoundingClientRect());
        });

        return result;
    }
}

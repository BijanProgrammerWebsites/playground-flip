import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {FlipService} from '../../services/flip.service';

@Component({
    selector: 'app-abstract-stacking-cards',
    templateUrl: './abstract-stacking-cards.component.html',
    styleUrls: ['./abstract-stacking-cards.component.scss'],
})
export class AbstractStackingCardsComponent {
    @ViewChild('container') private container!: ElementRef<HTMLElement>;
    @ViewChild('background') private background!: ElementRef<HTMLElement>;
    @ViewChild('cards') private cards!: ElementRef<HTMLElement>;

    private isPlaying: boolean = false;

    public constructor(private changeDetectorRef: ChangeDetectorRef) {}

    public async containerClickHandler(): Promise<void> {
        if (this.isPlaying) return;
        this.isPlaying = true;

        const generateDomRects = this.generateDomRects.bind(this);
        await FlipService.flip(generateDomRects, generateDomRects, () => {
            this.container.nativeElement.classList.toggle('container--stacked');
            this.changeDetectorRef.detectChanges();
        });

        this.isPlaying = false;
    }

    private generateDomRects(): Map<HTMLElement, DOMRect> {
        const result = new Map<HTMLElement, DOMRect>();
        result.set(this.background.nativeElement, this.background.nativeElement.getBoundingClientRect());

        const cards: HTMLElement[] = Array.from(this.cards.nativeElement.querySelectorAll('.card'));
        cards.forEach((card) => {
            result.set(card, card.getBoundingClientRect());
        });

        return result;
    }
}

import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
    selector: 'app-duolingo-word-puzzle',
    templateUrl: './duolingo-word-puzzle.component.html',
    styleUrls: ['./duolingo-word-puzzle.component.scss'],
})
export class DuolingoWordPuzzleComponent {
    private static readonly ANIMATION_DURATION: number = 500;
    private static readonly EASING: string = 'ease-in-out';

    @ViewChild('top') private top!: ElementRef<HTMLElement>;
    @ViewChild('bottom') private bottom!: ElementRef<HTMLElement>;

    public topWords: {id: number; content: string; isVisible: boolean}[] = [];
    public words: {id: number; content: string; isVisible: boolean}[] = [
        {id: 0, content: 'Hello', isVisible: true},
        {id: 1, content: ',', isVisible: true},
        {id: 2, content: 'friend', isVisible: true},
        {id: 3, content: '!', isVisible: true},
    ];

    private isPlaying: boolean = false;

    public constructor(private changeDetectorRef: ChangeDetectorRef) {}

    public buttonClickHandler(e: MouseEvent): void {
        this.flip(e.target as HTMLElement);
    }

    private flip(element: HTMLElement): void {
        // if (this.isPlaying) return;
        this.isPlaying = true;

        const first = element.getBoundingClientRect();

        const duplicateElement = this.move(element);
        this.changeDetectorRef.detectChanges();

        const last = duplicateElement.getBoundingClientRect();

        this.play(duplicateElement, first, last);
    }

    private move(element: HTMLElement): HTMLElement {
        const {id} = element.dataset;
        const word = this.words.find((x) => x.id === +id!)!;

        if (word.isVisible) {
            word.isVisible = false;
            this.topWords.push(word);

            this.changeDetectorRef.detectChanges();
            return this.top.nativeElement.querySelector(`[data-id="${id}"]`)! as HTMLElement;
        }

        word.isVisible = true;
        this.topWords.splice(
            this.topWords.findIndex((x) => x.id === word.id),
            1
        );

        this.changeDetectorRef.detectChanges();
        return this.bottom.nativeElement.querySelector(`[data-id="${id}"]`)! as HTMLElement;
    }

    private play(element: HTMLElement, first: DOMRect, last: DOMRect): void {
        const x = first.left - last.left;
        const y = first.top - last.top;

        const animation = element.animate([{transform: `translate(${x}px, ${y}px)`}, {transform: 'translate(0)'}], {
            duration: DuolingoWordPuzzleComponent.ANIMATION_DURATION,
            easing: DuolingoWordPuzzleComponent.EASING,
        });

        animation.addEventListener('finish', () => (this.isPlaying = false));
    }
}

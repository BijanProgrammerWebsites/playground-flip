import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
    selector: 'app-duolingo-word-puzzle',
    templateUrl: './duolingo-word-puzzle.component.html',
    styleUrls: ['./duolingo-word-puzzle.component.scss'],
})
export class DuolingoWordPuzzleComponent {
    private readonly ANIMATION_DURATION: number = 250;
    private readonly EASING: string = 'ease-in-out';

    @ViewChild('top') private top!: ElementRef<HTMLElement>;
    @ViewChild('bottom') private bottom!: ElementRef<HTMLElement>;

    public topWords: {id: number; content: string; isVisible: boolean}[] = [];
    public words: {id: number; content: string; isVisible: boolean}[] = [];

    private isPlaying: boolean = false;
    private endedTransitionsCount: number = 0;

    public constructor(private changeDetectorRef: ChangeDetectorRef) {
        const words = 'Hello, friend! My name is Bijan and I am a programmer.'.split(' ').map((x, i) => ({
            id: i,
            content: x,
            isVisible: true,
        }));
        words.sort(() => Math.random() - 0.5);

        this.words = words;
    }

    public buttonClickHandler(e: MouseEvent): void {
        this.flip(e.target as HTMLElement);
    }

    private flip(element: HTMLElement): void {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.endedTransitionsCount = 0;

        const {domRects: first} = this.getBoundingClientRects(element);

        const duplicateElement = this.move(element);
        this.changeDetectorRef.detectChanges();

        const {domRects: last, buttons} = this.getBoundingClientRects(duplicateElement);

        const elements = [duplicateElement, ...buttons];
        this.play(elements, first, last);
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

    private play(elements: HTMLElement[], first: DOMRect[], last: DOMRect[]): void {
        const invert: {x: number; y: number}[] = [];
        for (let i = 0; i < first.length; i++)
            invert.push({x: first[i].left - last[i].left, y: first[i].top - last[i].top});

        elements.forEach((element, i) => {
            const animation = element.animate(
                [{transform: `translate(${invert[i].x}px, ${invert[i].y}px)`}, {transform: 'translate(0)'}],
                {
                    duration: this.ANIMATION_DURATION,
                    easing: this.EASING,
                }
            );

            animation.addEventListener('finish', () => this.transitionEnd(elements.length));
        });
    }

    private getBoundingClientRects(element: HTMLElement): {domRects: DOMRect[]; buttons: HTMLElement[]} {
        const buttons = Array.from(this.top.nativeElement.querySelectorAll('button'));
        const buttonsExceptElement = buttons.filter((x) => x.innerText !== element.innerText);

        const domRects: DOMRect[] = [element.getBoundingClientRect()];
        domRects.push(...buttonsExceptElement.map((x) => x.getBoundingClientRect()));

        return {domRects, buttons: buttonsExceptElement};
    }

    private transitionEnd(totalCount: number): void {
        this.endedTransitionsCount++;
        if (this.endedTransitionsCount === totalCount) this.isPlaying = false;
    }
}

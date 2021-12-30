import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
    selector: 'app-abstract-fullscreen-post',
    templateUrl: './abstract-fullscreen-post.component.html',
    styleUrls: ['./abstract-fullscreen-post.component.scss'],
})
export class AbstractFullscreenPostComponent {
    public readonly ANIMATION_DURATION: number = 500;
    public readonly ANIMATION_EASING: string = 'ease-in-out';

    @ViewChild('post') private post!: ElementRef<HTMLElement>;
    @ViewChild('background') private background!: ElementRef<HTMLElement>;
    @ViewChild('content') private content!: ElementRef<HTMLElement>;

    private isPlaying: boolean = false;

    public constructor(private changeDetectorRef: ChangeDetectorRef) {}

    public async postClickHandler(): Promise<void> {
        if (this.isPlaying) return;

        this.isPlaying = true;

        await this.fadeContent(1, 0);
        await this.flip();
        await this.fadeContent(0, 1);

        this.isPlaying = false;
    }

    private async fadeContent(startOpacity: number, endOpacity: number): Promise<void> {
        const animation = this.content.nativeElement.animate([{opacity: startOpacity}, {opacity: endOpacity}], {
            duration: this.ANIMATION_DURATION,
            easing: this.ANIMATION_EASING,
            fill: 'forwards',
        });

        await new Promise<void>((resolve) => {
            animation.addEventListener('finish', () => resolve());
        });
    }

    private async flip(): Promise<void> {
        const first = this.post.nativeElement.getBoundingClientRect();

        this.post.nativeElement.classList.toggle('post--fullscreen');
        this.changeDetectorRef.detectChanges();

        const last = this.post.nativeElement.getBoundingClientRect();

        await this.play(first, last);
    }

    private async play(first: DOMRect, last: DOMRect): Promise<void> {
        const invert = {
            x: first.left - last.left,
            y: first.top - last.top,
            scaleX: first.width / last.width,
            scaleY: first.height / last.height,
        };

        const translate = `translate(${invert.x}px, ${invert.y}px)`;
        const scale = `scale(${invert.scaleX}, ${invert.scaleY})`;
        const transform = `${translate} ${scale}`;

        const animation = this.post.nativeElement.animate([{transform}, {transform: 'translate(0) scale(1)'}], {
            duration: this.ANIMATION_DURATION,
            easing: this.ANIMATION_EASING,
        });

        await new Promise<void>((resolve) => {
            animation.addEventListener('finish', () => resolve());
        });
    }
}

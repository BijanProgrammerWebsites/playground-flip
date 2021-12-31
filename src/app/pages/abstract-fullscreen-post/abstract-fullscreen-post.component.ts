import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {FlipService} from '../../services/flip.service';

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

        const generateDomRects = this.generateDomRects.bind(this);
        await FlipService.flip(
            generateDomRects,
            generateDomRects,
            () => {
                this.post.nativeElement.classList.toggle('post--fullscreen');
                this.changeDetectorRef.detectChanges();
            },
            {
                easing: this.ANIMATION_EASING,
            }
        );

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

    private generateDomRects(): Map<HTMLElement, DOMRect> {
        return new Map<HTMLElement, DOMRect>([
            [this.post.nativeElement, this.post.nativeElement.getBoundingClientRect()],
        ]);
    }
}

import {ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {FlipService} from '../../services/flip.service';
import {TILE_OR_LIST_VIEW_ITEMS} from './data/tile-or-list-view-items';

@Component({
    selector: 'app-tile-or-list-view',
    templateUrl: './tile-or-list-view.component.html',
    styleUrls: ['./tile-or-list-view.component.scss'],
})
export class TileOrListViewComponent {
    public TILE_OR_LIST_VIEW_ITEMS = TILE_OR_LIST_VIEW_ITEMS;

    private readonly ANIMATION_DURATION: number = 1000;
    private readonly ANIMATION_EASING: string = 'ease-in-out';

    @ViewChild('grid') private grid!: ElementRef<HTMLElement>;

    public isInTileView: boolean = true;
    public isScreenSmall: boolean = window.innerWidth < 600;

    private isPlaying: boolean = false;

    public constructor(private changeDetectorRef: ChangeDetectorRef) {}

    @HostListener('window:resize')
    private windowResizeHandler(): void {
        this.isScreenSmall = window.innerWidth < 600;
    }

    public async toggleViewButtonClickHandler(): Promise<void> {
        if (this.isPlaying || this.isScreenSmall) return;
        this.isPlaying = true;

        const generateDomRects = this.generateDomRects.bind(this);
        await FlipService.flip(
            generateDomRects,
            generateDomRects,
            () => {
                this.isInTileView = !this.isInTileView;
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

        const selectors = 'img, .info .background, .info .label, .info .value';
        const elements: HTMLElement[] = Array.from(this.grid.nativeElement.querySelectorAll(selectors));
        elements.forEach((element) => {
            result.set(element, element.getBoundingClientRect());
        });

        return result;
    }
}

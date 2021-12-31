import {Component} from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    public demos: {title: string; link: string}[] = [
        {title: 'Abstract Shapes Sorter', link: 'abstract-shapes-sorter'},
        {title: 'Duolingo Word puzzle', link: 'duolingo-word-puzzle'},
        {title: 'Charts Grid', link: 'charts-grid'},
        {title: 'Stateful Navbar', link: 'stateful-navbar'},
        {title: 'Abstract Fullscreen Post', link: 'abstract-fullscreen-post'},
        {title: 'Abstract Stacking Cards', link: 'abstract-stacking-cards'},
        {title: 'Tile or List View', link: 'tile-or-list-view'},
    ];
}

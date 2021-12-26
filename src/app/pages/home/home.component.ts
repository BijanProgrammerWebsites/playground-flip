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
    ];
}

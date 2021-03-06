import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeComponent} from './home/home.component';

import {ComponentsModule} from '../components/components.module';
import {PipesModule} from '../pipes/pipes.module';
import {RouterModule} from '@angular/router';
import {AbstractShapesSorterComponent} from './abstract-shapes-sorter/abstract-shapes-sorter.component';
import {DuolingoWordPuzzleComponent} from './duolingo-word-puzzle/duolingo-word-puzzle.component';
import {ChartsGridComponent} from './charts-grid/charts-grid.component';
import {StatefulNavbarComponent} from './stateful-navbar/stateful-navbar.component';
import {IconsModule} from '../icons/icons.module';
import {AbstractFullscreenPostComponent} from './abstract-fullscreen-post/abstract-fullscreen-post.component';
import {AbstractStackingCardsComponent} from './abstract-stacking-cards/abstract-stacking-cards.component';
import {TileOrListViewComponent} from './tile-or-list-view/tile-or-list-view.component';

@NgModule({
    declarations: [
        HomeComponent,
        AbstractShapesSorterComponent,
        DuolingoWordPuzzleComponent,
        ChartsGridComponent,
        StatefulNavbarComponent,
        AbstractFullscreenPostComponent,
        AbstractStackingCardsComponent,
        TileOrListViewComponent,
    ],
    imports: [CommonModule, PipesModule, ComponentsModule, RouterModule, IconsModule],
})
export class PagesModule {}

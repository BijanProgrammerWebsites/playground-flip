import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './pages/home/home.component';
import {AbstractShapesSorterComponent} from './pages/abstract-shapes-sorter/abstract-shapes-sorter.component';
import {DuolingoWordPuzzleComponent} from './pages/duolingo-word-puzzle/duolingo-word-puzzle.component';
import {ChartsGridComponent} from './pages/charts-grid/charts-grid.component';
import {StatefulNavbarComponent} from './pages/stateful-navbar/stateful-navbar.component';
import {AbstractFullscreenPostComponent} from './pages/abstract-fullscreen-post/abstract-fullscreen-post.component';
import {AbstractStackingCardsComponent} from './pages/abstract-stacking-cards/abstract-stacking-cards.component';
import {TileOrListViewComponent} from './pages/tile-or-list-view/tile-or-list-view.component';

const routes: Routes = [
    {path: '', pathMatch: 'full', component: HomeComponent},
    {path: 'abstract-shapes-sorter', component: AbstractShapesSorterComponent},
    {path: 'duolingo-word-puzzle', component: DuolingoWordPuzzleComponent},
    {path: 'charts-grid', component: ChartsGridComponent},
    {path: 'stateful-navbar', component: StatefulNavbarComponent},
    {path: 'abstract-fullscreen-post', component: AbstractFullscreenPostComponent},
    {path: 'abstract-stacking-cards', component: AbstractStackingCardsComponent},
    {path: 'tile-or-list-view', component: TileOrListViewComponent},
    {path: '*', redirectTo: ''},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DarkModeComponent} from './dark-mode/dark-mode.component';
import {FavoritesComponent} from './favorites/favorites.component';
import {HistoryComponent} from './history/history.component';
import {HomeComponent} from './home/home.component';
import {LightModeComponent} from './light-mode/light-mode.component';
import {ListViewComponent} from './list-view/list-view.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {TileViewComponent} from './tile-view/tile-view.component';
import {WidgetsComponent} from './widgets/widgets.component';

@NgModule({
    declarations: [
        DarkModeComponent,
        FavoritesComponent,
        HistoryComponent,
        HomeComponent,
        LightModeComponent,
        ListViewComponent,
        NotificationsComponent,
        TileViewComponent,
        WidgetsComponent,
    ],
    imports: [CommonModule],
    exports: [
        DarkModeComponent,
        FavoritesComponent,
        HistoryComponent,
        HomeComponent,
        LightModeComponent,
        ListViewComponent,
        NotificationsComponent,
        TileViewComponent,
        WidgetsComponent,
    ],
})
export class IconsModule {}

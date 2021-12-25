import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DarkModeComponent} from './dark-mode/dark-mode.component';
import {HomeComponent} from './home/home.component';
import {LightModeComponent} from './light-mode/light-mode.component';

@NgModule({
    declarations: [DarkModeComponent, HomeComponent, LightModeComponent],
    imports: [CommonModule],
    exports: [DarkModeComponent, HomeComponent, LightModeComponent],
})
export class IconsModule {}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeComponent} from './home/home.component';

import {ComponentsModule} from '../components/components.module';
import {PipesModule} from '../pipes/pipes.module';
import {RouterModule} from '@angular/router';
import {AbstractShapesSorterComponent} from './abstract-shapes-sorter/abstract-shapes-sorter.component';

@NgModule({
    declarations: [HomeComponent, AbstractShapesSorterComponent],
    imports: [CommonModule, PipesModule, ComponentsModule, RouterModule],
})
export class PagesModule {}

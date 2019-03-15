import { Routes } from '@angular/router';

import {ManageComponent} from './manage/manage.component';
import {CreateComponent} from './create/create.component';

export const PodOwnerLayoutRoutes: Routes = [
    { path: '', redirectTo: 'manage', pathMatch: 'prefix' },
    { path: 'manage',      component: ManageComponent },
    { path: 'create',      component: CreateComponent }
];

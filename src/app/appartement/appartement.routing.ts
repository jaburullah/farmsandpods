import { Routes } from '@angular/router';

import {ManageComponent} from './manage/manage.component';
import {CreateComponent} from './create/create.component';
import {InfoComponent} from './info/info.component';

export const AppartementLayoutRoutes: Routes = [
    { path: '', redirectTo: 'manage', pathMatch: 'prefix' },
    { path: 'manage',      component: ManageComponent },
    { path: 'create',      component: CreateComponent },
    { path: 'info',      component: InfoComponent },
];

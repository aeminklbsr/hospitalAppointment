import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PatientListComponent } from './components/patients/patient-list/patient-list.component';
import { AppointmentAddComponent } from './components/appointments/appointment-add/appointment-add.component';
import { AppointmentListComponent } from './components/appointments/appointment-list/appointment-list.component';
AppointmentListComponent

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'home',
                component: DashboardComponent,
            },
            {
                path: 'patient-list',
                component: PatientListComponent,
            },
            {
                path: 'appointment-add',
                component: AppointmentAddComponent,
            },
            {
                path: 'appointment-list',
                component: AppointmentListComponent,
            }
        ]
    }
];

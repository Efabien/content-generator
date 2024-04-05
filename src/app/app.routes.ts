import { Routes } from '@angular/router';
import { GeneratorComponent } from '../app-2/pages/generator/generator.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'generator',
    pathMatch: 'full'
  },
  {
    path: 'generator',
    component: GeneratorComponent,
  }
];

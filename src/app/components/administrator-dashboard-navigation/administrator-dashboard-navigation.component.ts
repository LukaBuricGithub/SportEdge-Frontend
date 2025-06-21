import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MaterialModules } from '../../shared-files/material.imports';

@Component({
  selector: 'app-administrator-dashboard-navigation',
  standalone:true,
  templateUrl: './administrator-dashboard-navigation.component.html',
  styleUrl: './administrator-dashboard-navigation.component.scss',
  imports: [
    ...MaterialModules,
  ]
})
export class AdministratorDashboardNavigationComponent {
  //private breakpointObserver = inject(BreakpointObserver);

  // isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  //   .pipe(
  //     map(result => result.matches),
  //     shareReplay()
  //   );  
}

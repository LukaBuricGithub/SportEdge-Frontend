import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, RouterModule, Routes } from '@angular/router';
import { MaterialModules } from '../../shared-files/material.imports';
import { AdministratorDashboardNavigationComponent } from "../../components/administrator-dashboard-navigation/administrator-dashboard-navigation.component";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';


@Component({
  selector: 'app-admin-layout',
  standalone:true,
  imports: [RouterOutlet, RouterModule, RouterLink, ...MaterialModules, AdministratorDashboardNavigationComponent,AsyncPipe],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 959px)'])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}

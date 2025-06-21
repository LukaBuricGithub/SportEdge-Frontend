import { AfterViewInit, Component, ViewChildren, QueryList, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { MaterialModules } from '../../shared-files/material.imports';
import { CommonModule } from '@angular/common';
import { MatMenu } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-navigation-menu',
  standalone:true,
  imports: [...MaterialModules,CommonModule,RouterLink,RouterModule,FormsModule],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.scss'
})



export class NavigationMenuComponent {
  searchTerm = '';

onSearch() {
  if (this.searchTerm.trim()) {
    // Navigate or filter your products, e.g.:
    console.log('Searching for:', this.searchTerm);
    // this.router.navigate(['/products'], { queryParams: { q: this.searchTerm } });
    }
  }
}
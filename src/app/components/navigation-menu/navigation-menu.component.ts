import { AfterViewInit, Component, ViewChildren, QueryList, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, RouterLink, Router } from '@angular/router';
import { MaterialModules } from '../../shared-files/material.imports';
import { CommonModule } from '@angular/common';
import { MatMenu } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { CategoryDTO } from '../../models/CategoryDTO';
import { AuthService } from '../../services/AuthenticationServices/auth.service';



@Component({
  selector: 'app-navigation-menu',
  standalone:true,
  imports: [...MaterialModules,CommonModule,RouterLink,RouterModule,FormsModule],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.scss'
})

export class NavigationMenuComponent implements OnInit {
  searchTerm = '';
  sportsCategories: CategoryDTO[] = [];

  constructor(private categoryService: CategoryService, private productService: ProductService, private router: Router, private authService: AuthService) 
  {}

  ngOnInit(): void {
    this.loadSportsCategories();
  }

  loadSportsCategories(): void {
    this.categoryService.getRootCategories().subscribe({
      next: (categories) => {
        this.sportsCategories = categories;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  onSearch(): void {
    const trimmed = this.searchTerm.trim();
    if (!trimmed) {
      console.log('Empty search term, no request sent');
      return;
    }
    this.router.navigate(['/shop/search'], { queryParams: { searchText: trimmed } });
  }

  onCategoryClick(categoryId: number): void {
    this.router.navigate(['/shop/search'], { queryParams: { categoryId } });
  }

  onGenderTypeClick(genderType: string): void {
    this.router.navigate(['/shop/search'], { queryParams: { genderType } });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/shop/login']); 
  }

  // Helpers to access auth service easily in template
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.getUserRole() === 'Admin';
  }
}
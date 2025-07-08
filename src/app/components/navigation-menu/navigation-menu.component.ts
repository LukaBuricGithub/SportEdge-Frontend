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


  constructor(private categoryService:CategoryService,private productService:ProductService,private router:Router) {}
  
  ngOnInit(): void 
  {
    this.loadSportsCategories();
  }

  loadSportsCategories() : void
  {
   this.categoryService.getRootCategories().subscribe({
      next: (categories) => {
        this.sportsCategories = categories;
        console.log(this.sportsCategories);
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  onSearch() 
  {
    if (this.searchTerm.trim()) {
    // Navigate or filter your products, e.g.:
    console.log('Searching for:', this.searchTerm);
    // this.router.navigate(['/products'], { queryParams: { q: this.searchTerm } });
    }
  }


  onCategoryClick(categoryId: number) 
  {
    this.router.navigate(['/shop/search'], { queryParams: { categoryId:categoryId } });
  }

  onGenderTypeClick(genderType:string)
  {
    this.router.navigate(['/shop/search'], { queryParams: { genderType:genderType } });
  }
}
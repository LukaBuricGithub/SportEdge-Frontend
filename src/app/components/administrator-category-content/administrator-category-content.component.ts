import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet, RouterModule, Router } from '@angular/router';
import { CategoryDTO } from '../../models/CategoryDTO';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-administrator-category-content',
  standalone:true,
  imports: [...MaterialModules,RouterModule,RouterLink,RouterOutlet,CommonModule],
  templateUrl: './administrator-category-content.component.html',
  styleUrl: './administrator-category-content.component.scss'
})


export class AdministratorCategoryContentComponent implements OnInit {

  
    displayedColumns: string[] = ['name', 'parents', 'children', 'actions'];

    dataSource!: MatTableDataSource<CategoryDTO>;
  
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    categories: CategoryDTO[] = [];
  
    constructor(private router:Router,private categoryService:CategoryService) {}
  
    ngOnInit(): void {


       this.categoryService.getAllCategories().subscribe((x:CategoryDTO[]) => {
        console.log('Categories received from API:', x);
        this.categories = x;
        this.dataSource = new MatTableDataSource(x);

        if (this.paginator && this.sort) 
        {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }


      });
      
    }
  
     applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  
    goToDetails(categoryId: number) 
    {
      this.router.navigate(['/admin/details-category'], {
        queryParams: {categoryId:categoryId}
      });
    }


    onCreateCategory(): void 
    {
       this.router.navigate(['/admin/create-category']);
    }

}


import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet, RouterModule, Router } from '@angular/router';
import { CategoryDTO } from '../../models/CategoryDTO';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { ProductDTO } from '../../models/ProductDTO';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-administrator-product-content',
  standalone:true,
  imports: [...MaterialModules,RouterOutlet,RouterModule,RouterLink,CommonModule],
  templateUrl: './administrator-product-content.component.html',
  styleUrl: './administrator-product-content.component.scss'
})
export class AdministratorProductContentComponent implements OnInit {


  displayedColumns: string[] = ['id', 'name', 'quantity', 'actions'];

  dataSource!: MatTableDataSource<ProductDTO>;
  
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  products: ProductDTO[] = [];
  
  categories: CategoryDTO[] = [];
  
  constructor(private router:Router,private productService:ProductService) {}
  
  ngOnInit(): void 
  {
    this.productService.getAllProducts().subscribe((x:ProductDTO[]) => {
        console.log('Products received from API:', x);
        this.products = x;
        this.dataSource = new MatTableDataSource(x);

        if (this.paginator && this.sort) 
        {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
  }

  applyFilter(event: Event) 
  {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
  }

  goToDetails(productId:number)
  {
     this.router.navigate(['/admin/details-product'], {
        queryParams: {productId:productId}
      });
  }


  onCreateProduct() : void
  {
    this.router.navigate(['/admin/create-product']);
  }

}

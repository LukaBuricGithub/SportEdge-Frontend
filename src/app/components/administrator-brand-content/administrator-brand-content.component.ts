import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { BrandDTO } from '../../models/BrandDTO';
import { BrandService } from '../../services/brand.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet, RouterModule, Router } from '@angular/router';






@Component({
  selector: 'app-administrator-brand-content',
  standalone:true,
  imports: [...MaterialModules,RouterModule,RouterLink,RouterOutlet],
  templateUrl: './administrator-brand-content.component.html',
  styleUrl: './administrator-brand-content.component.scss'
})


export class AdministratorBrandContentComponent implements OnInit {

    displayedColumns: string[] = ['name', 'actions'];

    dataSource!: MatTableDataSource<BrandDTO>;
  
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    brands: BrandDTO[] = [];
  
    constructor(private brandService:BrandService,private router:Router) {}
  
    ngOnInit(): void {
      
      this.brandService.getAllBrands().subscribe((x:BrandDTO[]) => {
        console.log('Brands received from API:', x);
        this.brands = x;
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
  
    goToDetails(brandId: number) 
    {
      this.router.navigate(['/admin/details-brand'], {
        queryParams: {brandId:brandId}
      });
    }


    onCreateBrand(): void 
    {
       this.router.navigate(['/admin/create-brand']);
    }

}
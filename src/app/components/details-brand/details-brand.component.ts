import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { BrandDTO } from '../../models/BrandDTO';
import { BrandService } from '../../services/brand.service';
import { RouterLink, RouterOutlet, RouterModule, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent,ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-details-brand',
  standalone:true,
  imports: [...MaterialModules,RouterModule,RouterOutlet],
  templateUrl: './details-brand.component.html',
  styleUrl: './details-brand.component.scss'
})
export class DetailsBrandComponent implements OnInit{

  constructor(private brandService:BrandService,private router:Router,private route:ActivatedRoute,private dialog:MatDialog,
    private snackBar:MatSnackBar
  ) {}
  
  brandId!: number;

  brand!:BrandDTO;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.brandId = +params['brandId'];
      console.log('Received brandId:', this.brandId);

      this.brandService.getBrandById(this.brandId).subscribe(brand => {
        this.brand = brand;
      });


    });
  }


  onBack() : void 
  {
    this.router.navigate(['/admin/brands']);
  }
  

  onDelete(brandId: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      title: 'Delete Brand',
      message: 'Are you sure you want to delete this brand?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    } as ConfirmDialogData
  });


  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      
      this.brandService.deleteBrand(brandId).subscribe({
        next: (response) => {
          console.log('Brand deleted successfully:',response);
          this.router.navigate(['/admin/brands']);
        },
        error: (error) => {
          console.error('Failed to delete brand:', error);
          this.snackBar.open('Failed to delete brand. Check if you are allowed to delete brand.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        }
      });
    }
  });
}

  onUpdate(brandId:number)
  {
    this.router.navigate(['/admin/update-brand'], {
        queryParams: {brandId:brandId}
      });
  }
}

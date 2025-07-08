import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { RouterLink, RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryDTO } from '../../models/CategoryDTO';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-details-category',
  standalone:true,
  imports: [...MaterialModules,RouterModule,RouterLink,RouterOutlet,CommonModule],
  templateUrl: './details-category.component.html',
  styleUrl: './details-category.component.scss'
})
export class DetailsCategoryComponent implements OnInit {
  
  constructor(private router:Router,private categoryService:CategoryService,private route:ActivatedRoute,private dialog:MatDialog,
  private snackBar:MatSnackBar) {}


  categoryId!:number;
  category!:CategoryDTO;


  ngOnInit(): void {

      this.route.queryParams.subscribe(params => {
      this.categoryId = +params['categoryId'];
      console.log('Received categoryId:', this.categoryId);

      this.categoryService.getCategoryById(this.categoryId).subscribe(category => {
        this.category = category
      });
    });


  }

  onDelete(categoryId:number) : void
  {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Category',
        message: 'Are you sure you want to delete this category?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      } as ConfirmDialogData
    });

    
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      
      this.categoryService.deleteCategory(categoryId).subscribe({
        next: (response) => {
          console.log('Category deleted successfully:',response);
          this.router.navigate(['/admin/categories']);
        },
        error: (error) => {

          let errorMessage = 'An unknown error occurred.';

          switch(error.status) 
          {
            case 400:
              errorMessage = error?.error?.message || 'Cannot delete category because it has related objects.';
              break;
            default:
               errorMessage = error?.error?.message || 'Unexpected error occurred.';
              break;
          }


          console.error('Failed to delete category:', error);
          this.snackBar.open(errorMessage, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
          });
        }

      });
    }
  });

}

  onUpdate(categoryId:number)
  {
    this.router.navigate(['/admin/update-category'], {
        queryParams: {categoryId:categoryId}
      });
  }

  onBack() : void 
  {
    this.router.navigate(['/admin/categories']);
  }
}

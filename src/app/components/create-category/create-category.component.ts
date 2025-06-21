import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateCategoryRequestDTO } from '../../models/CreateCategoryRequestDTO';
import { CategoryService } from '../../services/category.service';
import { CategoryDTO } from '../../models/CategoryDTO';



@Component({
  selector: 'app-create-category',
  standalone:true,
  imports: [...MaterialModules,CommonModule,FormsModule,ReactiveFormsModule,RouterModule,RouterOutlet,RouterLink],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.scss'
})
export class CreateCategoryComponent implements OnInit{


  createCategoryForm!: FormGroup;
  allCategories: CategoryDTO[] = [];
  hierarchicalCategories: { id: number; displayName: string }[] = [];

  constructor( private fb: FormBuilder, private categoryService: CategoryService, private router: Router, private snackBar:MatSnackBar) {}

  ngOnInit(): void {
    this.createCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      parentCategoryId: [null],
    });

    this.categoryService.getAllCategories().subscribe((categories) => {
      this.allCategories = categories;
      this.hierarchicalCategories = this.buildHierarchyLabels(categories);
    });
  }

  onSubmit(): void 
  {
    if(this.createCategoryForm.invalid)
    {
      this.snackBar.open('Please fix the errors in the form.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return; 
    }

    const formValue = this.createCategoryForm.value;

    const payload : CreateCategoryRequestDTO = {
      name:formValue.name,
      parentCategoryId:formValue.parentCategoryId
    };

    this.categoryService.createCategory(payload).subscribe({
      next:(response) => {
        console.log('Creation of category successful:', response);
        this.router.navigate(['/admin/categories']);
      },
      error: (error) => {
        console.log('Creation of category failed:', error);
        this.snackBar.open('Creation of category failed. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }




  onBack(): void {
    this.router.navigate(['/admin/categories']);
  }

  private buildHierarchyLabels(categories: CategoryDTO[]): { id: number; displayName: string }[] {
    const map = new Map<number, CategoryDTO>();
    categories.forEach(c => map.set(c.id, c));

    const result: { id: number; displayName: string }[] = [];

    for (const category of categories) {
      const labelParts: string[] = [];
      let current: CategoryDTO | undefined = category;

      const visited = new Set<number>();
      while (current && current.parentCategoriesIDs.length > 0) {
        const parentId = current.parentCategoriesIDs[0];
        if (visited.has(parentId)) break;
        visited.add(parentId);

        const parent = map.get(parentId);
        if (parent) {
          labelParts.unshift(parent.name);
          current = parent;
        } else {
          break;
        }
      }

      labelParts.push(category.name);
      result.push({ id: category.id, displayName: labelParts.join(' → ') });
    }

    return result.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }
}

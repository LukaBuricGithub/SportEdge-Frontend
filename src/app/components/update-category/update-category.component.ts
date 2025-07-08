import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryDTO } from '../../models/CategoryDTO';
import { UpdateCategoryRequestDTO } from '../../models/UpdateCategoryRequestDTO';
import { CategoryService } from '../../services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/AuthenticationServices/auth.service';


@Component({
  selector: 'app-update-category',
  standalone:true,
  imports: [...MaterialModules,RouterModule,RouterOutlet,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.scss'
})


export class UpdateCategoryComponent implements OnInit {
  
    updateCategoryForm!:FormGroup;
    allCategories: CategoryDTO[] = [];
    hierarchicalCategories: { id: number; displayName: string }[] = [];
    categoryId!: number;


    constructor(private fb:FormBuilder, private categoryService:CategoryService,private router:Router,private snackBar:MatSnackBar
  ,private authService:AuthService,private route:ActivatedRoute) {}



  ngOnInit(): void {

     this.updateCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      parentCategoryId: [null],
    });


      this.route.queryParams.subscribe(params => {
        this.categoryId = +params['categoryId'];

      this.categoryService.getCategoryById(this.categoryId).subscribe(category => {
      this.updateCategoryForm.patchValue({
        name: category.name,
        parentCategoryId: category.parentCategoriesIDs[0] ?? null
        });

      });



      /*
      this.categoryService.getAllCategories().subscribe(categories => {
        this.allCategories = categories;
        this.hierarchicalCategories = this.buildHierarchyLabels(categories);
      });
      */


      this.categoryService.getAllCategories().subscribe((categories) => {
        this.allCategories = categories;
        const excludedIds = this.findDescendantIds(this.categoryId, categories);
        excludedIds.add(this.categoryId);
        const filteredCategories = categories.filter(c => !excludedIds.has(c.id));
        this.hierarchicalCategories = this.buildHierarchyLabels(filteredCategories);
      });
    });
  }


  onSubmit(): void {
    if (this.updateCategoryForm.invalid) {
      this.snackBar.open('Please fix the errors in the form.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const formValue = this.updateCategoryForm.value;
    const payload: UpdateCategoryRequestDTO = {
      name: formValue.name,
      parentCategoryId: formValue.parentCategoryId
    };

    this.categoryService.updateCategory(this.categoryId, payload).subscribe({
      next: () => {
        this.router.navigate(['/admin/details-category'], {
          queryParams: { categoryId: this.categoryId }
        });
      },
      error: (error) => {
        let errorMessage = 'An unknown error occurred.';
        switch (error.status) {
          case 400:
            errorMessage = error?.error?.message || 'Cannot update brand because it has related objects.';
            break;
          default:
            errorMessage = error?.error?.message || 'Unexpected error occurred.';
            break;
        }

        console.error('Update of category failed:', error);
        this.snackBar.open(errorMessage, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
 


  onBack(categoryId:number) : void 
  {
    this.router.navigate(['/admin/details-category'], {
        queryParams: {categoryId:categoryId}
      });
  }


  private buildHierarchyLabels(categories: CategoryDTO[]): { id: number; displayName: string }[] {
    const map = new Map<number, CategoryDTO>();
    categories.forEach(c => map.set(c.id, c));

    const result: { id: number; displayName: string }[] = [];

    for (const category of categories) {
      const labelParts: string[] = [];
      let current: CategoryDTO | undefined = category;
      const visited = new Set<number>();

      while (current?.parentCategoriesIDs.length) {
        const parentId = current.parentCategoriesIDs[0];
        if (visited.has(parentId)) break;
        visited.add(parentId);

        const parent = map.get(parentId);
        if (parent) {
          labelParts.unshift(parent.name);
          current = parent;
        } else break;
      }

      labelParts.push(category.name);
      result.push({ id: category.id, displayName: labelParts.join(' → ') });
    }

    return result.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }


  private findDescendantIds(categoryId: number, allCategories: CategoryDTO[]): Set<number> {
  const descendants = new Set<number>();

  const map = new Map<number, CategoryDTO>();
  allCategories.forEach(c => map.set(c.id, c));

  const visit = (id: number) => {
    const category = map.get(id);
    if (!category) return;

    for (const childId of category.childCategoriesIDs) {
      if (!descendants.has(childId)) {
        descendants.add(childId);
        visit(childId);
      }
    }
  };

  visit(categoryId);
  return descendants;
}

}

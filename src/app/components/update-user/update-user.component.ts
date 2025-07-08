import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/AuthenticationServices/auth.service';
import { UserService } from '../../services/user.service';
import { UpdateUserRequestDTO } from '../../models/UpdateUserRequestDTO';

@Component({
  selector: 'app-update-user',
  standalone:true,
  imports: [...MaterialModules,RouterModule,RouterOutlet,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent implements OnInit {
  

  updateUserForm!:FormGroup;
  userId!:number;

  constructor(private fb:FormBuilder, private userService:UserService,private router:Router,private snackBar:MatSnackBar
  ,private authService:AuthService,private route:ActivatedRoute) {}


  ngOnInit(): void {

    this.updateUserForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      country: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      dateOfBirth: ['', Validators.required],
    });


      this.route.queryParams.subscribe(params => {
        this.userId = +params['userId'];

      this.userService.getUserById(this.userId).subscribe(user => {
      this.updateUserForm.patchValue({
        firstName: user.firstName,
        lastName:user.lastName,
        country:user.country,
        city:user.city,
        address:user.address,
        dateOfBirth:user.dateOfBirth
        });
      });

    });
  }

  onSubmit(): void {
      if (this.updateUserForm.invalid) {
        this.snackBar.open('Please fix the errors in the form.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        return;
      }
  
      const formValue = this.updateUserForm.value;
      const payload: UpdateUserRequestDTO = {
        firstName : formValue.firstName,
        lastName: formValue.lastName,
        dateOfBirth: formatDate(formValue.dateOfBirth ,"yyyy-MM-dd", "en-US", ""),
        //dateOfBirth: formValue.dateOfBirth,
        country: formValue.country,
        city: formValue.city,
        address: formValue.address
      };
  
      this.userService.updateUser(this.userId, payload).subscribe({
        next: () => {
          this.router.navigate(['/admin/details-user'], {
            queryParams: { userId: this.userId }
          });
        },
        error: (error) => {
          let errorMessage = 'An unknown error occurred.';
          switch (error.status) {
            case 404:
              errorMessage = error?.error?.message || 'Cannot find user to update.';
              break;
            default:
              errorMessage = error?.error?.message || 'Unexpected error occurred.';
              break;
          }
  
          console.error('Update of user failed:', error);
          this.snackBar.open(errorMessage, 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }



  onBack(userId:number) : void 
  {
      this.router.navigate(['/admin/details-user'], {
        queryParams: {userId:userId}
      });
  }

}

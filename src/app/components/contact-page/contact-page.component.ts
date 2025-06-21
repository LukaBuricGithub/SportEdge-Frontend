import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerServiceMessageDTO } from '../../models/CustomerServiceMessageDTO';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-contact-page',
  standalone:true,
  imports: [...MaterialModules,FormsModule,ReactiveFormsModule,CommonModule,RouterModule,RouterLink],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss'
})


export class ContactPageComponent implements OnInit {

  contactForm !: FormGroup;

  constructor(private fb:FormBuilder, private router:Router,private snackBar:MatSnackBar,private userService:UserService) {}
  
  ngOnInit(): void {

    this.contactForm = this.fb.group({
      subject: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      email: ['',[Validators.required, Validators.email]],
      content: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]]
    });
  }

    onSubmit() : void 
    {
      if (this.contactForm.invalid) 
      {
           this.snackBar.open('Please fix the errors in the form.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        return; 
      }

      const formValue = this.contactForm.value;
      const payload:CustomerServiceMessageDTO = 
      {
        FirstName:formValue.firstName,
        LastName:formValue.lastName,
        Email:formValue.email,
        Subject:formValue.subject,
        Content:formValue.content
      };



      this.userService.customerServiceSendMessage(payload).subscribe({
        next: (response) => {
          console.log('Message sent successfully:', response);
          this.router.navigate(['/shop/thank-you-message']);
        },
        error: (error) => {
          console.error('Failed to send message to customer service:', error);
          this.snackBar.open('Failed to send message to customer service. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        }
      });
  }

}

import { Component } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { Router, RouterLink, RouterModule } from '@angular/router';


@Component({
  selector: 'app-thank-you-message-customer-service',
  standalone:true,
  imports: [...MaterialModules,RouterModule,RouterLink],
  templateUrl: './thank-you-message-customer-service.component.html',
  styleUrl: './thank-you-message-customer-service.component.scss'
})
export class ThankYouMessageCustomerServiceComponent {

  constructor(private router:Router) {}

}

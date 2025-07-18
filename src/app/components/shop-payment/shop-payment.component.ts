import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-shop-payment',
  imports: [],
  templateUrl: './shop-payment.component.html',
  styleUrl: './shop-payment.component.scss'
})
export class ShopPaymentComponent implements OnInit{
  
  amount:number = 0;

  constructor(private router:Router){}

  @ViewChild('paymentRef', {static:true}) paymentRef!:ElementRef;
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  cancel(): void 
  {

  }
  
 

}

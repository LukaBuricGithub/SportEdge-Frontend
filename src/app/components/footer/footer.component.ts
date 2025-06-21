import { Component, HostListener, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone:true,
  imports: [...MaterialModules,CommonModule,RouterModule,RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {

  isMobile = window.innerWidth <= 768;


   @HostListener('window:resize', [])
    onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnInit(): void {
    this.onResize();
  }

}

import { Component } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-index-page',
  standalone:true,
  imports: [...MaterialModules,CommonModule,CarouselModule],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.scss'
})

export class IndexPageComponent  {
    
  constructor(private categoryService:CategoryService,private productService:ProductService,private router:Router) {}


  carouselOptions: OwlOptions = {
    loop: true,
    margin: 10,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 8000, 
    autoplayHoverPause: true,
    items: 1,
    responsive: {
      0: { items: 1},
      600: { items: 1 },
      1000: { items: 1 }
    }
  };


  images: string[] = [
  '/images/index-page/gallery/Adidas.jpg',
  '/images/index-page/gallery/Puma.jpg',
  '/images/index-page/gallery/Nike.jpg',
  '/images/index-page/gallery/NewBalance.jpg',
];

lightboxOpen = false;
currentIndex = 0;
clickCooldown = false;

openLightbox(index: number) {
  if (this.clickCooldown) return;

  this.clickCooldown = true;
  this.currentIndex = index;
  this.lightboxOpen = true;

  setTimeout(() => {
    this.clickCooldown = false;
  }, 300);
}


closeLightbox() {
  this.lightboxOpen = false;
}

prevImage(event: Event) {
  event.stopPropagation();
  this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
}

nextImage(event: Event) {
  event.stopPropagation();
  this.currentIndex = (this.currentIndex + 1) % this.images.length;
}

  onGenderTypeClick(genderType:string)
  {
    this.router.navigate(['/shop/search'], { queryParams: { genderType:genderType } });
  }


}

import { Component } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';


@Component({
  selector: 'app-about-page',
  standalone:true,
  imports: [RouterModule,RouterLink],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss'
})
export class AboutPageComponent {

}

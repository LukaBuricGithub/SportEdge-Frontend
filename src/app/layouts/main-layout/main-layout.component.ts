import { Component } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavigationMenuComponent } from "../../components/navigation-menu/navigation-menu.component";
import { RouterLink, RouterOutlet, RouterModule, Routes } from '@angular/router';
import { MaterialModules } from '../../shared-files/material.imports';


@Component({
  selector: 'app-main-layout',
  standalone:true,
  imports: [RouterOutlet, RouterModule, RouterLink, ...MaterialModules,FooterComponent, NavigationMenuComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}

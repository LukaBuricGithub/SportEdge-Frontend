import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModules } from './shared-files/material.imports';
import { NavigationMenuComponent } from "./components/navigation-menu/navigation-menu.component";
import { FooterComponent } from "./components/footer/footer.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, RouterLink, ...MaterialModules, NavigationMenuComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent {
  title = 'SportEdgeApp';
}

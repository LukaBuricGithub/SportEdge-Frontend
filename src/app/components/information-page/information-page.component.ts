import { Component } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';

@Component({
  selector: 'app-information-page',
  standalone:true,
  imports: [...MaterialModules],
  templateUrl: './information-page.component.html',
  styleUrl: './information-page.component.scss'
})
export class InformationPageComponent {

}

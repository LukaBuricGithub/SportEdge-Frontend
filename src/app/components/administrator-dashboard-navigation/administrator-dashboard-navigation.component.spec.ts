import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorDashboardNavigationComponent } from './administrator-dashboard-navigation.component';
import { MaterialModules } from '../../shared-files/material.imports';


 
describe('AdministratorDashboardNavigationComponent', () => {
  let component: AdministratorDashboardNavigationComponent;
  let fixture: ComponentFixture<AdministratorDashboardNavigationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdministratorDashboardNavigationComponent],
      imports: [...MaterialModules,
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorDashboardNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorDashboardContentComponent } from './administrator-dashboard-content.component';

describe('AdministratorDashboardContentComponent', () => {
  let component: AdministratorDashboardContentComponent;
  let fixture: ComponentFixture<AdministratorDashboardContentComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorDashboardContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorBrandContentComponent } from './administrator-brand-content.component';

describe('AdministratorBrandContentComponent', () => {
  let component: AdministratorBrandContentComponent;
  let fixture: ComponentFixture<AdministratorBrandContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorBrandContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministratorBrandContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

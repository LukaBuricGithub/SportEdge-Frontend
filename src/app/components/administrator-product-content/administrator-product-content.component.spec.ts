import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorProductContentComponent } from './administrator-product-content.component';

describe('AdministratorProductContentComponent', () => {
  let component: AdministratorProductContentComponent;
  let fixture: ComponentFixture<AdministratorProductContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorProductContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministratorProductContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

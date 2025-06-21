import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorCategoryContentComponent } from './administrator-category-content.component';

describe('AdministratorCategoryContentComponent', () => {
  let component: AdministratorCategoryContentComponent;
  let fixture: ComponentFixture<AdministratorCategoryContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorCategoryContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministratorCategoryContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopUserUpdateComponent } from './shop-user-update.component';

describe('ShopUserUpdateComponent', () => {
  let component: ShopUserUpdateComponent;
  let fixture: ComponentFixture<ShopUserUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopUserUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopUserUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

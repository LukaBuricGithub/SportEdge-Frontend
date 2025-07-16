import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopUserDetailsComponent } from './shop-user-details.component';

describe('ShopUserDetailsComponent', () => {
  let component: ShopUserDetailsComponent;
  let fixture: ComponentFixture<ShopUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopUserDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

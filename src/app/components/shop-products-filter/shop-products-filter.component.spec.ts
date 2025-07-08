import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopProductsFilterComponent } from './shop-products-filter.component';

describe('ShopProductsFilterComponent', () => {
  let component: ShopProductsFilterComponent;
  let fixture: ComponentFixture<ShopProductsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopProductsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopProductsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

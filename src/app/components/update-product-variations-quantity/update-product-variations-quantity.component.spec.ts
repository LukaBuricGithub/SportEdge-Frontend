import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProductVariationsQuantityComponent } from './update-product-variations-quantity.component';

describe('UpdateProductVariationsQuantityComponent', () => {
  let component: UpdateProductVariationsQuantityComponent;
  let fixture: ComponentFixture<UpdateProductVariationsQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProductVariationsQuantityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProductVariationsQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

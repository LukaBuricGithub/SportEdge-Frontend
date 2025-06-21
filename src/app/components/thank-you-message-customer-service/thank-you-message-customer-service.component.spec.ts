import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouMessageCustomerServiceComponent } from './thank-you-message-customer-service.component';

describe('ThankYouMessageCustomerServiceComponent', () => {
  let component: ThankYouMessageCustomerServiceComponent;
  let fixture: ComponentFixture<ThankYouMessageCustomerServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThankYouMessageCustomerServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThankYouMessageCustomerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

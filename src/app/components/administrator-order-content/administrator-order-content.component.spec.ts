import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorOrderContentComponent } from './administrator-order-content.component';

describe('AdministratorOrderContentComponent', () => {
  let component: AdministratorOrderContentComponent;
  let fixture: ComponentFixture<AdministratorOrderContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorOrderContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministratorOrderContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

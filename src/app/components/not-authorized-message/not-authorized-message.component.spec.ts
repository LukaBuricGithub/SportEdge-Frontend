import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAuthorizedMessageComponent } from './not-authorized-message.component';

describe('NotAuthorizedMessageComponent', () => {
  let component: NotAuthorizedMessageComponent;
  let fixture: ComponentFixture<NotAuthorizedMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotAuthorizedMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotAuthorizedMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

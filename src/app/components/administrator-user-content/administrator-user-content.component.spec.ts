import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorUserContentComponent } from './administrator-user-content.component';

describe('AdministratorUserContentComponent', () => {
  let component: AdministratorUserContentComponent;
  let fixture: ComponentFixture<AdministratorUserContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorUserContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministratorUserContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

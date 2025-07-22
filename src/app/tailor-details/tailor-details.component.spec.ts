import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailorDetailsComponent } from './tailor-details.component';

describe('TailorDetailsComponent', () => {
  let component: TailorDetailsComponent;
  let fixture: ComponentFixture<TailorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailorDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TailorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

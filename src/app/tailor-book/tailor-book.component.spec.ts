import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailorBookComponent } from './tailor-book.component';

describe('TailorBookComponent', () => {
  let component: TailorBookComponent;
  let fixture: ComponentFixture<TailorBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailorBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TailorBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

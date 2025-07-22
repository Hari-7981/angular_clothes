import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailorsListComponent } from './tailors-list.component';

describe('TailorsListComponent', () => {
  let component: TailorsListComponent;
  let fixture: ComponentFixture<TailorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailorsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TailorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

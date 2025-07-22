import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialSuppliersListComponent } from './material-suppliers-list.component';

describe('MaterialSuppliersListComponent', () => {
  let component: MaterialSuppliersListComponent;
  let fixture: ComponentFixture<MaterialSuppliersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialSuppliersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialSuppliersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

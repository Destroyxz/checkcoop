import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicharComponent } from './fichar.component';

describe('FicharComponent', () => {
  let component: FicharComponent;
  let fixture: ComponentFixture<FicharComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FicharComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FicharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

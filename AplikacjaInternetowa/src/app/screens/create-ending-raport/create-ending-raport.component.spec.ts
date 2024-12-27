import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEndingRaportComponent } from './create-ending-raport.component';

describe('CreateEndingRaportComponent', () => {
  let component: CreateEndingRaportComponent;
  let fixture: ComponentFixture<CreateEndingRaportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEndingRaportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEndingRaportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

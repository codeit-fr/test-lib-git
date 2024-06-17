import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCodeItComponent } from './ngx-code-it.component';

describe('NgxCodeItComponent', () => {
  let component: NgxCodeItComponent;
  let fixture: ComponentFixture<NgxCodeItComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxCodeItComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxCodeItComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

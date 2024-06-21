import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeItComponent } from './code-it.component';

describe('CodeItComponent', () => {
  let component: CodeItComponent;
  let fixture: ComponentFixture<CodeItComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeItComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeItComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeItLibComponent } from './code-it-lib.component';

describe('CodeItLibComponent', () => {
  let component: CodeItLibComponent;
  let fixture: ComponentFixture<CodeItLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeItLibComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeItLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

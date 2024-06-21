import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-common-lib',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      common-lib works!
    </p>
  `,
  styles: ``
})
export class CommonLibComponent {

}

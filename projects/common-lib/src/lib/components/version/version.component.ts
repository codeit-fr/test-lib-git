import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss'],
  imports:[MatProgressSpinnerModule],
  standalone: true
})
export class VersionComponent {

  @Input() title: string | null = null;
  @Input() version: string | null = null;
  @Input() commitHash: string | null = null;
  @Input() packageGenerationDate: string | null = null;


  constructor() {
    this.version = environment.version;
    this.commitHash = environment.commitHash;
    this.packageGenerationDate = environment.packageGenerationDate;
  }
}

import { Component } from '@angular/core';
import { FileDropDirective } from '../directives/file-drop.directive';
import { main } from './engine';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [FileDropDirective],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
})
export class CanvasComponent {
  ngAfterViewInit() {
    main('main-canvas');
  }

  onFilesDropped(files: File[]): void {
    console.log('Files dropped:', files);
  }

  onDragOver(event: DragEvent): void {
    console.log('Drag over:', event);
  }

  onDragLeave(event: DragEvent): void {
    console.log('Drag leave:', event);
  }
}

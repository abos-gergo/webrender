import { Component, NgZone } from '@angular/core';
import { FileDropDirective } from '../directives/file-drop.directive';
import { main } from './engine';
import { CanvasManagerService } from './canvas-manager.service';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [FileDropDirective],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
})
export class CanvasComponent {
  canvasId!: number

  constructor(private canvasManager: CanvasManagerService) { }

  ngOnInit() {
    this.canvasId = this.canvasManager.getNewId()
  }
  ngAfterViewInit() {
    main();
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

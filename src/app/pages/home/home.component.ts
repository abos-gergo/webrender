import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { CanvasManagerService } from '../../canvas/canvas-manager.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    private canvasManager: CanvasManagerService,
    private containerRef: ViewContainerRef
  ) {}

  createCanvas() {
    this.canvasManager.createCanvas(this.containerRef);
  }
}

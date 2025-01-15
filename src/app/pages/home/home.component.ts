import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { CanvasManagerService } from '../../canvas/canvas-manager.service';
import { CanvasComponent } from '../../canvas/canvas.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @ViewChild('canvasSpawn', { read: ViewContainerRef }) canvasSpawnRef!: ViewContainerRef;
  createCanvas() {
    console.log(this.canvasSpawnRef);

    return this.canvasSpawnRef.createComponent(CanvasComponent);
  }
}

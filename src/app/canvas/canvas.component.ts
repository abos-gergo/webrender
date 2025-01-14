import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { main } from './render';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
})
export class CanvasComponent {
  ngAfterViewInit() {
    main();
  }
}

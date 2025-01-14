import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initRenderer } from '../../../projects/rust/src/public-api';



@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
})
export class CanvasComponent {
  ngOnInit() {
    initRenderer().then(() => "Wasm Loaded");
  }
}

import { Component } from '@angular/core';
import { CanvasComponent } from "../../canvas/canvas.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CanvasComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}

import {
  Injectable,
  ViewContainerRef,
  ComponentFactoryResolver,
} from '@angular/core';
import { CanvasComponent } from './canvas.component';

@Injectable({
  providedIn: 'root',
})
export class CanvasManagerService {
  constructor() {}

  //TODO
  // public createCanvas(viewContainerRef: ViewContainerRef): CanvasComponent {}
}

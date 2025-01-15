import {
  Injectable,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
} from '@angular/core';
import { CanvasComponent } from './canvas.component';

@Injectable({
  providedIn: 'root',
})
export class CanvasManagerService {
  constructor() {}

  public createCanvas(
    viewContainerRef: ViewContainerRef
  ): ComponentRef<CanvasComponent> {
    return viewContainerRef.createComponent(CanvasComponent);
  }
}

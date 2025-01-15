import {
  Injectable
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CanvasManagerService {
  idTracker: number = 0
  constructor() { }

  getNewId(): number {
    this.idTracker += 1
    return this.idTracker
  }
}

// drag-and-drop.directive.ts
import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appFileDrop]',
})
export class FileDropDirective {
  @Output() fileDropped: EventEmitter<File[]> = new EventEmitter<File[]>();
  @Output() dragOver: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();
  @Output() dragLeave: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.emit(event);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.emit(event);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragLeave.emit(event);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const fileArray: File[] = Array.from(files);
      this.fileDropped.emit(fileArray);
    } else {
      this.fileDropped.emit([]); // Emit an empty array if no files are found
    }
  }
}

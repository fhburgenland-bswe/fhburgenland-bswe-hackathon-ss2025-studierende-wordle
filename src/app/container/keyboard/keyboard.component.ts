import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface for tracking letter statuses
export interface KeyboardStatus {
  [key: string]: 'correct' | 'wrong-position' | 'not-found' | '';
}

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit, OnChanges {
  @Input() letterStatuses: KeyboardStatus = {};
  @Output() keyPressed = new EventEmitter<string>();

  // Keyboard layout rows
  keyboardRows: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialize the keyboard
    // Add event listener for physical keyboard
    document.addEventListener('keydown', (event) => this.handlePhysicalKeyboard(event));
  }

  ngOnChanges(changes: SimpleChanges): void {
    // React to letterStatuses changes if needed
  }

  // Handle virtual keyboard click
  handleKeyClick(key: string): void {
    this.keyPressed.emit(key);
  }

  // Handle physical keyboard press
  handlePhysicalKeyboard(event: KeyboardEvent): void {
    const key = event.key.toUpperCase();

    // Check if key is a letter
    if (/^[A-Z]$/.test(key)) {
      this.keyPressed.emit(key);
    }
    // Handle Enter and Backspace
    else if (key === 'ENTER' || key === 'BACKSPACE') {
      this.keyPressed.emit(key);
    }
  }

  // Get CSS class for a key based on its status
  getKeyClass(key: string): string {
    const status = this.letterStatuses[key];
    return status || '';
  }

  // Get special class for special keys like Enter and Backspace
  getSpecialKeyClass(key: string): string {
    return key === 'ENTER' || key === 'BACKSPACE' ? 'special-key' : '';
  }
}

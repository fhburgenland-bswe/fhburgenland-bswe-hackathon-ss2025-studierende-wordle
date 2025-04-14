// row.component.ts
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-row',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css']
})
export class RowComponent implements OnInit, OnChanges {
  @Input() word!: string;
  @Input() disableInputs: boolean = false;
  @Input() currentRow = 0;
  initialized = false;

  letterForm!: FormGroup;
  letterStatuses: string[] = ['', '', '', '', ''];
  @Output() guess = new EventEmitter<string[]>();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // Erstelle FormGroup mit FormArray für die Buchstaben
    this.letterForm = this.fb.group({
      letterArray: this.fb.array(Array(5).fill('').map(() => this.fb.control('')))
    });
    this.initialized = true;

    // Wenn das Formular deaktiviert werden soll
    if (this.disableInputs) {
      this.letterForm.disable();
    }
  }

  ngOnChanges() {
    // Wenn das Formular deaktiviert werden soll
    if (this.initialized) {
      if (this.disableInputs) {
        this.letterForm.disable();
      } else {
        this.letterForm.enable();
      }
    }

  }

  // Getter für den einfacheren Zugriff auf die FormArray
  get letterControls(): FormControl[] {
    return (this.letterForm.get('letterArray') as FormArray).controls as FormControl[];
  }

  // Gibt ein Array mit den aktuellen Werten zurück
  get letterValues(): string[] {
    return this.letterControls.map(control => control.value || '');
  }

  // Gibt die CSS-Klasse für ein Feld basierend auf seinem Status zurück
  getLetterClass(index: number): string {
    return this.letterStatuses[index] || '';
  }

  change($event: any, index: number) {
    // Wenn Enter gedrückt wurde und wir das letzte Feld erreicht haben
    if ($event.key === 'Enter') {
      // Überprüfe, ob alle Felder ausgefüllt sind
      if (!this.letterValues.includes('')) {
        this.validateInputs();
        this.guess.emit(this.letterValues);

        if (this.disableInputs) {
          this.letterForm.disable();
        }
      }
    }
    // Bewege den Fokus zum nächsten Feld nach Eingabe
    else if ($event.target.value && index < 4) {
      setTimeout(() => {
        const nextInput = document.querySelector(`#row${this.currentRow}ltr${index + 1}`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      });
    }
    // Lösche Inhalt bei Backspace und bewege Fokus zum vorherigen Feld
    else if ($event.key === 'Backspace' && !$event.target.value && index > 0) {
      setTimeout(() => {
        const prevInput = document.querySelector(`#row${this.currentRow}ltr${index - 1}`) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
        }
      });
    }
  }

  validateInputs() {
    const word = this.word.split('').map(l => l.toLowerCase());
    const letters = this.letterValues.map(l => l.toLowerCase());

    // Zuerst alle Felder auf "nicht gefunden" setzen
    this.letterStatuses = Array(5).fill('not-found');

    // Dann die korrekten Positionen erkennen
    for (let i = 0; i < 5; i++) {
      if (word[i] === letters[i]) {
        this.letterStatuses[i] = 'correct';
      }
    }

    // Dann die falschen Positionen erkennen
    for (let i = 0; i < 5; i++) {
      if (this.letterStatuses[i] !== 'correct' && word.includes(letters[i])) {
        // Prüfen, ob der Buchstabe nicht schon an einer anderen Stelle korrekt ist
        const letterCount = word.filter(letter => letter === letters[i]).length;
        const correctPositions = letters.filter((letter, idx) =>
          letter === letters[i] && this.letterStatuses[idx] === 'correct'
        ).length;

        if (correctPositions < letterCount) {
          this.letterStatuses[i] = 'wrong-position';
        }
      }
    }
  }

  // Methode zum manuellen Setzen der Farben (für Tests oder externe Steuerung)
  setColors(statuses: string[]) {
    this.letterStatuses = statuses;
  }
}

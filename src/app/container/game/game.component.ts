// game.component.ts
import { Component, OnInit } from '@angular/core';
import { RowComponent } from '../row/row.component';
import { CommonModule } from '@angular/common';
import { words } from './words';
import { ScoreComponent } from "../score/score.component";
import { KeyboardComponent, KeyboardStatus } from "../keyboard/keyboard.component";

@Component({
  selector: 'app-game',
  imports: [RowComponent, CommonModule, ScoreComponent, KeyboardComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {

  easterEgg = 'KNIPP'
  easterEggActivate = false;
  word = 'CHAIR';
  currentRow = 0;
  maxAttempts = 6;
  gameOver = false;
  victory = false;
  keyboardLetterStatuses: KeyboardStatus = {};

  // Array für die Anzahl der Versuche
  rows = Array(6).fill(0).map((_, i) => i);
  score = sessionStorage.getItem('score')
  constructor() { }

  ngOnInit() {
    // random word aus der Liste holen
    if (!sessionStorage.getItem('score')) {
      sessionStorage.setItem('score', '0');
    }
    this.score = sessionStorage.getItem('score')
    this.word = words[Math.floor(
      Math.random() * words.length)].toUpperCase();
    console.log(this.word)
  }

  guessed(guess: any) {
    this.updateKeyboardStatus(guess);


    // Prüfen, ob der Rateversuch korrekt ist
    console.log(guess.join(''))
    const guessedWord = guess.join('').toLowerCase();
    const isCorrect = guessedWord === this.word.toLowerCase();

    if (guessedWord === this.easterEgg.toLowerCase()) {
      this.easterEggActivate = true;
    }

    if (isCorrect) {
      // Spiel gewonnen
      console.log('Du hast gewonnen!');
      this.victory = true;

      sessionStorage.setItem('score', ((this.maxAttempts - this.currentRow) + Number.parseInt(sessionStorage.getItem('score')!)).toString());
      this.score = (Number.parseInt(this.score!) + (this.maxAttempts - this.currentRow)).toString();

    } else if (this.currentRow >= this.maxAttempts - 1) {
      // Alle Versuche aufgebraucht
      console.log('Spiel vorbei! Das Wort war: ' + this.word);
      this.gameOver = true;
    } else {
      // Nächste Reihe aktivieren
      this.currentRow++;
    }
  }

  // Bestimmt, ob eine Reihe aktiv oder inaktiv sein soll
  isRowDisabled(rowIndex: number): boolean {
    return rowIndex !== this.currentRow && !this.gameOver;
  }

  resetGame(won: boolean) {
    if (!won) {
      this.currentRow = 0
      sessionStorage.setItem('score', "0");
    } else {
      this.victory = false;
    }


    window.location.reload();

  }

  updateKeyboardStatus(guess: string[]): void {
    const word = this.word.toUpperCase().split('');
    const guessUpper = guess.map(letter => letter.toUpperCase());

    for (let i = 0; i < 5; i++) {
      if (guessUpper[i] === word[i]) {
        this.keyboardLetterStatuses[guessUpper[i]] = 'correct';
      }
    }

    for (let i = 0; i < 5; i++) {
      const letter = guessUpper[i];
      if (word.includes(letter) && guessUpper[i] !== word[i]) {
        if (this.keyboardLetterStatuses[letter] !== 'correct') {
          this.keyboardLetterStatuses[letter] = 'wrong-position';
        }
      } else if (!word.includes(letter) && !this.keyboardLetterStatuses[letter]) {
        this.keyboardLetterStatuses[letter] = 'not-found';
      }
    }
  }

  handleKeyPress(key: string): void {
    console.log('Key pressed:', key);
  }
}

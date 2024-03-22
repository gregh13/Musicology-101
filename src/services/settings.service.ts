import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private genre: string ='rock';
  private questionType: string ='artist';

  constructor() {}

  setGenre(genre: string) {
    this.genre = genre;
  }

  getGenre(): string {
    return this.genre;
  }

  setQuestionType(questionType: string) {
    this.questionType = questionType;
  }

  getQuestionType(): string {
    return this.questionType;
  }
}
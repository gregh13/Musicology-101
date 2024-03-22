import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/services/game.service';
import Question from 'src/app/models/Question'


@Component({
  selector: 'app-gamepage',
  templateUrl: './gamepage.component.html',
  styleUrls: ['./gamepage.component.css']
})
export class GamepageComponent implements OnInit {

  questionList: Question[] = [];
  strikes: number = 0;
  score: number = 0;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.questionListObservable.subscribe((questions: Question[]) => {
      this.questionList = questions;
    });

    this.gameService.playerScoreObservable.subscribe((playerScore: number) => {
      this.score = playerScore;
    })

    this.gameService.resetPlayerScore();
  }

  onStrikesChange(newStrikes: number): void {
    this.strikes = newStrikes;
  }

  get strikeArray(): number[] {
    return Array(this.strikes).fill(0);
  }

}

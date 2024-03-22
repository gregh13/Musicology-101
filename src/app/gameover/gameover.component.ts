import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from 'src/services/game.service';
import UserScore from '../models/UserScore';
import { SettingService } from 'src/services/settings.service';

@Component({
  selector: 'app-gameover',
  templateUrl: './gameover.component.html',
  styleUrls: ['./gameover.component.css']
})
export class GameoverComponent implements OnInit {

  score: number = 0;
  isWinner: boolean = false;
  genre: string = '';
  type: string = '';

  constructor(private gameService: GameService, private router: Router, private settingService: SettingService) { }

  ngOnInit(): void {
    this.gameService.winnerObservable.subscribe(winner => this.isWinner = winner)
    this.gameService.playerScoreObservable.subscribe((playerScore: number) => {this.score = playerScore})
    this.gameService.questionTypeObservable.subscribe(qtype => this.type = qtype);
    this.gameService.genreSelectedObservable.subscribe(genre => this.genre = genre);
  }

  submitName(form: NgForm) {
    if (form.valid) {
      const name = form.value.name;
      console.log("Name submitted:", name);
      
      const userScore: UserScore = {
        name: name,
        score: this.score,
        genre: this.genre,
        questionType: this.type
      };
      
      this.gameService.addNewScore(userScore);
      this.router.navigate(['']);
    }
  }
}

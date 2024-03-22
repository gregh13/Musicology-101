import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/services/game.service';
import Question from 'src/app/models/Question';
import AudioFeatures from 'src/app/models/AudioFeatures';

@Component({
  selector: 'app-question-answers',
  templateUrl: './question-answers.component.html',
  styleUrls: ['./question-answers.component.css']
})
export class QuestionAnswersComponent implements OnInit {

  @Input() questionList: Question[] = [];
  @Input() strikes!: number;
  @Output() strikesChange = new EventEmitter<number>();
  audioFeatures: AudioFeatures = {key: "", mode: "", tempo: 0, energy: "", valence: ""};
  displayFeatures: boolean = false;
  idx: number = 0;

  constructor(private router: Router, private gameService: GameService) { }

  ngOnInit(): void {
    this.shuffleChoices(this.idx)
    this.displayFeatures = false;
    this.gameService.audioFeaturesObservable.subscribe((features: AudioFeatures) => this.audioFeatures = features);
  }

  selectChoice(choice: { text: string, correct: boolean }) {
    this.displayFeatures = false;
    this.gameService.resetAudioFeatures();
    if (choice.correct === false) {
      this.strikes++
      this.updateStrikes(this.strikes) 
      if (this.strikes === 3) {
        this.router.navigate(['/gameover']);
        this.gameService.updateWinner(false);
      }
    } else {
      this.gameService.incrementPlayScore();
    }
    console.log(choice);
    this.idx++;
    if (this.idx === this.questionList.length) {
      this.router.navigate(['/gameover']);
      this.gameService.updateWinner(true);
    }
    this.shuffleChoices(this.idx)
  }

  updateIdx(event: any){
    console.log(event);
    console.log(this.idx);
  }

  updateStrikes(newStrikes: number): void {
    this.strikes = newStrikes;
    this.strikesChange.emit(newStrikes);
    console.log(this.strikes)
  }

  shuffleArray(array: { text: string; correct: boolean; }[]): { text: string; correct: boolean; }[] {
    const newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

  shuffleChoices(idx: number): void {
    const choices: { text: string; correct: boolean; }[] = this.shuffleArray(this.questionList[idx].choices);
    this.questionList[idx].choices = choices as [{ text: string; correct: boolean; }];
  }

  getFeatures() {
    if (this.displayFeatures) {
      this.displayFeatures = false;
    } else {
      this.displayFeatures = true;
    }
    if (!this.audioFeatures.key) {
      const trackId: string = this.questionList[this.idx].trackId;
      this.gameService.getTrackAudioFeatures(trackId);
    }
  }

  hideInfo() {
    this.displayFeatures = false;
  }

}

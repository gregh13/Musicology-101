import { Component, Input, OnInit } from '@angular/core';
import UserScore from 'src/app/models/UserScore';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  @Input() leaderboard: UserScore[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}

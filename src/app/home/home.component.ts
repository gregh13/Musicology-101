import { Component, OnInit } from "@angular/core";
import { GameService } from "src/services/game.service";
import { InitializationService } from "src/services/initialization";
import Question from "../models/Question";
import UserScore from "../models/UserScore";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  questions: Question[] = [];
  leaderboard: UserScore[] = [];

  constructor(private gameService: GameService, private initializationService: InitializationService,) {}


  // genres: string[] = [
  //   "rock",
  //   "rap",
  //   "pop",
  //   "country",
  //   "hip-hop",
  //   "jazz",
  //   "alternative",
  //   "j-pop",
  //   "k-pop",
  //   "emo"
  // ];

  // selectedGenre: string = "";
  // authLoading: boolean = false;
  // configLoading: boolean = false;
  // token: string = "";

  ngOnInit(): void {
    // this.authLoading = true;
    // this.gameService.validateToken();
    // this.authLoading = false;
    this.gameService.questionListObservable.subscribe(questionList => this.questions = questionList);
    this.gameService.leaderboardObservable.subscribe(leaderboardList => this.leaderboard = leaderboardList)

    if (this.initializationService.isFirstInit()) {
      this.gameService.getTracksByPlaylistGenre("rock");
      this.initializationService.setFirstInit(false);
    }
  }

  // loadGenres = async (t: any) => {
  //   this.configLoading = true;

  //   // #################################################################################
  //   // DEPRECATED!!! Use only for example purposes
  //   // DO NOT USE the recommendations endpoint in your application
  //   // Has been known to cause 429 errors
  //   // const response = await fetchFromSpotify({
  //   //   token: t,
  //   //   endpoint: "recommendations/available-genre-seeds",
  //   // });
  //   // console.log(response);
  //   // #################################################################################
    
  //   this.genres = [
  //     "rock",
  //     "rap",
  //     "pop",
  //     "country",
  //     "hip-hop",
  //     "jazz",
  //     "alternative",
  //     "j-pop",
  //     "k-pop",
  //     "emo"
  //   ]
  //   this.configLoading = false;
  // };

  // setGenre(selectedGenre: any) {
  //   this.selectedGenre = selectedGenre;
  //   console.log(this.selectedGenre);
  //   this.gameService.getTracksByPlaylistGenre(this.selectedGenre)
  // }
  

  updateQuestions(){
    this.gameService.buildQuestionList();
    console.log(this.questions)
  }
  
}

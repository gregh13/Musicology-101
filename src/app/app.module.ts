import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";


import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { SettingsComponent } from './settings/settings.component';
import { GamepageComponent } from './gamepage/gamepage.component';
import { GameoverComponent } from './gameover/gameover.component';
import { LeaderboardComponent } from './Components/leaderboard/leaderboard.component';
import { QuestionAnswersComponent } from './Components/question-answers/question-answers.component';
import { AudioPlayerComponent } from './Components/audio-player/audio-player.component';

const routes: Routes = [{ path: "", component: HomeComponent }];

@NgModule({
  declarations: [AppComponent, HomeComponent, SettingsComponent, GamepageComponent, GameoverComponent, LeaderboardComponent, QuestionAnswersComponent, GamepageComponent, GameoverComponent, AudioPlayerComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

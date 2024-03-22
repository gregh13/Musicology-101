import { Component, OnInit } from '@angular/core';
import Question from '../models/Question';
import { GameService } from 'src/services/game.service';
import { Router } from '@angular/router';
import { SettingService } from 'src/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  questionList: Question[] = [];
  genreList: {[index: string]: string} = {}
  genre: string = '';
  type: string = '';
  playlistName: string = "";
  playlistUrl: string = "";
  playlistMessage: string = "";

  constructor(private gameService: GameService, private router: Router, private settingService: SettingService) { }

  ngOnInit(): void {
    this.gameService.questionListObservable.subscribe(questions => this.questionList = questions);
    this.gameService.playlistMapperObservable.subscribe(genres => this.genreList = genres);
    this.gameService.questionTypeObservable.subscribe(qtype => this.type = qtype);
    this.gameService.genreSelectedObservable.subscribe(genre => this.genre = genre);
  }

  // setGenre(selectedGenre: any) {
  //   this.genre = selectedGenre;
  //   this.settingService.setGenre(selectedGenre)
  //   console.log(this.genre);
  // }

  // setType(selectedType: any) {
  //   this.type = selectedType;
  //   this.settingService.setQuestionType(selectedType)
  //   console.log(this.type);
  // }

  saveSettings() {
    this.gameService.updateGenreSelected(this.genre);
    this.gameService.updateQuestionType(this.type);
    this.gameService.getTracksByPlaylistGenre(this.genre);
    this.router.navigate(['']);
  }
  
  setPlaylistName(name: any) {
    this.resetPlaylistMessage();
    this.playlistName = name;
  }
  setPlaylistUrl(url: any) {
    this.resetPlaylistMessage();
    this.playlistUrl = url;
  }

  resetPlaylistMessage() {
    this.playlistMessage = "";
  }

  updatePlaylistMessage(message: string) {
    this.playlistMessage = message;
  }

  updatePlaylist(){
    this.resetPlaylistMessage();
    if (this.playlistName && this.playlistUrl){
      if (this.gameService.addCustomPlaylist(this.playlistName, this.playlistUrl)){
        this.updatePlaylistMessage("Successfully added playlist!");
        this.gameService.updateGenreSelected(this.playlistName);
        this.gameService.getTracksByPlaylistGenre(this.genre);
      }
      else {
        this.updatePlaylistMessage("Unsuccessful: Please make sure playlist url is correct and playlist is public");
      }
    } else {
      this.updatePlaylistMessage("Error: Both fields must contain input");
    }
  }


}

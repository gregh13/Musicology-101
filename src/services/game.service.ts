import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import fetchFromSpotify, { request } from "./api";
import TrackRaw from 'src/app/models/TrackRaw';
import Question from 'src/app/models/Question';
import UserScore from 'src/app/models/UserScore';
import AudioFeatures from 'src/app/models/AudioFeatures';
import AudioFeaturesRaw from 'src/app/models/AudioFeaturesRaw';
import Track from 'src/app/models/Track';

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private token: string = "";

  private trackList: Track[] = [];
  private choicesList: string[] = [];

  private audioFeaturesSource = new BehaviorSubject<AudioFeatures>({key: "", mode: "", tempo: 0, energy: "", valence: ""});
  audioFeaturesObservable = this.audioFeaturesSource.asObservable();

  private playerScoreSource = new BehaviorSubject<number>(0);
  playerScoreObservable = this.playerScoreSource.asObservable();

  private playlistMapperSource = new BehaviorSubject<{[index: string]: string}>({
    blues: "2dyMsLA53MXkjDkXmqBseN",
    classical: "6nrMDYTWNhlooAsNaeSP2Y",
    country: "7fIdjWhWzPbf1g5OSDKOXw",
    edm: "2W32HNDe5OgNsPvciLm1Ix",
    "hip-hop": "02okEcUQXHe2sS5ajE9XG0",
    house: "2uk6wTPxwrhgSAR66f4nBV",
    jazz: "0mQUDrcK2GQlpY1e89TJ1s",
    "k-pop": "1HmNOUNQKVnAr2Y0GbHS7b",
    pop: "6vI3xbpdPYYJmicjBieLcr",
    rock: "7DgPQwzEoUVfQYBiMLER9Z"
  });
  playlistMapperObservable = this.playlistMapperSource.asObservable();

  private genreSelectedSource = new BehaviorSubject<string>("rock");
  genreSelectedObservable = this.genreSelectedSource.asObservable();

  private questionTypeSource = new BehaviorSubject<string>("artist");
  questionTypeObservable = this.questionTypeSource.asObservable();

  private questionListSource = new BehaviorSubject<Question[]>([]);
  questionListObservable = this.questionListSource.asObservable();

  private leaderboardSource = new BehaviorSubject<UserScore[]>([]);
  leaderboardObservable = this.leaderboardSource.asObservable();

  private winnerSource = new BehaviorSubject<boolean>(false);
  winnerObservable = this.winnerSource.asObservable();

  constructor() { }

  resetAudioFeatures() {
    this.audioFeaturesSource.next({key: "", mode: "", tempo: 0, energy: "", valence: ""});
  }

  updateAudioFeatures(features: AudioFeatures) {
    this.audioFeaturesSource.next(features);
  }

  updateWinner(isWinner: boolean) {
    this.winnerSource.next(isWinner);
  }
  
  incrementPlayScore(){
    this.playerScoreSource.next((this.playerScoreSource.getValue() + 1))
  }

  resetPlayerScore(){
    this.playerScoreSource.next(0);
  }

  updateGenreSelected(newGenre: string) {
    this.genreSelectedSource.next(newGenre);
  }

  updatePlaylistMapper(name: string, playlistId: string){
    this.playlistMapperSource.next({...this.playlistMapperSource.getValue(), [name]: playlistId});
    console.log("Mapper: ", this.playlistMapperSource.getValue());
  } 

  updateQuestionList(questions: Question[]) {
    this.questionListSource.next(questions);
  }

  updateQuestionType(newType: string) {
    this.questionTypeSource.next(newType);
  }

  updateLeaderboardSource(scores: UserScore[]) {
    this.leaderboardSource.next(scores);
  }

  addNewScore(score: UserScore) {
    const scores: UserScore[] = [...this.leaderboardSource.getValue()];
    this.insertUserScore(scores, score)
    this.updateLeaderboardSource(scores);
  }

  extractPlaylistIdWithRegex(url: string) {
    const regex = /open\.spotify\.com\/playlist\/([^?]+)/;
    const match = url.match(regex);
    console.log("match: ", match);
    return match ? match[1] : ""; // Returns the matched group or null if no match is found
  }

  addCustomPlaylist(name: string, url: string): boolean{
    const playlistId: string = this.extractPlaylistIdWithRegex(url)
    console.log("Playlist ID after regex: ", playlistId);
    if (!playlistId) {
      // Send feedback to user via hidden error message or something
      console.log("Couldn't find that playlist")
      return false;
    } else{
      this.updatePlaylistMapper(name, playlistId);
      return true;
    }
  }

  convertKey(key: number): string {
    const keyVals: string[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    if (key === -1 || key > 11) {
      return "Unknown";
    } else{
      return keyVals[key];
    }
  }

  convertMode(mode: number): string {
    return mode ? "Major" : "Minor";
  }

  convertTempo(tempo: number): number {
    return Math.round(tempo);
  }

  convertEnergy(energy: number): string {
    const categoryIndex = Math.floor(energy * 5);
    const categories: string[] = ["Low", "Moderate", "Medium", "High", "Intense", "Max"]
    if (categoryIndex < 0 || categoryIndex > 5) {
      return "Unknown";
    } else {
      return categories[categoryIndex];
    }
  }

  convertValence(valence: number): string {
    const categoryIndex = Math.floor(valence * 5);
    const categories: string[] = ["Sad", "Somber", "Neutral", "Upbeat", "Happy", "Europhoric"]
    if (categoryIndex < 0 || categoryIndex > 5) {
      return "Unknown";
    } else {
      return categories[categoryIndex];
    }
  }

  convertFeaturesRawtoFeatures(featuresRaw: AudioFeaturesRaw): AudioFeatures {
    const {key, mode, tempo, energy, valence} = featuresRaw;
    const newKey = this.convertKey(key);
    const newMode = this.convertMode(mode);
    const newTempo = this.convertTempo(tempo);
    const newEnergy = this.convertEnergy(energy);
    const newValence = this.convertValence(valence);

    return {
      key: newKey,
      mode: newMode,
      tempo: newTempo,
      energy: newEnergy,
      valence: newValence
    }
  }

  async getTrackAudioFeatures(trackId: string) {
    this.resetAudioFeatures();
    const searchObj = { token: this.token, endpoint: `audio-features/${trackId}` };
    try {
      const response: AudioFeaturesRaw = await fetchFromSpotify(searchObj);
      const data = JSON.stringify(response);
      console.log("Response: ", response);
      console.log("Response JSON: ", data);
      const features: AudioFeatures = this.convertFeaturesRawtoFeatures(response);
      this.updateAudioFeatures(features);
      return;
    }
    catch (err) {
      console.log("Error: ", err)
      console.log("Failed to get audio features");
      return;
    }
    return;
  }

  getTracksByPlaylistGenre(genre: string) {
    if (!this.token) {
      this.validateToken();
    }
    console.log("Token: ", this.token);
    const playlistId = this.playlistMapperSource.getValue()[genre];
    const searchObj = { token: this.token, endpoint: `playlists/${playlistId}` };
    let counter = 0;
    try {
      fetchFromSpotify(searchObj)
        .then(response => {
          console.log("Response: ", response);
          const responseTrackList: [] = response["tracks"]["items"];
          if (responseTrackList.length > 0) {
            const tracksRaw: TrackRaw[] = responseTrackList.map(track => {
              const { album, artists, id, preview_url, name } = track["track"];
              if (!preview_url) {
                counter += 1;
                // const previewUrl = this.getPreviewUrl(id);
                return { album, artists, id, preview_url: "empty", name }
              }
              return { album, artists, id, preview_url, name }
            }).filter(track => track.preview_url !== "empty");
            console.log("tracksRaw: ", tracksRaw);

            // Convert tracksRaw into tracks
            this.trackList = this.convertTrackRawToTrack(tracksRaw);
            console.log("Counter: ", counter);
          } else {
            throw new Error("Tracklist is empty");
          }
        });
    }
    catch (err) {
      console.log("Error: ", err)
      console.log("Failed to get playlist");
      return;
    }
  }
  convertTrackRawToTrack(tracksRaw: TrackRaw[]): Track[] {
    return tracksRaw.map(track => {
      const { album, artists, id, preview_url, name } = track
      return { album: album.name, id, preview_url, trackName: name, artist: artists[0]["name"] }
    });
  }

  buildChoicesArray() {
    switch (this.questionTypeSource.getValue()) {
      case "artist":
        const artists: string[] = this.trackList.map((track => track.artist));
        this.choicesList = Array.from(new Set(artists));
        break;
      case "trackName":
        const songs: string[] = this.trackList.map((track => track.trackName));
        this.choicesList = Array.from(new Set(songs));
        break;
      case "album":
        const albums: string[] = this.trackList.map((track => track.album));
        this.choicesList = Array.from(new Set(albums));
        break;
      default:
        const backup: string[] = this.trackList.map((track => track.artist));
        this.choicesList = Array.from(new Set(backup));
        break;
    }
  }

  buildQuestionList() {
    this.buildChoicesArray();
    const questionList: Question[] = this.trackList.map(track => this.buildQuestion(track));
    this.updateQuestionList(this.shuffleArray(questionList));
  }

  buildQuestion(track: Track): Question {
    console.log("Question Type: ", this.questionTypeSource.getValue());
    const correctAnswer = track[this.questionTypeSource.getValue()]
    const choices: [{ text: string, correct: boolean }] = [{ text: correctAnswer, correct: true }];
    const choiceOptions = this.shuffleArray(this.choicesList);
    for (let i = 0; i < choiceOptions.length; i++) {
      if (choices.length >= 4) {
        break;
      }
      const currentItem = choiceOptions[i];
      if (currentItem !== correctAnswer) {
        choices.push({ text: currentItem, correct: false });
      }
    }
    return { trackId: track.id, preview_url: track.preview_url, choices: choices }
  }

  shuffleArray(arr: any) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  findInsertionIndex(arr: UserScore[], userScore: UserScore) {
    let start = 0;
    let end = arr.length;

    while (start < end) {
      let mid = Math.floor((start + end) / 2);
      if (this.compareUserScores(userScore, arr[mid]) <= 0) {
        start = mid + 1;
      } else {
        end = mid;
      }
    }

    return start;
  }

  insertUserScore(arr: UserScore[], userScore: UserScore) {
    const index = this.findInsertionIndex(arr, userScore);
    arr.splice(index, 0, userScore);
  }

  compareUserScores = (user1: UserScore, user2: UserScore) => user1.score - user2.score;

  validateToken() {
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage via Service");
        this.token = storedToken.value;
        return;
      }
    }
    console.log("Token not present or expired");
    console.log("Sending request to AWS endpoint via Service");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      console.log(newToken);
      console.log(JSON.stringify(newToken));
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.token = newToken.value;
      if (!this.token) {
        console.log("Big trouble, couldn't get token");
      }
      return;
    });
  }
}

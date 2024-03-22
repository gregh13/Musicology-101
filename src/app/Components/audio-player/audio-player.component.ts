import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnChanges {

  @Input() audioSrc: string | undefined;

  constructor() { 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['audioSrc'] && !changes['audioSrc'].firstChange) {
      this.reloadAudio();
    }
  }

  private reloadAudio(): void {
    const audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;
    if (audioPlayer) {
      audioPlayer.load()
      audioPlayer.volume = 0.4;
    }
  }

  ngOnInit(): void {
    const audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;
    audioPlayer.volume = 0.4;
  }

}

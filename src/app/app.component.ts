import { Component, OnInit } from "@angular/core";
import { GameService } from "src/services/game.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit{

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.validateToken();
  }
  title: String = "Musicology 101";
}

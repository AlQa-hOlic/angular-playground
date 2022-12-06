import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-html5-test",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./html5-test.component.html",
  styleUrls: ["./html5-test.component.css"],
})
export default class Html5TestComponent {}

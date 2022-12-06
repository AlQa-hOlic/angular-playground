import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { JsonConfigEditorComponent } from "src/app/shared/json-config-editor/json-config-editor.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule, JsonConfigEditorComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export default class HomeComponent {
  configChanged(newConfig: string) {
    alert("Config update: " + JSON.stringify(JSON.parse(newConfig), null, 2));
  }
}

import { getSupportedInputTypes } from "@angular/cdk/platform";
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <div class="flex h-screen flex-col">
      <h1
        class="text-3xl font-bold selection:bg-amber-500 selection:text-white"
      >
        Hello, world!
      </h1>
      <app-json-editor
        (configChanged)="configChanged($event)"
      ></app-json-editor>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  inputTypes = getSupportedInputTypes();

  configChanged(newConfig: string) {
    alert("Config update: " + JSON.stringify(JSON.parse(newConfig), null, 2));
  }
}

import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <h1 class="text-3xl font-bold selection:bg-amber-500 selection:text-white">
      Hello, world!
    </h1>
    <pre>public static void main(String args[]) {{ "{" }}}</pre>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {}

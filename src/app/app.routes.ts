import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () => import("./views/home/home.component"),
  },
  {
    path: "html5-test",
    loadComponent: () => import("./views/html5-test/html5-test.component"),
  },
  {
    path: "**",
    loadComponent: () => import("./views/not-found/not-found.component"),
  },
];

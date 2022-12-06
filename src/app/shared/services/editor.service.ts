import { Injectable } from "@angular/core";
import { BehaviorSubject, ReplaySubject } from "rxjs";

import { tomorrowTheme } from "./editor-theme";

@Injectable({
  providedIn: "root",
})
export class EditorService {
  private _loadingInitiated = new BehaviorSubject<boolean>(false);
  private monacoLoaded = new ReplaySubject<void>();

  get loaded() {
    return this.monacoLoaded.asObservable();
  }

  public load() {
    if (!this._loadingInitiated.getValue()) {
      this._loadingInitiated.next(true);

      new Promise<void>((resolve) => {
        const baseUrl = "./assets";
        if (typeof monaco === "object") {
          resolve();
          return;
        }
        const onGotAmdLoader = () => {
          // Load monaco
          /* eslint-disable @typescript-eslint/no-explicit-any */
          (<any>window).require.config({
            paths: { vs: `${baseUrl}/monaco-editor/min/vs` },
          });
          (<any>window).require([`vs/editor/editor.main`], () => {
            resolve();
          });
        };

        // Load AMD loader if necessary
        if (!window.require) {
          const loaderScript: HTMLScriptElement =
            document.createElement("script");
          loaderScript.type = "text/javascript";
          loaderScript.src = `${baseUrl}/monaco-editor/min/vs/loader.js`;
          loaderScript.addEventListener("load", onGotAmdLoader);
          document.body.appendChild(loaderScript);
        } else {
          onGotAmdLoader();
        }
      }).then(() => {
        monaco.editor.defineTheme("Tomorrow", tomorrowTheme);
        this.monacoLoaded.next();
      });
    }
  }
}

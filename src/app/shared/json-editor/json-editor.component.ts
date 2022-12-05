import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";

import { tomorrowTheme } from "./theme";

let loadedMonaco = false;
let loadedMonacoPromise: Promise<void>;

@Component({
  selector: "app-json-editor",
  standalone: true,
  imports: [CommonModule],
  template: '<div class="editor-container" #editorContainer></div>',
  styleUrls: ["./json-editor.component.css"],
})
export class JsonEditorComponent implements AfterViewInit, OnDestroy {
  private _editor?: monaco.editor.IStandaloneCodeEditor;
  private _value = ["{", '  "p1": "v3",', '  "p2": false', "}"].join("\n");
  private _options: monaco.editor.IStandaloneEditorConstructionOptions = {
    theme: "Tomorrow",
    language: "json",
    contextmenu: false,
    tabSize: 2,
    lineNumbers: "on",
    minimap: {
      autohide: true,
    },
    wordWrap: "wordWrapColumn",
    smoothScrolling: true,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
  };
  private _windowResizeSubscription?: Subscription;

  @ViewChild("editorContainer", { static: true }) _editorContainer!: ElementRef;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    if (loadedMonaco) {
      // Wait until monaco editor is available
      loadedMonacoPromise.then(() => {
        this.initMonaco();
      });
    } else {
      loadedMonaco = true;
      loadedMonacoPromise = new Promise<void>((resolve) => {
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
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
              validate: true,
              allowComments: true,
              schemaValidation: "error",
              schemas: [
                {
                  uri: "http://angular-playground/dynamic-form-schema.json",
                  fileMatch: ["*"],
                  schema: {
                    title: "Dynamic Form Config",
                    description:
                      "Configuration options for customizing the dynamic form",
                    type: "object",
                    additionalProperties: false,
                    required: ["p1"],
                    properties: {
                      p1: {
                        enum: ["v1", "v2"],
                      },
                    },
                  },
                },
              ],
            });
            /* eslint-enable @typescript-eslint/no-explicit-any */

            monaco.editor.defineTheme("Tomorrow", tomorrowTheme);
            this.initMonaco();
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
      });
    }
  }

  initMonaco() {
    const options = this._options;

    options.model = monaco.editor.createModel(this._value, options.language);

    this._editor = monaco.editor.create(
      this._editorContainer.nativeElement,
      options
    );

    if (typeof this._editor === "undefined") return;

    this._editor.setValue(this._value);

    this._editor.onDidChangeModelContent(() => {
      const value = this._editor?.getValue();

      // value is not propagated to parent when executing outside zone.
      this.zone.run(() => {
        this._value = value || "";
      });
    });

    this._editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      this._editor?.getAction("editor.action.formatDocument").run();
      const markers = monaco.editor.getModelMarkers({
        resource: this._options.model?.uri,
      });

      if (markers.length > 0) {
        alert(
          `Error on line ${markers[0].startLineNumber} column ${markers[0].startColumn}: ` +
            markers[0].message
        );
      }
    });

    // refresh layout on resize event.
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    this._windowResizeSubscription = fromEvent(window, "resize").subscribe(() =>
      this._editor?.layout()
    );
  }

  ngOnDestroy() {
    this._windowResizeSubscription?.unsubscribe();
    if (this._editor) {
      this._editor.dispose();
      this._editor = undefined;
    }
  }
}

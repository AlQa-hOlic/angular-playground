import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";

import { EditorService } from "../services/editor.service";

@Component({
  selector: "app-json-editor",
  standalone: true,
  imports: [CommonModule],
  providers: [{ provide: "baseHref", useFactory: () => window.location.href }],
  template: '<div class="editor-container" #editorContainer></div>',
  styleUrls: ["./json-config-editor.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonConfigEditorComponent implements OnDestroy {
  @Input() private _value = JSON.stringify({}, null, 2);

  @Output() configChanged = new EventEmitter<string>();

  @ViewChild("editorContainer", { static: true }) _editorContainer!: ElementRef;

  private _editor?: monaco.editor.IStandaloneCodeEditor;
  private _uri?: monaco.Uri;

  private _options: monaco.editor.IStandaloneEditorConstructionOptions = {
    theme: "Tomorrow",
    language: "json",
    autoDetectHighContrast: false,
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

  constructor(
    private zone: NgZone,
    editorService: EditorService,
    @Inject("baseHref") private baseHref: string
  ) {
    editorService.loaded.subscribe(() => {
      this.initJsonEditor();
    });

    editorService.load();
  }

  initJsonEditor() {
    // Set file URI to use for JSON schema validation
    this._uri = monaco.Uri.parse("dynamic-form:config.json");

    // Setup JSON schema validation for the above URI
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: true,
      schemaValidation: "error",
      enableSchemaRequest: true,
      schemas: [
        {
          uri: `${this.baseHref}assets/dynamic-form-schema.json`,
          fileMatch: [this._uri.toString()],
        },
      ],
    });

    // Create model for the editor state
    this._options.model = monaco.editor.createModel(
      this._value,
      this._options.language,
      this._uri
    );

    // Initialize editor
    this._editor = monaco.editor.create(
      this._editorContainer.nativeElement,
      this._options
    );

    // Set initial value
    this._editor.setValue(this._value);

    // Update value on change
    this._editor.onDidChangeModelContent(() => {
      const value = this._editor?.getValue();

      // value is not propagated to parent when executing outside zone.
      this.zone.run(() => {
        this._value = value || "";
      });
    });

    // Ctrl + S should format, validate and trigger a event to update config
    this._editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      this._editor?.getAction("editor.action.formatDocument").run();
      const markers = monaco.editor.getModelMarkers({
        resource: this._options.model?.uri,
      });

      if (markers.length === 0) {
        this.configChanged.emit(this._value);
      } else {
        alert(
          `Error on line ${markers[0].startLineNumber} column ${markers[0].startColumn}: ` +
            markers[0].message
        );
      }
    });

    // Override F1 to prevent access to the command pallete
    this._editor.addCommand(monaco.KeyCode.F1, () => void 0);

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

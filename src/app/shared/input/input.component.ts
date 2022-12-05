import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-input",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.css"],
})
export class InputComponent {
  @Input() id: string = this.getUniqueId(2);
  @Input() label?: string;
  @Input() icon?: string;
  @Input() placeholder?: string;
  @Input() type?: string;
  @Input() helpText?: string;

  get _type(): string {
    return "date datetime-local email hidden month number password tel text time url week"
      .split(" ")
      .includes(this.type || "text")
      ? this.type || "text"
      : "text";
  }

  /**
   * generate groups of 4 random characters
   * @example getUniqueId(1); // 607f
   * @example getUniqueId(4); // 95ca-361a-f8a1-1e73
   */
  private getUniqueId(parts: number): string {
    const stringArr = [];
    for (let i = 0; i < parts; i++) {
      const S4 = (((1 + Math.random()) * 0x10000) | 0)
        .toString(16)
        .substring(1);
      stringArr.push(S4);
    }
    return stringArr.join("-");
  }
}

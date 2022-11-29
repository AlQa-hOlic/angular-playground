import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // Example service mock test
  // it("should fetch data asynchronously", async () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const component = fixture.componentInstance;
  //   const fakedFetchedList = [
  //     new QuoteModel("I love unit testing", "Mon 4, 2018"),
  //   ];
  //   const quoteService = fixture.debugElement.injector.get(QuoteService);
  //   const spy = spyOn(quoteService, "fetchQuotesFromServer").and.returnValue(
  //     Promise.resolve(fakedFetchedList)
  //   );
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     expect(component.fetchedList).toBe(fakedFetchedList);
  //   });
  // });
});

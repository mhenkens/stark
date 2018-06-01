import { browser, by, element } from "protractor";
/* tslint:disable */
import "tslib";

describe("App", () => {
	beforeEach(async () => {
		await browser.get("/");
	});

	it("should have a title", async () => {
		const subject = await browser.getTitle();
		const result = "Stark Showcase";
		expect(subject).toEqual(result);
	});

	it("should have header", async () => {
		const subject = await element(by.css("h1")).isPresent();
		const result = true;
		expect(subject).toEqual(result);
	});

	it("should have <home>", async () => {
		const subject = await element(by.css("app home")).isPresent();
		const result = true;
		expect(subject).toEqual(result);
	});

	it("should have buttons", async () => {
		const subject = await element(by.css("button")).getText();
		const result = "Submit Value";
		expect(subject).toEqual(result);
	});
});

/* tslint:enable */

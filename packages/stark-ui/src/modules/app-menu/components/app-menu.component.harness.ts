import { ComponentHarness } from "@angular/cdk/testing";

export class StarkAppMenuComponentHarness extends ComponentHarness {
	public static hostSelector = "stark-app-menu";

	public getSectionTitle = this.locatorForOptional(".stark-section-title");
}

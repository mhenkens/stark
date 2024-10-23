import { ComponentHarness } from "@angular/cdk/testing";
import { MatLegacyMenuHarness } from "@angular/material/legacy-menu/testing";

export class StarkAppDataComponentHarness extends ComponentHarness {
	public static hostSelector = "stark-app-data";

	protected getSummary = this.locatorForOptional(".stark-app-data-summary");
	protected getDropdownDiv = this.locatorForOptional(".stark-app-data.dropdown");
	protected getMenuDiv = this.locatorForOptional(".stark-app-data.menu");

	public getDropdownHarness = this.locatorForOptional(MatLegacyMenuHarness);

	public async isSummaryPresent(): Promise<boolean> {
		const detail = await this.getSummary();
		return !!detail;
	}

	public async getSummaryText(): Promise<string | undefined> {
		const summary = await this.getSummary();
		return summary ? summary.text() : undefined;
	}

	public async isDropdownDivPresent(): Promise<boolean> {
		const dropdown = await this.getDropdownDiv();
		return !!dropdown;
	}

	public async isMenuDivPresent(): Promise<boolean> {
		const menu = await this.getMenuDiv();
		return !!menu;
	}

	public async getDropdownDetailContentText(): Promise<string | undefined> {
		const rootLocator = this.documentRootLocatorFactory();
		const element = await rootLocator.locatorForOptional(".mat-menu-content")();
		return element ? element.text() : undefined;
	}

	public async openDropdownDetail(): Promise<void> {
		const matMenuHarness = await this.getDropdownHarness();
		if (matMenuHarness) {
			await matMenuHarness.open();
		}
	}

	public async closeDropdownDetail(): Promise<void> {
		const matMenuHarness = await this.getDropdownHarness();
		if (matMenuHarness) {
			await matMenuHarness.close();
		}
	}
}

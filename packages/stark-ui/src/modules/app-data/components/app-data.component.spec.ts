import { Component, ViewChild } from "@angular/core";
import { StarkAppDataComponent, StarkAppDataComponentMode } from "./app-data.component";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HarnessLoader } from "@angular/cdk/testing";
import { CommonModule } from "@angular/common";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";
import { MatIconTestingModule } from "@angular/material/icon/testing";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { StarkAppDataComponentHarness } from "./app-data.component.harness";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { MatLegacyMenuHarness } from "@angular/material/legacy-menu/testing";

@Component({
	selector: "host-component",
	template: `
		<stark-app-data [mode]="mode">
			<div class="summary-slot">This is the summary</div>
			<div class="detail-slot">This is the detail</div>
		</stark-app-data>
	`
})
class TestHostComponent {
	@ViewChild(StarkAppDataComponent, { static: true })
	public appDataComponent!: StarkAppDataComponent;
	public mode?: StarkAppDataComponentMode;
}

describe("AppDataComponent", () => {
	let component: StarkAppDataComponent;
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;
	let loader: HarnessLoader;

	const detailSlotContent = "This is the detail";
	const summarySlotContent = "This is the summary";

	const mockLogger: MockStarkLoggingService = new MockStarkLoggingService();

	let starkAppDataHarness: StarkAppDataComponentHarness;

	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			declarations: [StarkAppDataComponent, TestHostComponent],
			imports: [
				CommonModule,
				MatButtonModule,
				MatIconModule,
				MatIconTestingModule,
				MatMenuModule,
				MatTooltipModule,
				NoopAnimationsModule,
				TranslateModule.forRoot()
			],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: mockLogger }, TranslateService]
		}).compileComponents()));

	beforeEach(async () => {
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		component = hostComponent.appDataComponent;
		loader = TestbedHarnessEnvironment.loader(hostFixture);
		hostFixture.detectChanges();
		starkAppDataHarness = await loader.getHarness(StarkAppDataComponentHarness);
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(hostFixture).toBeDefined();
			expect(hostComponent).toBeDefined();
			expect(component).toBeDefined();

			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();
		});
	});

	describe("using 'dropdown' mode", () => {
		beforeEach(async () => {
			hostComponent.mode = "dropdown";
			hostFixture.detectChanges();
		});

		it("dropdown div should be present", async () => {
			expect(await starkAppDataHarness.isDropdownDivPresent()).toBeTrue();
		});

		it("menu div should NOT be present", async () => {
			expect(await starkAppDataHarness.isMenuDivPresent()).toBeFalse();
		});

		describe("summary", () => {
			it("should display the summary content", async () => {
				expect(await starkAppDataHarness.isSummaryPresent()).toBeTrue();
				expect(await starkAppDataHarness.getSummaryText()).toBe(summarySlotContent);
			});
		});

		describe("detail", () => {
			it("detail information should NOT be displayed on init", async () => {
				const menu = await starkAppDataHarness.getDropdownHarness();
				expect(menu).toBeDefined();
				expect(menu).not.toBeNull();
				expect(menu ? await menu.isOpen() : true).toBeFalse();
			});

			describe("open detail", () => {
				let menu: MatLegacyMenuHarness;
				beforeEach(async () => {
					const m = await starkAppDataHarness.getDropdownHarness();
					if (m) {
						menu = m;
					} else {
						fail("Menu not found");
					}
					await menu.open();
				});

				it("clicking button should display detail information", async () => {
					expect(await menu.isOpen()).toBeTrue();
					expect(await starkAppDataHarness.getDropdownDetailContentText()).toBe(detailSlotContent);
				});

				it("closing popup should hide the detail", async () => {
					await menu.close();
					expect(await menu.isOpen()).toBeFalse();
					expect(await starkAppDataHarness.getDropdownDetailContentText()).not.toBeDefined();
				});
			});
		});
	});

	describe("using 'menu' mode", () => {
		beforeEach(() => {
			hostComponent.mode = "menu";
			hostFixture.detectChanges();
		});

		it("dropdown div should NOT be present", async () => {
			expect(await starkAppDataHarness.isDropdownDivPresent()).toBeFalse();
		});

		it("menu div should be present", async () => {
			expect(await starkAppDataHarness.isMenuDivPresent()).toBeTrue();
		});

		describe("summary", () => {
			it("should NOT display the summary content", async () => {
				expect(await starkAppDataHarness.getSummaryText()).toBeUndefined();
			});
		});

		describe("detail", () => {
			it("detail information should NOT be displayed on init", async () => {
				expect(await starkAppDataHarness.getDropdownDetailContentText()).toBeUndefined();
			});

			describe("open detail", () => {
				beforeEach(async () => {
					await starkAppDataHarness.openDropdownDetail();
				});

				it("should display detail information", async () => {
					expect(await starkAppDataHarness.getDropdownDetailContentText()).toBe(detailSlotContent);
				});

				it("when closed should hide the detail", async () => {
					await starkAppDataHarness.closeDropdownDetail();
					expect(await starkAppDataHarness.getDropdownDetailContentText()).toBeUndefined();
				});
			});
		});
	});
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
	StarkActionBarComponent,
	StarkActionBarComponentMode
} from "@nationalbankbelgium/stark-ui/src/modules/action-bar/components/action-bar.component";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";
import { MatIconTestingModule } from "@angular/material/icon/testing";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { Component, ViewChild } from "@angular/core";
import { StarkActionBarConfig } from "@nationalbankbelgium/stark-ui/src/modules/action-bar/components/action-bar-config.intf";
import { StarkAction } from "@nationalbankbelgium/stark-ui/src/modules/action-bar/components/action.intf";
import { HarnessLoader } from "@angular/cdk/testing";
import createSpy = jasmine.createSpy;
import { MatButtonHarness } from "@angular/material/button/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";

describe("ActionBarComponent", () => {
	@Component({
		selector: "host-component",
		template: `
			<stark-action-bar
				[mode]="mode"
				[actionBarId]="actionBarId"
				[actionBarConfig]="actionBarConfig"
				[alternativeActions]="alternativeActions"
			></stark-action-bar>
		`
	})
	class TestHostComponent {
		@ViewChild(StarkActionBarComponent, { static: true })
		public starkActionBar!: StarkActionBarComponent;

		public mode?: StarkActionBarComponentMode;
		public actionBarId?: string;
		public actionBarConfig: StarkActionBarConfig = { actions: [] };
		public alternativeActions?: StarkAction[];
	}

	let hostFixture: ComponentFixture<TestHostComponent>;
	let hostComponent: TestHostComponent;
	let component: StarkActionBarComponent;
	let loader: HarnessLoader;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [StarkActionBarComponent, TestHostComponent],
			imports: [MatButtonModule, MatIconModule, MatIconTestingModule, MatMenuModule, MatTooltipModule, TranslateModule.forRoot()],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }, TranslateService]
		}).compileComponents();

		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;

		const demoActions: StarkAction[] = [
			{
				id: "userDetailValidate",
				label: "Validate",
				icon: "check",
				actionCall: createSpy("actionCallSpy"),
				isEnabled: false,
				isVisible: true
			},
			{
				id: "userDetailSave",
				label: "Save",
				icon: "content-save",
				actionCall: createSpy("actionCallSpy"),
				isEnabled: true,
				isVisible: true
			}
		];

		hostComponent.actionBarConfig = {
			actions: demoActions,
			isPresent: true
		};
		hostFixture.detectChanges();
		component = hostComponent.starkActionBar;

		loader = TestbedHarnessEnvironment.loader(hostFixture);
	});

	describe("@Input() mode", () => {
		it("should have the toggle action bar button visible in full mode", async () => {
			hostComponent.mode = "full";
			hostFixture.detectChanges();

			const extendActionBarButton = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: ".extend-action-bar" }));

			expect(extendActionBarButton).toBeDefined();
		});

		it("should not have the toggle action bar button visible in compact mode", async () => {
			hostComponent.mode = "compact";
			hostFixture.detectChanges();

			const extendActionBarButton = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: ".extend-action-bar" }));

			expect(extendActionBarButton).toBeNull();
		});
	});

	describe("@Input() actionBarId", () => {
		it("should have set the id of the action bar", () => {
			hostComponent.actionBarId = "action-bar-id";
			hostFixture.detectChanges();

			const actionBar: HTMLElement = hostFixture.nativeElement.querySelector("#" + hostComponent.actionBarId);
			expect(actionBar).toBeDefined();
		});
	});

	describe("@Input() actionBarConfig", () => {
		it("should not call the defined action when disabled", async () => {
			const buttonHarness: MatButtonHarness[] = await loader.getAllHarnesses(
				MatButtonHarness.with({ selector: ".stark-action-bar-action" })
			);
			await buttonHarness[0].click();
			expect(hostComponent.actionBarConfig.actions[0].actionCall).not.toHaveBeenCalled();
		});

		it("should not call the defined action when disabled", async () => {
			const buttonHarness: MatButtonHarness[] = await loader.getAllHarnesses(
				MatButtonHarness.with({ selector: ".stark-action-bar-action" })
			);
			await buttonHarness[1].click();
			expect(hostComponent.actionBarConfig.actions[1].actionCall).toHaveBeenCalledTimes(1);
		});
	});

	describe("@Input() alternativeActions", () => {
		beforeEach(() => {
			hostComponent.alternativeActions = hostComponent.actionBarConfig.actions;
			hostFixture.detectChanges();
		});

		it("should display", async () => {
			const menuButton = await loader.getHarnessOrNull(MatButtonHarness.with({ selector: ".open-alt-actions" }));
			expect(menuButton).not.toBeNull();
		});
	});

	describe("toggle extended action bar", () => {
		it("should toggle the extended action bar", async () => {
			hostComponent.mode = "full";
			hostFixture.detectChanges();

			spyOn(component, "toggleExtendedActionBar").and.callThrough();

			const buttonHarness = await loader.getHarness(
				MatButtonHarness.with({
					selector: ".extend-action-bar"
				})
			);

			await buttonHarness.click();
			hostFixture.detectChanges();
			expect(component.toggleExtendedActionBar).toHaveBeenCalledTimes(1);
			expect(component.isExtended).toBeTrue();

			await buttonHarness.click();
			hostFixture.detectChanges();
			expect(component.toggleExtendedActionBar).toHaveBeenCalledTimes(2);
			expect(component.isExtended).toBeFalse();
		});
	});
});

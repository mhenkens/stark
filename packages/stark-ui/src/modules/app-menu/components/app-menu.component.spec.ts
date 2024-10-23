import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { MatLegacyListModule as MatListModule } from "@angular/material/legacy-list";
import { MatIconModule } from "@angular/material/icon";
import { MatIconTestingModule } from "@angular/material/icon/testing";
import { StarkAppMenuComponent } from "./app-menu.component";
import { StarkAppMenuItemComponent } from "./app-menu-item.component";
import { UIRouterModule } from "@uirouter/angular";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader } from "@angular/cdk/testing";
import { StarkAppMenuComponentHarness } from "./app-menu.component.harness";

describe("AppMenuComponent", () => {
	let component: StarkAppMenuComponent;
	let fixture: ComponentFixture<StarkAppMenuComponent>;
	let loader: HarnessLoader;
	let appMenuHarness: StarkAppMenuComponentHarness;

	/**
	 * async beforeEach
	 */
	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			declarations: [StarkAppMenuComponent, StarkAppMenuItemComponent],
			imports: [MatIconModule, MatIconTestingModule, MatListModule, UIRouterModule],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: STARK_ROUTING_SERVICE, useClass: MockStarkRoutingService }
			]
		})
			/**
			 * Compile template and css
			 */
			.compileComponents()));

	/**
	 * Synchronous beforeEach
	 */
	beforeEach(async () => {
		fixture = TestBed.createComponent(StarkAppMenuComponent);
		component = fixture.componentInstance;
		loader = TestbedHarnessEnvironment.loader(fixture);
		appMenuHarness = await loader.getHarness(StarkAppMenuComponentHarness);
	});

	describe("sections", () => {
		it("should have a section when menuSections property of menuConfig is set", async () => {
			component.menuConfig = {
				menuSections: [
					{
						label: "Section",
						menuGroups: [
							{
								id: "id-item",
								label: "Label",
								isVisible: true,
								isEnabled: true,
								targetState: "test"
							}
						]
					}
				]
			};
			fixture.detectChanges();
			const sectionTitle = await appMenuHarness.getSectionTitle();
			expect(sectionTitle).not.toBeNull();
			expect(sectionTitle).toBeDefined();
		});
	});
});

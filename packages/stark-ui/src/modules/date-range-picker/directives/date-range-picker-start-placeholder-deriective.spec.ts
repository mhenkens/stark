import { Component } from "@angular/core";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { StarkDateRangePickerEndPlaceholderDirective } from "@nationalbankbelgium/stark-ui/src/modules/date-range-picker/directives/date-range-picker-end-placeholder-directive";
import { TranslateModule } from "@ngx-translate/core";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { MatStartDateHarness } from "@angular/material/datepicker/testing";
import { MatFormFieldModule } from "@angular/material/form-field";

describe("StarkDateRangePickerStartPlaceholderDirective", () => {
	@Component({
		selector: "test-component",
		template: ` <mat-form-field>
			<mat-date-range-input [rangePicker]="rangePicker">
				<input matStartDate starkDateRangePikerPlaceHolder />
				<input matEndDate />
			</mat-date-range-input>
			<mat-datepicker-toggle matSuffix [for]="rangePicker"></mat-datepicker-toggle>
			<mat-date-range-picker #rangePicker></mat-date-range-picker>
		</mat-form-field>`
	})
	class TestComponent {}

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [MatDatepickerModule, MatFormFieldModule, NoopAnimationsModule, TranslateModule.forRoot()],
			declarations: [StarkDateRangePickerEndPlaceholderDirective, TestComponent],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
				{ provide: MAT_DATE_LOCALE, useValue: "en-us" },
				{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
			]
		}).compileComponents();
	}));

	describe("defaultPlaceHolderValue", () => {
		let loader: HarnessLoader;

		beforeEach(waitForAsync(() => {
			const fixture = TestBed.createComponent(TestComponent);
			fixture.detectChanges();
			loader = TestbedHarnessEnvironment.loader(fixture);
		}));

		it("should have the default placeholder value", async () => {
			const matStartDateHarness = await loader.getHarness(MatStartDateHarness);

			expect(await matStartDateHarness.getPlaceholder()).toBe("Start date");
		});
	});
});

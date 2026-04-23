import { Component } from "@angular/core";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { StarkDateRangePickerStartPlaceholderDirective } from "./date-range-picker-start-placeholder-directive";
import { TranslateService } from "@ngx-translate/core";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { MatStartDateHarness } from "@angular/material/datepicker/testing";
import { MatFormFieldModule } from "@angular/material/form-field";
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe("StarkDateRangePickerStartPlaceholderDirective", () => {
	const mockTranslateService: SpyObj<TranslateService> = createSpyObj("TranslationsService", ["instant"]);
	mockTranslateService.instant.and.callFake((key: string) => {
		if (key === "STARK.DATE_RANGE_PICKER.FROM") {
			return "Start date";
		}
		return key;
	});

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

	@Component({
		selector: "test-component-with-param",
		template: ` <mat-form-field>
			<mat-date-range-input [rangePicker]="rangePicker">
				<input matStartDate [starkDateRangePikerPlaceHolder]="placeholderValue" />
				<input matEndDate />
			</mat-date-range-input>
			<mat-datepicker-toggle matSuffix [for]="rangePicker"></mat-datepicker-toggle>
			<mat-date-range-picker #rangePicker></mat-date-range-picker>
		</mat-form-field>`
	})
	class TestWithParamComponent {
		public placeholderValue = "Custom placeholder";
	}

	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			imports: [MatDatepickerModule, MatFormFieldModule, NoopAnimationsModule],
			declarations: [StarkDateRangePickerStartPlaceholderDirective, TestComponent, TestWithParamComponent],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
				{ provide: MAT_DATE_LOCALE, useValue: "en-us" },
				{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
				{ provide: TranslateService, useValue: mockTranslateService }
			]
		}).compileComponents()));

	describe("defaultPlaceHolderValue", () => {
		let loader: HarnessLoader;

		beforeEach(waitForAsync(() => {
			const fixture = TestBed.createComponent(TestComponent);
			fixture.detectChanges();
			loader = TestbedHarnessEnvironment.loader(fixture);
		}));

		it("should have the default placeholder value", async () => {
			expect(mockTranslateService.instant).toHaveBeenCalledWith("STARK.DATE_RANGE_PICKER.FROM");
			const matStartDateHarness = await loader.getHarness(MatStartDateHarness);
			expect(await matStartDateHarness.getPlaceholder()).toBe("Start date");
		});

		afterEach(() => {
			mockTranslateService.instant.calls.reset();
		});
	});

	describe("CustomPlaceHolderValue", () => {
		let loader: HarnessLoader;

		beforeEach(waitForAsync(() => {
			const fixture = TestBed.createComponent(TestWithParamComponent);
			fixture.detectChanges();
			loader = TestbedHarnessEnvironment.loader(fixture);
		}));

		it("should have the custom placeholder value", async () => {
			expect(mockTranslateService.instant).toHaveBeenCalledWith("Custom placeholder");
			const matStartDateHarness = await loader.getHarness(MatStartDateHarness);
			expect(await matStartDateHarness.getPlaceholder()).toBe("Custom placeholder");
		});

		afterEach(() => {
			mockTranslateService.instant.calls.reset();
		});
	});
});

import { Component } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { StarkMatDatepickerMaskDirective } from "./mat-datepicker-mask-directive";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatMomentDateModule, MomentDateAdapter } from "@angular/material-moment-adapter";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import moment from "moment";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { STARK_DATE_FORMATS } from "../components/date-format.constants";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

@Component({
	selector: "host-componet",
	template: `
		<mat-form-field>
			<mat-label>date</mat-label>
			<input matInput [matDatepicker]="pickerReactiveForm" [formControl]="formControl" required starkDateMask />
			<mat-datepicker-toggle matIconSuffix [for]="pickerReactiveForm"></mat-datepicker-toggle>
			<mat-datepicker #pickerReactiveForm></mat-datepicker>
		</mat-form-field>
	`
})
class TestHostComponent {
	public formControl = new FormControl<moment.Moment>(moment());
}

describe("MatDatepickerMaskDirective", () => {
	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			declarations: [StarkMatDatepickerMaskDirective, TestHostComponent],
			imports: [
				MatDatepickerModule,
				MatFormFieldModule,
				MatInputModule,
				MatMomentDateModule,
				FormsModule,
				ReactiveFormsModule,
				TranslateModule.forRoot(),
				NoopAnimationsModule
			],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: MAT_DATE_FORMATS, useValue: STARK_DATE_FORMATS },
				{ provide: MAT_DATE_LOCALE, useValue: "en-us" },
				{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
			]
		})));

	describe("FormControl", () => {
		let hostComponent: TestHostComponent;
		let hostFixture: ComponentFixture<TestHostComponent>;
		let dateAdapter: DateAdapter<moment.Moment>;

		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostComponent);
			hostComponent = hostFixture.componentInstance;
			hostFixture.detectChanges();
			dateAdapter = TestBed.inject(DateAdapter);
		});

		it("Should display date as literal format", () => {
			const now = moment();
			hostComponent.formControl.setValue(now);
			hostFixture.detectChanges();

			const formFieldDebugElement = hostFixture.debugElement.query(By.directive(MatFormField));
			const expectedDateFormat = dateAdapter.format(now, STARK_DATE_FORMATS);
			expect(formFieldDebugElement.nativeElement.value).toBe(expectedDateFormat);
		});
	});
});

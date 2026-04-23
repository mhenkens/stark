import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

const STARK_DATE_RANGE_PICKER_START_PLACEHOLDER_DEFAULT = "STARK.DATE_RANGE_PICKER.FROM";
export type StarkDateRangePickerStartPlaceholderType = typeof STARK_DATE_RANGE_PICKER_START_PLACEHOLDER_DEFAULT | string | undefined;

@Directive({
	selector: "input [matStartDate] [starkDateRangePikerPlaceHolder]",
	exportAs: "starkDateRangePikerStart"
})
export class StarkDateRangePickerStartPlaceholderDirective implements OnChanges, OnInit {
	public constructor(
		private translateService: TranslateService,
		private hostComponent: ElementRef<HTMLInputElement>
	) {
		console.debug("StarkDateRangePickerStartPlaceholderDirective starkDateRangePickerStartPlaceholder");
	}

	@Input()
	public starkDateRangePikerPlaceHolder: StarkDateRangePickerStartPlaceholderType = STARK_DATE_RANGE_PICKER_START_PLACEHOLDER_DEFAULT;

	public ngOnInit(): void {
		this.updatePlaceholder();
	}

	public ngOnChanges(_changes: SimpleChanges): void {
		if (_changes["starkDateRangePikerPlaceHolder"]) {
			this.updatePlaceholder();
		}
	}

	private updatePlaceholder(): void {
		console.log(this.starkDateRangePikerPlaceHolder);
		console.log(typeof this.starkDateRangePikerPlaceHolder);
		if (typeof this.starkDateRangePikerPlaceHolder === "string") {
			if (this.starkDateRangePikerPlaceHolder !== "") {
				this.hostComponent.nativeElement.placeholder = this.translateService.instant(this.starkDateRangePikerPlaceHolder);
			} else {
				this.hostComponent.nativeElement.placeholder = this.translateService.instant(
					STARK_DATE_RANGE_PICKER_START_PLACEHOLDER_DEFAULT
				);
			}
		} else {
			this.hostComponent.nativeElement.placeholder = "";
		}
	}
}

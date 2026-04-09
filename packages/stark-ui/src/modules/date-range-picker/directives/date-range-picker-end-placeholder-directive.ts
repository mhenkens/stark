import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

const STARK_DATE_RANGE_PICKER_END_PLACEHOLDER_DEFAULT = "STARK.DATE_RANGE_PICKER.TO";
export type StarkDateRangePickerEndPlaceholderType = typeof STARK_DATE_RANGE_PICKER_END_PLACEHOLDER_DEFAULT | string | undefined;

@Directive({
	selector: "input [matEndDate] [starkDateRangePikerPlaceHolder]",
	exportAs: "starkDateRangePikerStart"
})
export class StarkDateRangePickerEndPlaceholderDirective implements OnChanges, OnInit {
	public constructor(
		private translateService: TranslateService,
		private hostComponent: ElementRef<HTMLInputElement>
	) {}

	@Input()
	public starkDateRangePikerPlaceHolder: StarkDateRangePickerEndPlaceholderType = STARK_DATE_RANGE_PICKER_END_PLACEHOLDER_DEFAULT;

	public ngOnInit(): void {
		this.updatePlaceholder();
	}

	public ngOnChanges(_changes: SimpleChanges): void {
		if (_changes["starkDateRangePikerPlaceHolder"]) {
			this.updatePlaceholder();
		}
	}

	private updatePlaceholder(): void {
		if (typeof this.starkDateRangePikerPlaceHolder === "string") {
			if (this.starkDateRangePikerPlaceHolder !== "") {
				this.hostComponent.nativeElement.placeholder = this.translateService.instant(this.starkDateRangePikerPlaceHolder);
			} else {
				this.hostComponent.nativeElement.placeholder = this.translateService.instant(
					STARK_DATE_RANGE_PICKER_END_PLACEHOLDER_DEFAULT
				);
			}
		} else {
			this.hostComponent.nativeElement.placeholder = "";
		}
	}
}

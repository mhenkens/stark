import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Directive({
	selector: "input [matStartDate] [starkDateRangePikerPlaceHolder]",
	exportAs: "starkDateRangePikerStart"
})
export class StarkDateRangePickerStartPlaceholder implements OnChanges, OnInit {
	public constructor(
		private translateService: TranslateService,
		private hostComponent: ElementRef<HTMLInputElement>
	) {}

	@Input()
	public starkDateRangePikerPlaceHolder = "STARK.DATE_RANGE_PICKER.FROM";

	public ngOnInit() {
		this.hostComponent.nativeElement.placeholder = this.translateService.instant(this.starkDateRangePikerPlaceHolder);
	}

	public ngOnChanges(_changes: SimpleChanges) {
		console.log("_changes", this.starkDateRangePikerPlaceHolder);
		this.hostComponent.nativeElement.placeholder = this.translateService.instant(this.starkDateRangePikerPlaceHolder);
	}
}

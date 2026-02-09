import { Directive, ElementRef, Inject, Input, Optional, Renderer2 } from "@angular/core";
import { MAT_DATE_FORMATS, MatDateFormats } from "@angular/material/core";
import { COMPOSITION_BUFFER_MODE } from "@angular/forms";
import {
	isStarkTimestampMaskConfig,
	StarkTimestampMaskConfig,
	StarkTimestampMaskDirective
} from "@nationalbankbelgium/stark-ui/src/modules/input-mask-directives";
import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import moment from "moment";

const directiveName = "starkDateMask";

/**
 * Type expected by [StarkDatePickerComponent maskConfig]{@link StarkDatePickerComponent#maskConfig} input.
 */
export type StarkMatDatepickerMaskConfig = StarkTimestampMaskConfig | boolean;

/**
 * Default date mask configuration used by the {@link StarkDatePickerComponent}
 */
export const DEFAULT_DATE_MASK_CONFIG_DIRECTIVE: StarkTimestampMaskConfig = { format: "DD/MM/YYYY" };

/**
 * This directive apply the timestampMask directive to the matDatepicker input
 */
@Directive({
	host: {
		"(input)": "_handleInput($event.target.value)",
		"(blur)": "onBlur()",
		"(focus)": "onFocus($event)",
		"(compositionstart)": "_compositionStart()",
		"(compositionend)": "_compositionEnd($event.target.value)"
	},
	selector:
		"input [matInput][matDatepicker][" +
		directiveName +
		"]," +
		"input [matStartDate][" +
		directiveName +
		"]," +
		"input [matEndDate][" +
		directiveName +
		"]",
	exportAs: "starkDateMask"
})
export class StarkMatDatepickerMaskDirective extends StarkTimestampMaskDirective {
	public constructor(
		@Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats,
		_renderer: Renderer2,
		_elementRef: ElementRef,
		@Optional() @Inject(COMPOSITION_BUFFER_MODE) _compositionMode: boolean
	) {
		super(_renderer, _elementRef, _compositionMode);
	}

	/**
	 * Use to store the current maskConfig
	 */
	private dateMaskConfig?: StarkTimestampMaskConfig = undefined;

	/**
	 * Timestamp Mask Configuration to apply on the date-picker.
	 * - If `true` is passed, the default mask config is applied: {@link DEFAULT_DATE_MASK_CONFIG}
	 * - If `false` is passed or if `dateMask` is not present, the directive is disabled.
	 * - If a {@link StarkTimestampMaskConfig} is passed, it is set as the date mask config.
	 */
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input(directiveName)
	public set dateMask(value: StarkMatDatepickerMaskConfig) {
		if (isStarkTimestampMaskConfig(value)) {
			// only valid configs will be passed to the mask directive
			this.dateMaskConfig = value;
		} else if (typeof value !== "object") {
			this.dateMaskConfig = coerceBooleanProperty(value) ? DEFAULT_DATE_MASK_CONFIG_DIRECTIVE : undefined;
		} else {
			throw new Error(
				directiveName + ": the provided dateMask is not of type `StarkDatePickerMaskConfig`. Please provide a correct value."
			);
		}

		if (isStarkTimestampMaskConfig(this.dateMaskConfig)) {
			const dateInputFormats: string[] =
				this.dateFormats.parse.dateInput instanceof Array ? this.dateFormats.parse.dateInput : [this.dateFormats.parse.dateInput];

			const isValidParser: boolean = dateInputFormats.some((format: string) =>
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				moment("01-12-10", format).isSame(moment("01-12-10", this.dateMaskConfig!.format), "day")
			);
			if (!isValidParser) {
				throw new Error(
					directiveName +
						': dateMask.format ["' +
						this.dateMaskConfig.format +
						'"] and the provided parse format(s) in MAT_DATE_FORMATS ["' +
						dateInputFormats.join('","') +
						'"] are NOT compatible. Please adapt one of them.'
				);
			}
		}
	}

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_dateMask: BooleanInput | StarkMatDatepickerMaskConfig;

	/**
	 * Method triggered when the date-picker input is focused.
	 * This method changes the displayed value to make the starkTimestampInput directive working and enables the directive.
	 *
	 * @param focusEvent - The focus event
	 */
	public onFocus(focusEvent: FocusEvent): void {
		// FIXME Investigate this later.
		// Is there a way built-in in Angular Material to do this ?
		if (this.dateMaskConfig && focusEvent.target && focusEvent.target instanceof HTMLInputElement) {
			const focusValue: string | null = focusEvent.target.value;
			if (focusValue) {
				focusEvent.target.value = moment(focusValue, this.dateFormats.display.dateInput).format(this.dateMaskConfig.format);
			}
		}

		this.maskConfig = this.dateMaskConfig;
		this.textMaskConfig = this.normalizeMaskConfig(this.maskConfig);
		// trigger ngOnChanges to apply the mask when focus in
		super.ngOnChanges({});
	}

	/**
	 * Method triggered when the date-picker input is blurred.
	 * This method disables the starkTimestampInput directive.
	 */
	public onBlur(): void {
		this.maskConfig = undefined;
		this.textMaskConfig = this.normalizeMaskConfig(this.maskConfig);
		// trigger ngOnChanges to disable the mask when focus out
		super.ngOnChanges({});
	}
}

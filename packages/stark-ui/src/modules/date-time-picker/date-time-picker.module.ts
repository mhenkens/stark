import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { StarkLocale } from "@nationalbankbelgium/stark-core";
import { StarkDatePickerModule } from "@nationalbankbelgium/stark-ui/src/modules/date-picker";
import { StarkInputMaskDirectivesModule } from "@nationalbankbelgium/stark-ui/src/modules/input-mask-directives";
import { StarkDateTimePickerComponent } from "./components/date-time-picker.component";
import { translationsEn } from "./assets/translations/en";
import { translationsFr } from "./assets/translations/fr";
import { translationsNl } from "./assets/translations/nl";
import { mergeUiTranslations } from "@nationalbankbelgium/stark-ui/src/common";

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatTooltipModule,
		FormsModule,
		ReactiveFormsModule,
		StarkDatePickerModule,
		StarkInputMaskDirectivesModule,
		TranslateModule
	],
	declarations: [StarkDateTimePickerComponent],
	exports: [StarkDateTimePickerComponent]
})
export class StarkDateTimePickerModule {
	/**
	 * Class constructor
	 * @param translateService - The `TranslateService` instance of the application.
	 */
	public constructor(translateService: TranslateService) {
		const english: StarkLocale = { languageCode: "en", translations: translationsEn };
		const french: StarkLocale = { languageCode: "fr", translations: translationsFr };
		const dutch: StarkLocale = { languageCode: "nl", translations: translationsNl };
		mergeUiTranslations(translateService, english, french, dutch);
	}
}

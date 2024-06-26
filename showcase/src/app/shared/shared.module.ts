import { DateAdapter } from "@angular/material/core";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyListModule as MatListModule } from "@angular/material/legacy-list";
import { MatLegacySnackBarModule as MatSnackBarModule } from "@angular/material/legacy-snack-bar";
import { MatLegacyTabsModule as MatTabsModule } from "@angular/material/legacy-tabs";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Inject, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
	STARK_APP_METADATA,
	STARK_SESSION_SERVICE,
	StarkApplicationMetadata,
	StarkLanguage,
	StarkSessionService
} from "@nationalbankbelgium/stark-core";
import { UIRouterModule } from "@uirouter/angular";
import moment from "moment";
import { filter } from "rxjs/operators";
import { ReferenceBlockComponent, TableOfContentsComponent } from "./components";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		FlexLayoutModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatExpansionModule,
		MatIconModule,
		MatListModule,
		MatTabsModule,
		MatTooltipModule,
		MatSnackBarModule,
		TranslateModule,
		UIRouterModule.forChild()
	],
	declarations: [ReferenceBlockComponent, TableOfContentsComponent],
	// export commonly used components/directives/components (see https://angular.io/guide/sharing-ngmodules)
	exports: [
		ReferenceBlockComponent,
		TableOfContentsComponent,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		FlexLayoutModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatExpansionModule,
		MatIconModule,
		MatListModule,
		MatTabsModule,
		MatTooltipModule,
		MatSnackBarModule,
		TranslateModule
	]
})
export class SharedModule {
	public constructor(
		@Inject(STARK_APP_METADATA) private appMetadata: StarkApplicationMetadata,
		@Inject(STARK_SESSION_SERVICE) private sessionService: StarkSessionService,
		private dateAdapter: DateAdapter<any>
	) {
		/**
		 * When the application language changes, the Moment locale and the Material Moment Adapter (internally used by Stark Date Pickers) should be changed as well
		 * FIXME: currently this logic cannot be implemented in the AppModule and should be implemented in a different module instead (see https://github.com/angular/components/issues/15419)
		 */
		this.sessionService
			.getCurrentLanguage()
			.pipe(filter((currentLang?: string): currentLang is string => typeof currentLang !== "undefined"))
			.subscribe((currentLang: string) => {
				const matchingAppLanguage: StarkLanguage | undefined = this.appMetadata.supportedLanguages.filter(
					(language: StarkLanguage) => language.code === currentLang
				)[0];

				// change the Moment locale to the matching locale from AppMetadata or use the 'currentLang' instead if no locale matched
				// IMPORTANT: Moment won't change the locale (it will keep the current one) if it doesn't know the locale specified
				const momentLocale = matchingAppLanguage
					? moment.locale(matchingAppLanguage.isoCode.toLowerCase())
					: moment.locale(currentLang);

				// finally, the locale of the Material Moment Adapter should be set
				this.dateAdapter.setLocale(momentLocale);
			});
	}
}

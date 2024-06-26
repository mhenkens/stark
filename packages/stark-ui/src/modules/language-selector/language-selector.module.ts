import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { StarkLanguageSelectorComponent } from "./components";
import { StarkDropdownModule } from "@nationalbankbelgium/stark-ui/src/modules/dropdown";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";

@NgModule({
	declarations: [StarkLanguageSelectorComponent],
	imports: [CommonModule, MatButtonToggleModule, StarkDropdownModule, MatFormFieldModule],
	exports: [StarkLanguageSelectorComponent]
})
export class StarkLanguageSelectorModule {}

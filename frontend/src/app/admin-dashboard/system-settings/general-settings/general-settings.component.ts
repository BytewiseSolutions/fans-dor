import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-general-settings',
   standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss'
})
export class GeneralSettingsComponent { 
  @Output() settingsChange = new EventEmitter<any>();

  localSettings: any = {};

    @Input() settings = {
    siteName: '',
    currency: 'USD',
    siteDescription: '',
    maintenanceMode: false
  };
   ngOnChanges() {
    this.localSettings = { ...this.settings };
  }

   onChange(field: string, value: any) {
    this.settingsChange.emit({ [field]: value });
  }
}

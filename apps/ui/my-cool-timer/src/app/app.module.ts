import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClockComponent } from './clock/clock.component';
import { ClockService } from './clock/clock.service';
import { TimeFormat } from './pipes/time.format';

@NgModule({
  declarations: [AppComponent, ClockComponent, TimeFormat],
  imports: [BrowserModule],
  providers: [ClockService],
  bootstrap: [AppComponent],
})
export class AppModule {}

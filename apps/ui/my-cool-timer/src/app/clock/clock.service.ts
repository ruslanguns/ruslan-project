import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface IClock {
  seconds: number;
  minutes: number;
  hours: number;
  totalTime: number; // mm
}

@Injectable()
export class ClockService {

  private state = new BehaviorSubject<IClock>({
    seconds: 0,
    minutes: 0,
    hours: 0,
    totalTime: 0,
  });

  action$ = this.state.asObservable();
  
  /**
   * Un metodo para actualizar el state del timer.
   * @param value el valor de la propiedad del comando
   * @param command 'seconds'|'hours'|'minutes'
   */
  updateState(value: number, command: string) {
    if(value < 0 ) value = 0;

    const update = this.state.value;
    update[command] = value;

    update.totalTime = this.convertToSeconds(update);
    this.state.next(update)
  }

  convertToSeconds(update: IClock) {
    const seconds = update.seconds;
    const minutesToSeconds = update.minutes * 60;
    const hoursToSeconds = (update.hours * 60) * 60; 
    return seconds + minutesToSeconds + hoursToSeconds;
  }

  getSeconds() {
    return this.state.value.seconds;
  }
  getMinutes() {
    return this.state.value.minutes;
  }
  getHours() {
    return this.state.value.hours;
  }
  getTotalSeconds() {
    return this.state.value.totalTime;
  }

}
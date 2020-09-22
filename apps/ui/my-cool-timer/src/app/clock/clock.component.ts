import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { fromEvent, interval, merge, Observable, of, Subject } from 'rxjs';
import { mapTo, scan, switchMap } from 'rxjs/operators';
import { ClockService } from './clock.service';


@Component({
  selector: 'ruslan-project-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements AfterViewInit {
  @ViewChild('start', { static: true })
  startBtn: ElementRef;

  @ViewChild('pause', { static: true })
  pauseBtn: ElementRef;

  @ViewChild('reset', { static: true })
  resetBtn: ElementRef;

  clock$: Observable<number>;
  tiktakSound = new Audio('assets/sounds/reloj-tic-tac.mp3');
  alarmSound = new Audio('assets/sounds/old-alarm-sound.mp3');
  alarmIsPlaying = false;

  constructor(public clockService: ClockService) {}

  updateState(value: number, command: string) {
    this.clockService.updateState(+value, command);
  }

  reproduceTiktak() {
    this.tiktakSound.loop = true;
    this.tiktakSound.play();
  }

  stopTikTak() {
    this.tiktakSound.pause();
  }
  
  stopAlarm() {
    this.alarmIsPlaying = false;
    this.alarmSound.pause();
  }

  ngAfterViewInit() {
    const start$ = fromEvent(this.startBtn.nativeElement, 'click').pipe(mapTo(true));
    const pause$ = fromEvent(this.pauseBtn.nativeElement, 'click').pipe(mapTo(false));
    const reset$ = fromEvent(this.resetBtn.nativeElement, 'click').pipe(mapTo(null));
    const zero$ = new Subject();
    const stateChange$ = this.clockService.action$.pipe(mapTo(null));

    fromEvent(this.alarmSound, 'playing').subscribe(_=> this.alarmIsPlaying = true);

    this.clock$ = merge(
      start$,
      pause$,
      reset$,
      zero$,
      stateChange$,
    ).pipe(
      switchMap((isCounting: number) => {
        if(isCounting === null) {
          return of(null)
        }
        isCounting ? this.reproduceTiktak() : this.stopTikTak();
        return isCounting ? interval(1000): of();
      }),
      scan((accummulated: number, current: number) => {
        if(accummulated === 0 && current !== null) {
          this.stopTikTak();
          this.alarmSound.play();

          zero$.next(null);
          return accummulated;
        }
        if (current === null || !accummulated) { 
          return this.clockService.getTotalSeconds();
        }
        return --accummulated;
      })
    )

  }
}
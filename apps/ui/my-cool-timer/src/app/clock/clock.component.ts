import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { fromEvent, merge, Observable, of, pipe } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';


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

  clock$: Observable<any>;

  ngAfterViewInit() {
    const start$ = fromEvent(this.startBtn.nativeElement, 'click').pipe(mapTo(true));
    const pause$ = fromEvent(this.pauseBtn.nativeElement, 'click').pipe(mapTo(false));
    const reset$ = fromEvent(this.resetBtn.nativeElement, 'click').pipe(mapTo(null));
    
    this.clock$ = merge(
      start$,
      pause$,
      reset$,
    ).pipe(
      switchMap((isPressing) => {
        return of(isPressing);
      }),
      tap(console.log)
    );

    this.clock$.subscribe();

  }
}
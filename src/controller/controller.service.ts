import { Injectable } from '@nestjs/common';

@Injectable()
export class ControllerService {
  public onClock?: (date: Date) => void;

  private clockTimeout?: NodeJS.Timeout;
  private currentDate: Date;
  private delay = 1000;

  constructor() {
    this.currentDate = new Date();
  }

  public set date(date: Date) {
    this.currentDate = date;
  }
  public get date() {
    return this.currentDate;
  }

  startClock(): void {
    if (this.clockTimeout != null) {
      return;
    }
    if (this.currentDate == null) {
      return;
    }

    this.clockTimeout = setInterval(() => {
      this.clock();
    }, this.delay);
  }

  setClockSpeed(delay: number): void {
    this.delay = delay;
    console.log(`[Controller] Clock speed set to ${delay}ms.`);
    if (this.clockTimeout != null) {
      this.stopClock();
      this.startClock();
    }
  }

  stopClock(): void {
    if (this.clockTimeout == null) {
      console.warn('[Controller] Clock not started.');
      return;
    }

    clearInterval(this.clockTimeout);
    this.clockTimeout = undefined;
  }

  private clock() {
    this.currentDate = new Date(
      this.currentDate.getTime() + 24 * 60 * 60 * 1000,
    );
    if (this.onClock) {
      this.onClock(this.currentDate);
    }
  }
}

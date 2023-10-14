/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */

export class MyProgressBar {
  constructor(progressBarElement, total) {
    this.total = total;
    this.progress = 0;
    this.progressBarElement = progressBarElement;
    this.intervalId = null;
    this.render();
  }

  render() {
    this.progressBarElement.style.width = `${
      (this.progress / this.total) * 100
    }%`;
  }

  start() {
    this.intervalId = setInterval(() => {
      this.progress += 1;
      console.log('+', this.progress);
      this.render();
      if (this.progress + 1 === this.total) {
        clearInterval(this.intervalId);
      }
    }, 100);
  }

  stop() {
    clearInterval(this.intervalId);
  }

  update(progress) {
    clearInterval(this.intervalId);
    this.progress = progress;
    this.render();
  }

  increment() {
    this.progress += 1;
    this.render();
  }

  decrement() {
    this.progress -= 1;
    this.render();
  }
}

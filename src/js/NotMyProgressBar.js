/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import ProgressBar from 'progressbar.js';

export class NotMyProgressBar {
  constructor(progressBarContainer, total) {
    this.total = total;
    this.progress = 0;
    this.progressBarContainer = progressBarContainer;
    this.intervalId = null;
    this.init();
    this.render();
  }

  init() {
    this.progressBar = new ProgressBar.Line(this.progressBarContainer, {
      strokeWidth: 4,
      easing: 'easeInOut',
      duration: 100,
      color: '#FFEA82',
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: { width: '100%', height: '100%' },
      text: {
        style: {
          color: '#999',
          position: 'absolute',
          right: '0',
          top: '30px',
          padding: 0,
          margin: 0,
          transform: null,
        },
        autoStyleContainer: false,
      },
      from: { color: '#FFEA82' },
      to: { color: '#ED6A5A' },
      step: (state, bar) => {
        bar.setText(`${Math.round(bar.value() * 100)} %`);
      },
    });
  }

  render() {
    this.progressBar.animate(this.progress / this.total);
  }

  start() {
    this.intervalId = setInterval(() => {
      this.progress += (1 / this.total) * 0.01;
      this.progressBar.animate(this.progress);
      if (
        this.progress + (1 / this.total) * 0.01 ===
        this.progress / this.total
      ) {
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
}

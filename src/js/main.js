import 'the-new-css-reset/css/reset.css';
import '../styles/style.css';
import { NotMyProgressBar } from './NotMyProgressBar';
import { MyProgressBar } from './MyProgressBar';
import { startCatchingFace } from './getFace';

document.querySelector('#app').innerHTML = `
  <div class="container">

    <div class="video-wrapper">
      <video id="video" class="responsive-video" width="640" height="480" autoplay></video>
    </div>

    <div class='progress-bar-wrapper'>
      <div class='progress-bar'></div>
    </div>

    <div class='buttons'>
      <button class='reset button'>RESET</button>
    </div>

    <div id="progress"></div>

  </div>
`;

const progressBarContainer = document.getElementById('progress');
const notMyProgressBar = new NotMyProgressBar(progressBarContainer, 2);

const progressBarElement = document.querySelector('.progress-bar');
const myProgressBar = new MyProgressBar(progressBarElement, 200);

const resetProgressButton = document.querySelector('.reset');
resetProgressButton.addEventListener('click', () => {
  myProgressBar.update(0);
  notMyProgressBar.update(0);
});

startCatchingFace(myProgressBar, notMyProgressBar);

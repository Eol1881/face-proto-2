/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */

import * as faceapi from 'face-api.js';

import { CONFIG } from './config';

export async function startCatchingFace(
  progressBarInstance,
  progressBarOperator,
) {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/face-models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/face-models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/face-models'),
  ]);

  const video = document.getElementById('video');
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  video.addEventListener('loadeddata', () => {
    video.addEventListener('play', () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      // video.append(canvas);
      document.body.appendChild(canvas);

      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);

      let currentProcess = 'nothing'; // increasing decreasing nothing
      let smileStartTime = null;
      let smileStopTime = null;

      const detectFaces = async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        detections.forEach((detection) => {
          const { expressions } = detection;

          if (expressions.happy > CONFIG.happySensitivity) {
            if (currentProcess !== 'increasing') {
              if (!smileStartTime) {
                smileStartTime = Date.now();
                return;
              }
              const smileDuration = Date.now() - smileStopTime;
              if (smileDuration >= CONFIG.delayBeforeStart) {
                currentProcess = 'increasing';
                console.log(currentProcess);
                progressBarInstance.start();
                progressBarOperator.start();
                smileStopTime = null;
                smileStartTime = null;
              }
            } else {
              smileStopTime = null;
            }
          } else if (currentProcess !== 'decreasing') {
            if (!smileStopTime) {
              smileStopTime = Date.now();
              return;
            }
            const stopDuration = Date.now() - smileStopTime;
            if (
              stopDuration > CONFIG.delayBeforeStop &&
              currentProcess !== 'decreasing'
            ) {
              currentProcess = 'decreasing';
              console.log(currentProcess);
              progressBarInstance.stop();
              progressBarOperator.stop();
              smileStopTime = null;
              smileStartTime = null;
            }
          }
        });

        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, detections);
        faceapi.draw.drawFaceExpressions(canvas, detections);

        setTimeout(() => {
          requestAnimationFrame(detectFaces);
        }, 200);

        // requestAnimationFrame(detectFaces);
      };

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video playback started');
          })
          .catch((error) => {
            console.error('Failed to play video:', error);
          });
      }

      requestAnimationFrame(detectFaces);
    });
  });
}

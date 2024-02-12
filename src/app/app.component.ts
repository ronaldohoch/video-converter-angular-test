import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoadfilesService } from './loadfiles.service'
import { HttpClientModule, HttpEventType } from '@angular/common/http'

declare function ffmpeg_run(args: any): any;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('videoRef') videoRef!: ElementRef<HTMLVideoElement>;
  constructor(
    private loadfilesSvc: LoadfilesService
  ) {

  }
  title = 'angular-videoconverter.js';

  loadFFMPEG() {
    this.loading = true;
    this.loadfilesSvc.loadUrlWithProgress('assets/js/ffmpeg.js.gz')
      .subscribe(data => {
        console.log("ffmpeg loaded");
        this.loadBigBunny();
      })
  }

  // loadFFMPEG() {
  //   this.loadfilesSvc.loadUrlWithProgress('assets/js/ffmpeg.js.gz')
  //     .subscribe({
  //       next: (event) => {
  //         // console.log('next', event)
  //         // if (event.type === HttpEventType.DownloadProgress) {
  //         //   console.log("download progress", event);
  //         // }
  //         if (event.type === HttpEventType.Response) {
  //           // console.log("donwload completed");
  //           this.loadBigBunny();
  //         }
  //       },
  //       error: (e) => console.error('error', e),
  //       complete: () => console.info('complete')
  //     })
  // }
  loading = false;
  videoLoaded = false;
  video: any;
  blobVideoUrl: string = '';
  videoUint8Array!: Uint8Array

  loadBigBunny() {
    // http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
    this.loadfilesSvc.loadUrlWithProgress('assets/video/BigBuckBunny.mp4')
      .subscribe(video => {
        this.videoLoaded = true;
        this.loading = false;
        setTimeout(() => {
          this.video = video;
          this.videoUint8Array = new Uint8Array(this.video);
          console.log(this.videoUint8Array);
          this.blobVideoUrl = URL.createObjectURL(new Blob([this.video], { type: 'video/mp4' }));
          this.videoRef.nativeElement.src = this.blobVideoUrl;
        })
      })
  }

  runSnipVideo() {
    var results = ffmpeg_run({
      arguments: [
        '-ss', `0`,
        '-i', 'input.mp4',
        '-t', `60`,
        '-strict','-2',
        'output.mp4'
      ],
      files: [
        {
          data: this.videoUint8Array,
          name: 'input.mp4'
        }
      ]
    });

    // results is an Array of { data: UInt8Array, name: string }
    results.forEach(function (file: any) {
      console.log("File recieved", file.name, file.data);
    });
  }

  generateFrames() {
    var results = ffmpeg_run({
      arguments: [
        '-skip_frame','default', '-vsync', 'passthrough',
        '-i', 'input.mp4',
        '-an', //no audio
        '-sn', // no subtitles
        '-dn', // no data streams
        '-vf', `fps=1/60`,
        '-f', `image2`,
        'frame_%d.png'
      ],
      files: [
        {
          data: this.videoUint8Array,
          name: 'input.mp4'
        }
      ]
    });

    // results is an Array of { data: UInt8Array, name: string }
    results.forEach(function (file: any) {
      console.log("File recieved", file.name, file.data);
    });
  }
}

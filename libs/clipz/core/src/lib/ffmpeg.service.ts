import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import { BehaviorSubject, first, from, Observable, switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  private readonly initSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loading: boolean = false;
  private readonly ffmpeg: FFmpeg = createFFmpeg({ log: true });

  public readonly init$: Observable<boolean> = this.initSource.asObservable();

  constructor() { }

  public async initFFmpeg(): Promise<void> {
    if (!this.initSource.value && !this.loading) {
      this.loading = true;
      await this.ffmpeg.load();
      this.initSource.next(true);
      this.loading = false;
    }
  }

  public getScreenshots(file: File, n: number = 3): Observable<string[]> {
    return this.init$.pipe(
      first(Boolean),
      switchMap(() => from(fetchFile(file))),
      switchMap((data: Uint8Array) => {
        this.ffmpeg.FS('writeFile', file.name, data);
        const emptyArray: undefined[] = Array.from({ length: n });
        const commands: string[][] = emptyArray.map(
          (_, i: number) => [
            // Input
            '-i', `${file.name}`,
            // Outpur options
            '-ss', `00:00:0${i}`, '-frames:v', '1', '-filter:v', 'scale=510:-1',
            // Output
            `output_${i}.png`
          ]

        );
        return from(
          this.ffmpeg.run(...commands.flat())
        ).pipe(
          map(() => {
            return emptyArray.map((_, i: number) => {
              const screenshot: Uint8Array = this.ffmpeg.FS('readFile', `output_${i}.png`);
              const blob = new Blob([screenshot], { type: 'image/png' });
              const url = URL.createObjectURL(blob);

              return url;
            });
          })
        );
      })
    );
  }

  public revokeUrls(urls: string[]): void {
    urls.forEach((url: string) => {
      URL.revokeObjectURL(url);
    });
  }
}

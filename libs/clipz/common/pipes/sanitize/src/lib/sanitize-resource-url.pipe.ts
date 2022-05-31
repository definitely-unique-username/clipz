import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Pipe({ name: 'sanitizeResourceUrl' })
export class SanitizeResourceUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  public transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}
import { DomSanitizer } from '@angular/platform-browser';
import { SafeUrlPipe } from './sanitize-resource-url.pipe';

describe('SanitizeResourceUrlPipe', () => {
  it('create an SafeUrlPipe', () => {
    const pipe = new SafeUrlPipe({} as DomSanitizer);
    expect(pipe).toBeTruthy();
  });
});

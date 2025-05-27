    import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixEncoding'
})
export class FixEncodingPipe implements PipeTransform {
  transform(value: string): string {
    if (typeof value !== 'string') return value;
    try {
      // rehacer la cadena interpretada como Latin1 para volverla a UTF-8
      return decodeURIComponent(escape(value));
    } catch {
      return value;
    }
  }
}

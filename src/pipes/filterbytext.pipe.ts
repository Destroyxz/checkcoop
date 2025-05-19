import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterByText' })
export class FilterByTextPipe implements PipeTransform {
  transform<T>(items: T[], search: string, fields: (keyof T)[]): T[] {
    if (!search) return items;
    const term = search.trim().toLowerCase();
    return items.filter(item =>
      fields.some(f => {
        const val = (item[f] as any) || '';
        return val.toString().toLowerCase().includes(term);
      })
    );
  }
}

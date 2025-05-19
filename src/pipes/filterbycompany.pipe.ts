import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterByCompany' })
export class FilterByCompanyPipe implements PipeTransform {
  transform<T extends { empresa_id: number }>(items: T[], empresaId: string): T[] {
    if (!empresaId) return items;
    const id = parseInt(empresaId, 10);
    return items.filter(item => item.empresa_id === id);
  }
}

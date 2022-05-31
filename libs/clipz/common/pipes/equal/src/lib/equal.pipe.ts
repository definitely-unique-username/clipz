import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'equal'
})
export class EqualPipe implements PipeTransform {
  public transform(value: any, ...compares: any[]): boolean {
      return compares.reduce((equal: boolean, compare: boolean) => equal || value === compare, false);
  }
}
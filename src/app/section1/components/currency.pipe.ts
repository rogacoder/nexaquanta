// RS: Stub a a currency pipe for running the examples 
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currency',
    standalone: true,
})
export class CurrencyPipe implements PipeTransform {
    transform(value: number): string {
        if (typeof value !== 'number') {
            return '';
        }
        return `£${value.toFixed(2)}`;
    }
} 
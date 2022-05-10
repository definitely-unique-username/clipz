import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function match(...names: string[]): ValidatorFn { 
    return function(control: AbstractControl): ValidationErrors | null {
        const controls: AbstractControl[] = names.map(name => control.get(name)).filter(Boolean) as AbstractControl[];
        const match: boolean = controls.every((control: AbstractControl) => control.value === controls[0].value);

        return match ? null : { match: true };
    }
}
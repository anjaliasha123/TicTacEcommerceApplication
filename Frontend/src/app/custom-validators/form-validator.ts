import {FormControl, ValidationErrors} from '@angular/forms';

export class TicTacFormValidator{
    static noWhiteSpaceAllowed(control: FormControl): ValidationErrors | null{
        if((control.value != null) && (control.value.trim().length === 0)){
            return {'onlyWhiteSpace': true};
        }else{
            return null;
        }
    }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstkey',
  standalone: true
})
export class FirstkeyPipe implements PipeTransform {

  //Implements the transform method, which is called when the pipe is used. It accepts an input (value) and processes it to return a string or null.
  transform(value: any): string | null {
    //Extracts all keys of the input object (value) and stores them in the keys array using JavaScript's Object.keys method.
    const keys = Object.keys(value);
    //Checks if the keys array is not null and has at least one key.
    if(keys && keys.length > 0)
      // Returns the first key in the keys array if the array is non-empty.
      return keys[0];
    return null;
  }

}

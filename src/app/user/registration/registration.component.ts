import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FirstkeyPipe } from '../../shared/pipes/firstkey.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FirstkeyPipe,RouterLink],
  templateUrl: './registration.component.html',
  styles: ``
})
export class RegistrationComponent {
  //Tracks form submission status
  isSubmitted: boolean = false
  //Stores the registration form's structure and state.
  form;


  //Defines a custom validator function passwordMatchValidator that ensures password and confirmPassword match.
  // Note: Validates if password fields match
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    //Retrieves the password control from the form using the get method.
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword')

    //Checks if both password and confirmPassword exist and if their values do not match.
    if (password && confirmPassword && password.value != confirmPassword.value) {
      //Sets a validation error passwordMismatch on the confirmPassword control if passwords do not match.
      confirmPassword?.setErrors({ passwordMismatch: true })
      //Returns a validation error object indicating a password mismatch.
      return { passwordMismatch: true };
    } else {
      confirmPassword?.setErrors(null)
      return null;
    }
  }


  //Defines a constructor that injects the FormBuilder service for creating forms.
  constructor(
    private service: AuthService,
    private toastr: ToastrService,
    public formBuilder: FormBuilder
  ) {

    //Creates a reactive form group using FormBuilder with specified fields and validations.
    this.form = this.formBuilder.group({
      //Adds a fullName field with a required validator.
      fullName: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9])/)
      ]],
      confirmPassword: [''],
    }, { validators: this.passwordMatchValidator });
  }

  // Defines the onSubmit method triggered on form submission.
  onSubmit() {
    //Sets isSubmitted to true, marking the form as submitted.
    this.isSubmitted = true;
    if (this.form.valid) {
      this.service.createUser(this.form.value).subscribe({
        next: (res: any) => {
          if (res.succeeded) {
            this.form.reset
            this.isSubmitted = false
            this.toastr.success('New User created!!', 'Registration Successful')
          }
        },
        error: err => {
          if(err.error.errors)
          err.error.errors.forEach((x: any) => {
            switch (x.code) {
              case "DuplicateUserName":
                break;
              case "DuplicateEmail":
                this.toastr.error('Email is already taken.', 'Registration Failed')
                break;
              default:
                this.toastr.error('Contact the developer', 'Registration Failed')
                console.log(x);
                break;
            }
          })
          else
          console.log('error:',err)
        }
      })
    }
  }

  //Defines a method to check if a form control has an error that should be displayed.
  hasDisplayableError(controlName: string): boolean {
    //Retrieves a specific control from the form by name.
    const control = this.form.get(controlName);
    //Returns true if the control is invalid and either the form is submitted or the control is touched.
    // Note: Ensures errors are displayed under the right conditions.
    return Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }

}

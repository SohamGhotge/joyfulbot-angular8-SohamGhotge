import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes.guard';

function passwordMatch(control: AbstractControl) {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMatch: true });
  } else {
    confirmPassword.setErrors(null);
  }
  return null;
}

@Component({ selector: 'app-register', templateUrl: './register.component.html', styleUrls: ['./register.component.scss'] })
export class RegisterComponent implements OnInit, CanComponentDeactivate {
  registerForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatch });
  }

  onSubmit() {
    if (this.registerForm.invalid) { return; }
    this.isLoading = true;
    const { name, email, password } = this.registerForm.value;
    this.authService.register({ name, email, password }).subscribe(
      () => { this.isLoading = false; this.router.navigate(['/auth/login']); },
      () => { this.isLoading = false; this.errorMessage = 'Registration failed. Try again.'; }
    );
  }

  canDeactivate(): boolean {
    return !this.registerForm.dirty;
  }

  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}

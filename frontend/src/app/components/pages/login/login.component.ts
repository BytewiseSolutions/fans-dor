import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitted = false;
  errorMessage = '';
  errorShake = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
}

 onSubmit(): void {
  this.isSubmitted = true;
  this.errorShake = false;

  if (this.loginForm.invalid) {
    return;
  }

  const { email, password } = this.loginForm.value;

this.http.post<any>('http://localhost:5000/login', {
  email, password
}).subscribe({
  next: (res) => {
    if (res.role === 'admin') {
      window.location.href = '/admin-dashboard';
    } else {
      alert('Access denied: Not an admin');
    }
  },
  error: () => {
    this.errorMessage = 'Invalid email or password';
    this.errorShake = true;
    setTimeout(() => this.errorShake = false, 500);
  }
});
}

}

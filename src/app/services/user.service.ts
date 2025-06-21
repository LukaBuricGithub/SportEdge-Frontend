import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignUpRequestDTO } from '../models/SignUpRequestDTO';
import { ForgotPasswordRequestDTO } from '../models/ForgotPasswordRequestDTO';
import { ResetPasswordRequestDTO } from '../models/ResetPasswordRequestDTO';
import { CustomerServiceMessageDTO } from '../models/CustomerServiceMessageDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {



  baseUrl = "https://localhost:7138/api/Users"
  
  constructor(private http:HttpClient) { }


  userSignUp(user:SignUpRequestDTO) : Observable<any>
  {
    return this.http.post(this.baseUrl,user);
  }


  userForgotPassword(user:ForgotPasswordRequestDTO) : Observable<any> 
  {
    return this.http.post(this.baseUrl+'/forgot-password',user);
  }


  userResetPassword(user:ResetPasswordRequestDTO): Observable<any>
  {
    return this.http.post(this.baseUrl+'/reset-password',user);
  }


  customerServiceSendMessage(message:CustomerServiceMessageDTO): Observable<any>
  {
    return this.http.post(this.baseUrl+'/customer-service-request',message);
  }


}

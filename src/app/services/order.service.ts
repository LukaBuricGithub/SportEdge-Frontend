import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDTO } from '../models/OrderDTO';
import { CreateOrderRequestDto } from '../models/CreateOrderRequestDto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = "https://localhost:7138/api/Orders"

  constructor(private http:HttpClient) { }

  getAllOrders(): Observable<OrderDTO[]> 
  {
    return this.http.get<OrderDTO[]>(this.baseUrl);
  }


  getOrdersForUser(userId: number): Observable<OrderDTO[]> 
  {
    const url = `${this.baseUrl}/user/${userId}`;
    return this.http.get<OrderDTO[]>(url);
  }

  getOrderById(orderId: number): Observable<OrderDTO> 
  {
    const url = `${this.baseUrl}/${orderId}`;
    return this.http.get<OrderDTO>(url);
  }

  createOrder(orderData: CreateOrderRequestDto): Observable<OrderDTO> 
  {
    return this.http.post<OrderDTO>(this.baseUrl, orderData);
  }
}

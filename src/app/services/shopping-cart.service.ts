import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryDTO } from '../models/CategoryDTO';
import { CreateCategoryRequestDTO } from '../models/CreateCategoryRequestDTO';
import { UpdateCategoryRequestDTO } from '../models/UpdateCategoryRequestDTO';
import { CartDTO } from '../models/CartDTO';

@Injectable({
  providedIn: 'root'
})

export class ShoppingCartService 
{

  baseUrl = 'https://localhost:7138/api/Carts';

  constructor(private http:HttpClient) { }


  getCart(userId: number): Observable<CartDTO> {
    return this.http.get<CartDTO>(`${this.baseUrl}/${userId}`);
  }

  addItem(userId: number, productVariationId: number, quantity: number): Observable<void> {
    const params = new HttpParams()
      .set('productVariationId', productVariationId.toString())
      .set('quantity', quantity.toString());

    return this.http.post<void>(`${this.baseUrl}/${userId}/items`, null, { params });
  }

  updateItem(userId: number, productVariationId: number, quantity: number): Observable<void> {
    const params = new HttpParams()
      .set('quantity', quantity.toString());

    return this.http.put<void>(`${this.baseUrl}/${userId}/items/${productVariationId}`, null, { params });
  }

  removeItem(userId: number, productVariationId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}/items/${productVariationId}`);
  }

  clearCart(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}/items`);
  }
}

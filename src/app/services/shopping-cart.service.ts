import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryDTO } from '../models/CategoryDTO';
import { CreateCategoryRequestDTO } from '../models/CreateCategoryRequestDTO';
import { UpdateCategoryRequestDTO } from '../models/UpdateCategoryRequestDTO';
import { CartDTO } from '../models/CartDTO';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})

export class ShoppingCartService 
{

  private itemCountSubject = new BehaviorSubject<number>(0);
  itemCount$ = this.itemCountSubject.asObservable(); 

  baseUrl = 'https://localhost:7138/api/Carts';

  constructor(private http:HttpClient) { }


  getCart(userId: number): Observable<CartDTO> {
    return this.http.get<CartDTO>(`${this.baseUrl}/${userId}`);
  }

  updateItemCount(userId: number): void {
    this.getCart(userId).subscribe({
      next: (cart) => {
        const variationCount = cart.cartItems.length; 
        this.itemCountSubject.next(variationCount);
      },
      error: () => {
        this.itemCountSubject.next(0); 
      }
    });
  }

  addItem(userId: number, productVariationId: number, quantity: number): Observable<void> {
    const params = new HttpParams()
      .set('productVariationId', productVariationId.toString())
      .set('quantity', quantity.toString());

    return this.http.post<void>(`${this.baseUrl}/${userId}/items`, null, { params }).pipe(
      tap(() => this.updateItemCount(userId)) 
    );
  }

  updateItem(userId: number, productVariationId: number, quantity: number): Observable<void> {
    const params = new HttpParams().set('quantity', quantity.toString());

    return this.http.put<void>(`${this.baseUrl}/${userId}/items/${productVariationId}`, null, { params }).pipe(
      tap(() => this.updateItemCount(userId)) 
    );
  }

  removeItem(userId: number, productVariationId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}/items/${productVariationId}`).pipe(
      tap(() => this.updateItemCount(userId)) 
    );
  }

  clearCart(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}/items`).pipe(
      tap(() => this.updateItemCount(userId)) 
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BrandDTO } from '../models/BrandDTO';
import { CreateBrandRequestDTO } from '../models/CreateBrandRequestDTO';
import { UpdateBrandRequestDTO } from '../models/UpdateBrandRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  baseUrl = "https://localhost:7138/api/Brands"
  
  constructor(private http:HttpClient) { }

  getAllBrands(): Observable<BrandDTO[]> 
  {
    return this.http.get<BrandDTO[]>(this.baseUrl);
  }

  createBrand(brand:CreateBrandRequestDTO): Observable<any> 
  {
    return this.http.post(this.baseUrl,brand);
  }

  getBrandById(id: number): Observable<BrandDTO> 
  {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<BrandDTO>(url);
  }

  updateBrand(id: number, brand: UpdateBrandRequestDTO): Observable<any> 
  {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, brand);
  }

  deleteBrand(id: number): Observable<void> 
  {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }

}

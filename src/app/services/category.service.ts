import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDTO } from '../models/CategoryDTO';
import { CreateCategoryRequestDTO } from '../models/CreateCategoryRequestDTO';
import { UpdateCategoryRequestDTO } from '../models/UpdateCategoryRequestDTO';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  baseUrl="https://localhost:7138/api/Categories";

  constructor(private http:HttpClient) { }

  getAllCategories() : Observable<CategoryDTO[]>
  {
    return this.http.get<CategoryDTO[]>(this.baseUrl);
  }

  createCategory(category:CreateCategoryRequestDTO): Observable<any> 
  {
    return this.http.post(this.baseUrl,category);
  }

  getCategoryById(id:number) : Observable<CategoryDTO>
  {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<CategoryDTO>(url);
  }

  updateCategory(id:number, category:UpdateCategoryRequestDTO) : Observable<any> 
  {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, category);
  }

  deleteCategory(id:number) : Observable<any>
  {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }


}

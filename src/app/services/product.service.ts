import { Injectable } from '@angular/core';
import { ProductDTO } from '../models/ProductDTO';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenderDTO } from '../models/GenderDTO';
import { CreateProductRequestDTO } from '../models/CreateProductRequestDTO';
import { UpdateProductRequestDTO } from '../models/UpdateProductRequestDTO';
import { ProductVariationDTO } from '../models/ProductVariationDTO';
import { UpdateMultipleProductVariationsRequestDto } from '../models/UpdateMultipleProductVariationsRequestDto';
import { ProductFilterDto } from '../models/ProductFilterDto';
import { FilteredProductsResultDto } from '../models/FilteredProductsResultDto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = "https://localhost:7138/api/Products"

  baseUrlGenderCategory = "https://localhost:7138/api/Genders"

  baseUrlProductImage = "https://localhost:7138/api/ProductImages"

  baseUrlProductVariation =  "https://localhost:7138/api/ProductVariations";

  
  constructor(private http:HttpClient) { }

  getAllProducts(): Observable<ProductDTO[]> 
  {
    return this.http.get<ProductDTO[]>(this.baseUrl);
  }

  getAllGendersCategory(): Observable<GenderDTO[]>
  {
    return this.http.get<GenderDTO[]>(this.baseUrlGenderCategory)
  }

  createProduct(product:CreateProductRequestDTO): Observable<any> 
  {
    return this.http.post(this.baseUrl,product);
  }


  getProductById(productId: number): Observable<ProductDTO> 
  {
    const url = `${this.baseUrl}/${productId}`;
    return this.http.get<ProductDTO>(url);
  }


  updateProduct(productId:number,product:UpdateProductRequestDTO) : Observable<any>
  {
    const url = `${this.baseUrl}/${productId}`;
    return this.http.put(url, product);
  }

  deleteProduct(productId:number) : Observable<void>
  {
    const url = `${this.baseUrl}/${productId}`;
    return this.http.delete<void>(url);
  }


  uploadProductImages(productId: number, files: File[]): Observable<any> 
  {
    const formData = new FormData();

    for (let file of files) {
      formData.append('files', file);
    }

    return this.http.post(`${this.baseUrlProductImage}/${productId}`, formData);
  }

  deleteProductImages(productId:number) : Observable<void>
  {
    const url = `${this.baseUrlProductImage}/${productId}`;
    return this.http.delete<void>(url);
  }


  getAllProductVariationsForProduct(productId:number) : Observable<ProductVariationDTO[]>
  {
    const url = `${this.baseUrlProductVariation}/by-product/${productId}`;
    return this.http.get<ProductVariationDTO[]>(url);
  }


  updateProductVariationBatch(productVariations:UpdateMultipleProductVariationsRequestDto) : Observable<any> 
  {
    const url = `${this.baseUrlProductVariation}/batch-update-quantities`;
    return this.http.put(url, productVariations);
  }


  getProductsBySearchTerm(searchTerm: string, filter: ProductFilterDto): Observable<FilteredProductsResultDto> 
  {
    const params = new HttpParams().set('searchTerm', searchTerm);
    return this.http.post<FilteredProductsResultDto>(`${this.baseUrl}/search`, filter, { params });
  }

  getProductsByGenderTypeName(name: string, filter: ProductFilterDto): Observable<FilteredProductsResultDto> 
  {
    const url = `${this.baseUrl}/search-gender-type`;
    return this.http.post<FilteredProductsResultDto>(url, filter, {
      params: {
        name: name
      }
    });
  }

  getFilteredProducts(filter: ProductFilterDto): Observable<FilteredProductsResultDto> 
  {
    return this.http.post<FilteredProductsResultDto>(`${this.baseUrl}/filter-products`, filter);
  }


  getProductsByFilter(filter: ProductFilterDto): Observable<FilteredProductsResultDto> 
  {
    return this.http.post<FilteredProductsResultDto>(`${this.baseUrl}/filter`, filter);
  }

  getProductsByCategory(categoryId: number, filter: ProductFilterDto): Observable<FilteredProductsResultDto> {
  const url = `${this.baseUrl}/search-category`;
  return this.http.post<FilteredProductsResultDto>(url, filter, {
    params: {
      categoryId: categoryId.toString()
    }
  });
}

  getGenderIdByGenderName(name:string) : Observable<number>
  {
    const url = `${this.baseUrlGenderCategory}/gender-type-id`;
      return this.http.get<number>(url, {
      params: {
        name: name
      }
    });
  }

}

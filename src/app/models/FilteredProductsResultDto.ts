import { ProductDTO } from "./ProductDTO";

export interface FilteredProductsResultDto 
{
    products:ProductDTO[];
    totalCount:number;
}
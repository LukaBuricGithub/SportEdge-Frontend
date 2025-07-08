export interface UpdateProductRequestDTO 
{
    name:string;
    shortDescription:string;
    price:number;
    discountedPrice?: number | null;
    brandId:number;
    categoryIds:number[];
}

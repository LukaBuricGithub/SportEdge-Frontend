export interface CreateProductRequestDTO 
{

    name:string;
    shortDescription:string;
    price:number;
    discountedPrice?: number | null;
    categoryIds:number[];
    brandId:number;
    genderId:number;
}
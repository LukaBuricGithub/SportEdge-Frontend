import { ProductVariationDTO } from "./ProductVariationDTO";

export interface ProductDTO 
{
    id:number;
    name:string;
    shortDescription:string;
    price:number;
    discountedPrice?: number | null;
    brandId:number;
    brandName:string;
    categoryNames:string[];
    categoryIds:number[];
    variations:ProductVariationDTO[];
    quantity:number;
    imageFilenames:string[];
    genderId: number;
    genderName:string;
}
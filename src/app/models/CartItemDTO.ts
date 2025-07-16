export interface CartItemDTO 
{
    id:number;
    cartId:number;
    productName:string;
    productVariationId:number;
    sizeOptionName:string;
    priceAtTime:number;
    quantity:number;
    productId:number;
    imageUrl?: string | null;
}
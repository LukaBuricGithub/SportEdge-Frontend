import { CartItemDTO } from "./CartItemDTO";

export interface CartDTO
{
    id:number;
    userId:number;
    createdAt:string;
    cartItems:CartItemDTO[];
}
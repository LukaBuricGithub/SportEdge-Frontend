import { OrderItemDTO } from "./OrderItemDTO";

export interface OrderDTO 
{
    id:number;
    userId:number;
    createdAt:string;
    orderItems:OrderItemDTO[];
    totalPrice:number;
    userCountry:string;
    userCity:string;
    userAddress:string;
    //public List<OrderItemDto> OrderItems { get; set; }
}
import { UpdateSingularProductVariationRequestDto } from "./UpdateSingularProductVariationRequestDto"

export interface UpdateMultipleProductVariationsRequestDto 
{
    variations:UpdateSingularProductVariationRequestDto[];
}
export interface CreateCategoryRequestDTO 
{
  name: string;
  parentCategoryId?: number | null;
}
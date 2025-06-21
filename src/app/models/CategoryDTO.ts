export interface CategoryDTO 
{
    id:number;
    name:string;
    parentCategories:string[];
    childCategories:string[];
    parentCategoriesIDs:number[];
    childCategoriesIDs:number[];
}
import { Injectable } from '@angular/core';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private CATEGORY_MAP = new Map<string, Category>();

  private CATEGORY_LIST = new Array<Category>();

  addRootCategory(category: Category): void {
    this.CATEGORY_LIST.push(category);
    this.putCategoryToMap(category);
  }

  putCategoryToMap(category: Category) {
    category.children.forEach(child => {
      this.putCategoryToMap(child);
    });
    this.CATEGORY_MAP.set(category.id, category);
  }

  getCategory(id: string): Category {
    return this.CATEGORY_MAP.get(id);
  }

  constructor() { }
}

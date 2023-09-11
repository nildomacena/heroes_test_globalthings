import { Category } from "./category";

export interface Hero {
  Id: number;
  Name: string;
  Active: boolean;
  Category: Category;
  PendingSync?: boolean;
}

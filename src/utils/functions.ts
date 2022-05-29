import { Order } from "../types/types";
import { API_BASE_URL } from "./constants/url";

export function isValidNumber(numb: number): Boolean {
  if (numb === undefined) return false;
  else if (numb === null) return false;
  else if (isNaN(numb)) return false;
  return true;
}

export function makeImageUrl(productImageFilepath: string) {
  return `${productImageFilepath}`;
}

export function compareOrderByCreatedAt(a: Order, b: Order): number {
  if (a.createdAt > b.createdAt) return -1;
  else if (a.createdAt === b.createdAt) return 0;
  else return 1;
}

import { API_BASE_URL } from './constants/url';

export function isValidNumber(numb: number): Boolean {
  if (numb === undefined) return false;
  else if (numb === null) return false;
  else if (isNaN(numb)) return false;
  return true;
}

export function makeImageUrl(productImageFilepath: string) {
  return `${API_BASE_URL.replace('api/v1', '')}${productImageFilepath}`;
}

export default { isValidNumber };

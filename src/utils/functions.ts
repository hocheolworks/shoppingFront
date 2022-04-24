export function isValidNumber(numb: number): Boolean {
  if (numb === undefined) return false;
  else if (numb === null) return false;
  else if (isNaN(numb)) return false;
  return true;
}

export default { isValidNumber };

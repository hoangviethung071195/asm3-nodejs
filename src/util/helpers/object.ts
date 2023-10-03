export function getValuableFieldsObj(obj: object) {
  let newObj = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value || value === 0 || value === false) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}
export const isEmptyObject = object => {
    if (Object.keys(object).length === 0 && object.constructor === Object) return true;
    return false;
};

export const capitalize = string => {
    if (string.length === 0) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
};

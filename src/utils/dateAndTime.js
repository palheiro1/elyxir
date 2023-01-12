export function formatDate(date, format) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    return format
        .replace('yyyy', year)
        .replace('MM', month < 10 ? '0' + month : month)
        .replace('dd', day < 10 ? '0' + day : day);
}

export function formatTime(date, format) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    return format
        .replace('HH', hours < 10 ? '0' + hours : hours)
        .replace('mm', minutes < 10 ? '0' + minutes : minutes)
        .replace('ss', seconds < 10 ? '0' + seconds : seconds);
}
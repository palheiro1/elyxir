import { getTimestampForMessages } from "./txUtils";

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

export function formatMessageTimestamp(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export function getMessageTimestamp(message) {
    const timestamp = getTimestampForMessages(message);
    // Returns the time elapsed since arrival (hours, minutes, seconds...) or the date if it's older than 24 hours
    // Compare with actual time
    const timeElapsed = new Date() - new Date(timestamp);
    const hours = Math.floor(timeElapsed / 3600000); // 1 hora = 3600000 milisegundos
    const minutes = Math.floor((timeElapsed % 3600000) / 60000); // 1 minuto = 60000 milisegundos
    const seconds = Math.floor((timeElapsed % 60000) / 1000); // 1 segundo = 1000 milisegundos

    let timeElapsedText = '';
    let isDate = false;
    if (hours > 24) {
        isDate = true;
        timeElapsedText = formatMessageTimestamp(timestamp);
    } else if (hours === 0) {
        if (minutes === 0) {
            timeElapsedText = `${seconds}s`;
        } else {
            timeElapsedText = `${minutes}m ${seconds}s`;
        }
    } else {
        timeElapsedText = `${hours}h ${minutes}m ${seconds}s`;
    }
    console.log(timeElapsedText)
    return { timeElapsedText, isDate };
}

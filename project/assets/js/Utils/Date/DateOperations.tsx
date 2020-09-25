export function dateGetHours(date) {
    return ('0' + date.getHours()).slice(-2);
}

export function dateGetMinutes(date) {
    return ('0' + date.getMinutes()).slice(-2);
}

export function dateGetSeconds(date) {
    return ('0' + date.getSeconds()).slice(-2);
}
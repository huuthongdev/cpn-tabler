export function cleanObj(obj) {
    obj = obj || {};
    return Object.keys(obj).reduce((acc, key) => (
        obj[key] === undefined
            || obj[key] === ''
            ? acc
            : { ...acc, [key]: obj[key] }
    ), {})
}

export function convertTimeToSecond(time, reverse = false) {
    if (!time) return '';
    if (reverse) return +(new Date(time * 1000)).getTime();
    return +((new Date(time).getTime() / 1000).toFixed(0));
}

export function converTimeToSave(miniSecond) {
    let year = new Date(miniSecond).getFullYear();
    let month = new Date(miniSecond).getMonth() + 1;
    let date = new Date(miniSecond).getDate();
    let hour = new Date(miniSecond).getHours();
    let min = new Date(miniSecond).getMinutes();

    min = +min < 10 ? `0${min}` : min;
    date = +date < 10 ? `0${date}` : date;
    month = +month < 10 ? `0${month}` : month;
    hour = +hour < 10 ? `0${hour}` : hour;

    return `${year}-${month}-${date} ${hour}:${min}:00`
}
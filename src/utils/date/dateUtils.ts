const toDatetimeLocalValue = (date: Date): string => {
    if (!(date instanceof Date)) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const setTime = (date: Date, hours: number, minutes = 0, seconds = 0): Date | null => {
    if (!(date instanceof Date)) return null;
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, seconds, 0);
    return newDate;
};

const subtractDays = (date: Date, days: number): Date | null => {
    if (!(date instanceof Date)) return null;
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - days);
    return newDate;
};

const parseUtcToLocal = (utcString: string): Date => {
    const date = new Date(utcString);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

const toDateValue = (date: Date): string => {
    if (!(date instanceof Date)) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    return `${year}-${month}-${day}`;
};

export { toDatetimeLocalValue, setTime, subtractDays, parseUtcToLocal, toDateValue };

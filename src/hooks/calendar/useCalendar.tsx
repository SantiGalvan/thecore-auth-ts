import { useEffect, useState, useCallback } from "react";
import Holidays from "date-holidays";

export interface HolidayEntry {
    date: string;
    name: string;
    type: string;
    [key: string]: unknown;
}

const useCalendar = (year = new Date().getFullYear(), country = "IT") => {
    const [holidays, setHolidays] = useState<HolidayEntry[]>([]);
    const [holidayMap, setHolidayMap] = useState<Map<string, HolidayEntry>>(new Map());

    const formatDateKey = (d: Date): string => {
        const y = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${month}-${day}`;
    };

    useEffect(() => {
        const hd = new Holidays(country);
        const allHolidays = hd.getHolidays(year) as unknown as HolidayEntry[];
        const map = new Map<string, HolidayEntry>(
            allHolidays.map(h => {
                const d = new Date(h.date);
                return [formatDateKey(d), h];
            })
        );
        setHolidays(allHolidays);
        setHolidayMap(map);
    }, [year, country]);

    const isTodayHoliday = useCallback((): boolean => {
        const todayStr = new Date().toISOString().split("T")[0];
        return holidayMap.has(todayStr);
    }, [holidayMap]);

    const isHoliday = useCallback((date: Date | string): boolean => {
        let d: Date;
        if (typeof date === "string") {
            if (date.includes("/")) {
                const [day, month, y] = date.split("/");
                d = new Date(Number(y), Number(month) - 1, Number(day));
            } else {
                const [y, m, dd] = date.split("-");
                d = new Date(Number(y), Number(m) - 1, Number(dd));
            }
        } else {
            d = new Date(date);
        }
        return holidayMap.has(formatDateKey(d));
    }, [holidayMap]);

    const getWeekDays = useCallback((date: Date): Date[] => {
        const d = new Date(date);
        const dayOfWeek = d.getDay();
        const monday = new Date(d);
        monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7));
        const week: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const wd = new Date(monday);
            wd.setDate(monday.getDate() + i);
            week.push(wd);
        }
        return week;
    }, []);

    const getWeeksInMonth = useCallback((month: number, y = new Date().getFullYear()): Date[][] => {
        const weeks: Date[][] = [];
        const date = new Date(y, month, 1);
        while (date.getMonth() === month) {
            weeks.push(getWeekDays(date));
            date.setDate(date.getDate() + 7);
        }
        return weeks;
    }, [getWeekDays]);

    const getDaysInMonth = useCallback((month: number, y = new Date().getFullYear()): Date[] => {
        const days: Date[] = [];
        const date = new Date(y, month, 1);
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, []);

    const getDaysInMonths = useCallback((startMonth: number, startYear = new Date().getFullYear(), numMonths = 6): Date[] => {
        const days: Date[] = [];
        for (let i = 0; i < numMonths; i++) {
            const month = (startMonth + i) % 12;
            const yearOffset = Math.floor((startMonth + i) / 12);
            days.push(...getDaysInMonth(month, startYear + yearOffset));
        }
        return days;
    }, [getDaysInMonth]);

    const getDaysInYear = useCallback((y: number): Date[] => {
        return getDaysInMonth(0, y).concat(getDaysInMonths(1, y, 11));
    }, [getDaysInMonth, getDaysInMonths]);

    return {
        holidays,
        holidayMap,
        isTodayHoliday,
        isHoliday,
        getWeekDays,
        getWeeksInMonth,
        getDaysInMonth,
        getDaysInMonths,
        getDaysInYear,
    };
};

export { useCalendar };

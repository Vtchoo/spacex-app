class DateUtils {

    static format(date: Date, format: string) {
        const replace = {
            'dd': (str: string) => str.replace('dd', date.getDate().toString().padStart(2, '0')),
            'MM': (str: string) => str.replace('MM', (date.getMonth() + 1).toString().padStart(2, '0')),
            'yyyy': (str: string) => str.replace('yyyy', date.getFullYear().toString().padStart(4, '0')),
            'hh': (str: string) => str.replace('hh', date.getHours().toString().padStart(2, '0')),
            'mm': (str: string) => str.replace('mm', date.getMinutes().toString().padStart(2, '0'))
        }

        const result = Object.values(replace).reduce((res, func) => {
            return func(res)
        }, format)

        return result
    }

    static getFileFormatDate(date: Date) {

        const year = date.getFullYear().toString()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const hour = date.getHours().toString().padStart(2, '0')
        const min = date.getMinutes().toString().padStart(2, '0')
        return `${year}-${month}-${day}_${hour}-${min}`
    }

    static isSameDay(date1: Date, date2: Date) {
        return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
    }

    static Today() {
        const now = new Date()
        
        return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }

    static TodayPlus(years: number = 0, months: number = 0, days: number = 0) {
        const date = DateUtils.Today()
        date.setFullYear(date.getFullYear() + years)
        date.setMonth(date.getMonth() + months)
        date.setDate(date.getDate() + days)
        return date
    }
}

export default DateUtils

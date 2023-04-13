import dayjs from "dayjs";

export function GenerateDatesFromYearBeginning(){

    const firstDayOfTheYear = dayjs().startOf('year');
    const today = new Date()
    
    const dates = [];
    let compareDate = firstDayOfTheYear;

    // pegando todos os dias do ano até o momento atual
    while (compareDate.isBefore(today)) {
        dates.push(compareDate.toDate());
        compareDate = compareDate.add(1, 'day');
    }

    return dates;

}
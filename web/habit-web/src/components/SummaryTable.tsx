import { GenerateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";


const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const summaryDates = GenerateDatesFromYearBeginning();

const minimunSummaryDatesSize = 18 * 7 //18 weeks
const amountOfDaysToFill = minimunSummaryDatesSize - summaryDates.length;

export function SummaryTable() {

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {weekdays.map((weekday, i) => {
                    return (
                        <div key={`${weekday}-${i}`} className="text-zinc-400 text-xl font-bold h-10 w-10 flex items-center justify-center">
                            {weekday} 
                        </div>
                    ) 
                })}
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {summaryDates.map((date) => {
                    return <HabitDay key={date.toString()}/> 
                })}

                {/* cria um array com a quantidade de amoutOfDaysToFill */}
                {amountOfDaysToFill > 0 && Array.from({length: amountOfDaysToFill}).map((_, i) => {
                    return <div key={i} className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"></div>
                })}
            </div>
        </div>
    )
}
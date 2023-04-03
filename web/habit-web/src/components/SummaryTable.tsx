export function SummaryTable() {

    const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {weekdays.map(weekday => {
                    return (
                        <div className="text-zinc-400 text-xl font-bold h-10 w-10 flex items-center justify-center">
                            {weekday} 
                        </div>
                    ) 
                })}
            </div>
        </div>
    )
}
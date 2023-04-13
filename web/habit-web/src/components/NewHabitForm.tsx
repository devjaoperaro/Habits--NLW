import { Check } from "phosphor-react";
import * as Checkbox from '@radix-ui/react-checkbox';
import { FormEvent, useState } from "react";


const availableWeekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
];

export function NewHabitForm() {

    const [title, setTitle] = useState('');
    const [weekDays, setWeekDays] = useState<number[]>([]);

    function createNewHabit(event: FormEvent) {
        event.preventDefault();
        console.log(title, weekDays)
    }

    // funcao para adicionar os toglle's no array
    function handleToggleWeekDay(weekDay: number) {
        // verifica se o dia ja esta dentro do array
        if(weekDays.includes(weekDay)){
            // retira o weekDay do array
            const weekDaysWithRemovedOne = weekDays.filter(day => day === weekDay)
            
            setWeekDays(weekDaysWithRemovedOne);
        }else {
            // adicionando no array o weekday
            const weekDaysWithAddedOne = [...weekDays, weekDay];

            setWeekDays(weekDaysWithAddedOne);
        }
    }

    return (
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">

            <label htmlFor="title" className="font-semibold leading-tight">Qual seu comprometimento?</label>

            <input 
                type="text" 
                id="title" 
                placeholder="ex: Exercícios, dormir bem, etc..." 
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:teext-zinc-400"   
                autoFocus
                onChange={event => setTitle(event.target.value)}
            />

            <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorrência?
            </label>

            <div className='mt-6 flex flex-col gap-3'>
                {availableWeekDays.map((weekDay, i) => {
                    return (
                        <Checkbox.Root
                            key={`${weekDay}-${i}`}
                            className='flex items-center gap-3 group'
                            onCheckedChange={() => handleToggleWeekDay(i)}
                        >   
                            <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500'>
                                <Checkbox.Indicator>
                                    <Check size={20} className='text-white'/>
                                </Checkbox.Indicator>
                            </div>

                            <span className='text-white leading-tight'>{weekDay}</span>
                        </Checkbox.Root>
                    )
                })}
            </div>

            <button type="submit" className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500">
                <Check size={20} weight='bold'/>
                Confirmar
            </button>
        </form>
    )
}
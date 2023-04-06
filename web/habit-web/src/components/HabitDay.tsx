import * as Popover from '@radix-ui/react-popover';

export function HabitDay(){
    return (
        <Popover.Root>

            <Popover.Trigger className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg" />

            <Popover.Portal>
                <Popover.Content className='min-w-[320px] bg-zinc-900 p-6 rounded-2xl flex flex-col'>
                    <span className='font-semibold text-zinc-400'>Terça-feira</span>
                    <span className='mt-1 text-3xl font-extrabold leading-tight'>17/01</span>

                    <div className='h-3 w-full mt-4 rounded-xl bg-zinc-700'>
                        <div className='h-3 w-3/4 rounded-xl bg-violet-600'/>
                    </div>
                    <Popover.Arrow height={8} width={16} className='fill-zinc-900'/>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}
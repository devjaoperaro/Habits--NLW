import { FastifyInstance } from "fastify";
import { prisma } from "./lib/prisma";
import { z } from 'zod'
import dayjs from "dayjs";

export async function appRoutes(app: FastifyInstance){


    app.post('/habits', async (request) => {
        // validação com o zod 
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6)),
        })
        
        const { title, weekDays } = createHabitBody.parse(request.body);

        // pega a data atual em q foi criado o habito e zera a hora e minuto
        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                WeekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay,
                        }
                    })
                }
            }
        })
    });


    app.get('/day', async (request) => {

        const getDayParams = z.object({
            // coerce transforma a string do front em date
            date: z.coerce.date()
        })

        const { date } = getDayParams.parse(request.query) 


        const parsedDate = dayjs(date).startOf('day');

        // pega o numero do dia da semana ex: (domingo = 1, segunda = 2...)
        const weekDay = parsedDate.get('day');

        //todos os habitos possiveis
        //habitos q ja foram completos

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    //data de criação do habito menor ou igual a data atual
                    lte: date,
                },
                WeekDays: {
                    // onde tenha pelo menos 1 dia cadastrado "some"
                    // pega o habitos daquele dia
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            // pegando todos os dayhabbits completos naquele dia 
            where: {
                // converte o data para objeto quando utiliza o prisma
                date: parsedDate.toDate(),
            },
            include: {
                DayHabit: true
            }
        })

        const completedHabits = day?.DayHabit.map(dayHabits => {
            return dayHabits.habit_id;
        })

        return { possibleHabits, completedHabits };
    }) 

    // completar e nao-completar um habito
    app.patch('/habits/:id/toggle', async (request) => {

        const toggleHabits = z.object({
            id: z.string().uuid()
        })

        const { id } = toggleHabits.parse(request.params)

        const today = dayjs().startOf('day').toDate();

        // verifica se o dia esta cadastrado
        let day = await prisma.day.findUnique({
            where: {
                date: today,
            }
        });

        // criando o dia sempre que a pessoa completar um habito. Entao ao executar esta rota vai criar um dia
        if(!day) {
            day = await prisma.day.create({
                data: {
                    date: today,
                }
            })
        }

        // verificando se o habito ja estava completo
        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })

        // se existir o habito como completo
        if(dayHabit) {
            // remove a marcação
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        }else {
            // completar o habito neste dia
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            })
        }

    })

    // resumo retornando um array com varias informações [ {date: 17/01, amount: 5, completed: 1}, {} ]
    app.get('/summary', async (request) => {
        const summary = await prisma.$queryRaw`
            SELECT
                D.id,
                D.date,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM day_habits DH
                    WHERE DH.day_id = D.id    
                ) as completed,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM habit_week_days HWD
                    JOIN habits H
                        ON H.id = HWD.habit_id
                    WHERE 
                        HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                        AND H.created_at <= D.date
                ) as amount
            FROM days D
        `
        return summary;
    })
}


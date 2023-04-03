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
}


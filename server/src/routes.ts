import { FastifyInstance } from "fastify";
import { prisma } from "./lib/prisma";
import { z } from 'zod'

export async function appRoutes(app: FastifyInstance){
    app.post('/habits', async (request, response) => {

        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6)),
        })
        // validação com o zod 
        const { title, weekDays } = createHabitBody.parse(request.body)
    });
}



import express, { Request, Response } from 'express';
import { Briefing } from './entity/briefing';
import { BriefingCreateDTO } from './dtos/BriefingCreateDTO';
import { uuid } from 'uuidv4';
import { BriefingState } from './enums/BriefingState';

const app = express();
const port = 3000;

let briefings : Briefing[] = []

app.use(express.json())

app.get('/', (req : Request, res : Response) => {

    res.send("Ola")

})

//Criação de briefing
app.post("/api/briefing", (req : Request<BriefingCreateDTO>, res : Response) => {

    const dto : BriefingCreateDTO = req.body;
    const briefing : Briefing = new Briefing(uuid(), dto.clientName, dto.description, new Date(), BriefingState.negociacao);
    briefings.push(briefing)

    res.sendStatus(200)
})


//Recuperação de briefing
app.get("/api/briefing", (req : Request, res : Response) => {
    res.send(briefings).sendStatus(200)
})

//Recuperação de briefing por id
app.get("/api/briefing/:id", (req : Request, res : Response) => {
    const briefing : Briefing | undefined = briefings.find(b => b.id == req.params.id)
    if(!briefing){
        res.sendStatus(500)
        return;
    }
    res.send(briefing).sendStatus(200)
})


app.listen(port, () => {
    console.log("Briefing está rodando na porta 3000, acesse http://localhost:3000")
})

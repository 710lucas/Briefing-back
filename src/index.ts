
import express, { Request, Response, response } from 'express';
import { Briefing } from './entity/Briefing';
import { BriefingCreateDTO } from './dtos/BriefingCreateDTO';
import { v4 } from 'uuid';
import { BriefingState } from './enums/BriefingState';
import { getBriefignById } from './HelperFunctions';
import { BriefingEditDTO } from './dtos/BriefingEditDTO';

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
    const briefing : Briefing = new Briefing(v4(), dto.clientName, dto.description, new Date(), BriefingState.negociacao);
    briefings.push(briefing)

    res.sendStatus(200)
})


//Recuperação de briefing
app.get("/api/briefing", (req : Request, res : Response) => {

    const responseBriefings : Briefing[] = briefings.filter(briefing => !briefing.deleted)

    res.send(responseBriefings).sendStatus(200)
})

//Recuperação de briefing por id
app.get("/api/briefing/:id", (req : Request, res : Response) => {

    const briefing : Briefing | undefined = getBriefignById(req.params.id, briefings);

    if(!briefing){
        res.sendStatus(500)
        return;
    }
    res.send(briefing).sendStatus(200)
})

//Apagar briefing
app.delete("/api/briefing/:id", (req : Request, res : Response) => {
    const briefing : Briefing | undefined = getBriefignById(req.params.id, briefings);

    if(!briefing){
        res.sendStatus(500);
        return;
    }

    briefing.deleted = true;
    
    res.send("Briefing apagado com sucesso.").sendStatus(200);

})

//Editar briefing
app.patch("/api/briefing/:id", (req : Request<BriefingEditDTO>, res : Response) => {
    const briefing : Briefing | undefined = getBriefignById(req.params.id, briefings);
    const editInfo : BriefingEditDTO = req.body;

    if(!briefing){
        res.sendStatus(500);
        return;
    }

    if(editInfo.clientName !== undefined && editInfo.clientName !== briefing.clientName){
        briefing.clientName = editInfo.clientName;
    }

    if(editInfo.description !== undefined && editInfo.description !== briefing.description){
        briefing.description = editInfo.description;
    }

    if(editInfo.state !== undefined && editInfo.state !== briefing.state){
        briefing.state = editInfo.state;
    }

    //salvar no bd

    res.send(briefing).sendStatus(200)

})

app.listen(port, () => {
    console.log("Briefing está rodando na porta 3000, acesse http://localhost:3000")
})

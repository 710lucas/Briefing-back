
import express, { Request, Response, response } from 'express';
import { Briefing } from './entity/Briefing';
import { BriefingCreateDTO } from './dtos/BriefingCreateDTO';
import { v4 } from 'uuid';
import { BriefingState } from './enums/BriefingState';
import { BriefingEditDTO } from './dtos/BriefingEditDTO';
import { Database } from './PostgresFunctions';

const app = express();
const port = 3000;

let briefings : Briefing[] = []

const database : Database = new Database();

database.createTables();

app.use(express.json())

app.get('/', (req : Request, res : Response) => {

    res.send("Ola")

})

//Criação de briefing
app.post("/api/briefing", (req : Request<BriefingCreateDTO>, res : Response) => {

    const dto : BriefingCreateDTO = req.body;
    const briefing : Briefing = new Briefing(v4(), dto.clientName, dto.description, new Date(), BriefingState.negociacao);

    database.create(briefing);

    res.sendStatus(200)
})


//Recuperação de briefing
app.get("/api/briefing", (req : Request, res : Response) => {

    let briefings : Briefing[] = []

    database.getAll().then(response => {
        if(response){

            briefings = response
            res.status(200).send(briefings);

        }
        else{
            res.sendStatus(500)
        }
    })

})

//Recuperação de briefing por id
app.get("/api/briefing/:id", (req : Request, res : Response) => {

    if(!req.params.id){
        res.sendStatus(500)
        return;
    }

    database.getById(req.params.id).then(response => {
        if(response !== undefined){
            res.status(200).send(response);
        }
        else{
            res.sendStatus(500)
        }
    })
})

//Apagar briefing
app.delete("/api/briefing/:id", (req : Request, res : Response) => {

    if(!req.params.id){
        res.sendStatus(500)
        return;
    }

    database.getById(req.params.id).then(response => {
        if(!response){
            res.sendStatus(500)
            return;
        }

        const briefing : Briefing = response;

        briefing.deleted = true;

        database.save(briefing).then(response => {
            res.status(200).send("Briefing apagado com sucesso.");
        })


    })
    
})

//Editar briefing
app.patch("/api/briefing/:id", (req : Request<BriefingEditDTO>, res : Response) => {
    if(!req.params.id){
        res.sendStatus(500)
        return;
    }

    database.getById(req.params.id).then(response => {
        if(!response){
            res.sendStatus(500)
            return;
        }

        const briefing : Briefing = response;
        const editInfo : BriefingEditDTO = req.body;

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

        database.save(briefing)

        res.status(200).send(briefing)


    })

})

app.listen(port, () => {
    console.log("Briefing está rodando na porta 3000, acesse http://localhost:3000")
})


export default app;
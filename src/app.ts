
import express, { Request, Response, response } from 'express';
import { Briefing } from './entity/Briefing';
import { BriefingCreateDTO } from './dtos/BriefingCreateDTO';
import { v4 } from 'uuid';
import { BriefingState } from './enums/BriefingState';
import { BriefingEditDTO } from './dtos/BriefingEditDTO';
import { Database } from './PostgresFunctions';
import cors from 'cors';
import { toBriefing } from './dtos/BriefingResponse';

const app = express();

const database: Database = new Database();

database.createTables();

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Gerenciamento de briefings - API")
})

//Criação de briefing
app.post("/api/briefing", (req: Request<BriefingCreateDTO>, res: Response) => {

    const dto: BriefingCreateDTO = req.body;

    if(dto.clientName.trim().length == 0 || dto.description.trim().length == 0){
        res.status(500).send("Nome ou descrição inválidos");
    }

    const briefing: Briefing = new Briefing(v4(), dto.clientName, dto.description, new Date(), BriefingState.negociacao);

    database.create(briefing);

    res.sendStatus(200)
})


//Recuperação de briefing
app.get("/api/briefing", (req: Request, res: Response) => {

    let briefings: Briefing[] = []

    database.getAll().then(response => {
        if (response) {

            briefings = response
            res.status(200).send(briefings);

        }
        else {
            res.sendStatus(500)
        }
    })

})

//Recuperação de briefing por id
app.get("/api/briefing/:id", (req: Request, res: Response) => {

    if (!req.params.id) {
        res.sendStatus(500)
        return;
    }

    database.getById(req.params.id).then(response => {
        if (response !== undefined) {
            res.status(200).send(response);
        }
        else {
            res.sendStatus(500)
        }
    })
})

//Apagar briefing
app.delete("/api/briefing/:id", (req: Request, res: Response) => {

    if (!req.params.id) {
        res.sendStatus(500)
        return;
    }

    database.getById(req.params.id).then(response => {
        if (!response) {
            res.sendStatus(500)
            return;
        }

        const briefing: Briefing = toBriefing(response);

        briefing.deleted = true;

        database.save(briefing).then(response => {
            res.status(200).send("Briefing apagado com sucesso.");
        })


    })

})

//Editar briefing
app.patch("/api/briefing/:id", (req: Request<BriefingEditDTO>, res: Response) => {

    console.log(req.body)

    if (!req.params.id) {
        res.sendStatus(500)
        return;
    }

    database.getById(req.params.id).then(response => {
        if (!response) {
            res.sendStatus(500)
            return;
        }

        const briefing: Briefing = toBriefing(response);
        const editInfo: BriefingEditDTO = req.body;


        if (editInfo.clientName !== undefined && editInfo.clientName !== null && editInfo.clientName !== briefing.clientName) {
            if(editInfo.clientName.trim().length == 0){
                res.status(500).send("Nome inválido")
                return;
            }
            briefing.clientName = editInfo.clientName;
        }

        if (editInfo.description !== undefined && editInfo.description !== null && editInfo.description !== briefing.description) {
            if(editInfo.description.trim().length == 0){
                res.status(500).send("Descrição inválida")
                return;
            }
            briefing.description = editInfo.description;
        }

        if (editInfo.state !== undefined && editInfo.state !== briefing.state) {
            briefing.state = editInfo.state;
        }

        //salvar no bd

        database.save(briefing)

        res.status(200).send(briefing)


    })

})

export default app;
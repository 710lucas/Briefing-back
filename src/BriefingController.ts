
import express, { Request, Response, response } from 'express';
import { Briefing } from './entity/Briefing';
import { BriefingCreateDTO } from './dtos/BriefingCreateDTO';
import { v4 } from 'uuid';
import { BriefingState } from './enums/BriefingState';
import { BriefingEditDTO } from './dtos/BriefingEditDTO';
import { Database } from './PostgresFunctions';
import cors from 'cors';
import { toBriefing } from './dtos/BriefingResponse';
import { BriefingService } from './BriefingService';

const app = express();

// const database: Database = new Database();
const service : BriefingService = new BriefingService();
service.initDB();

// database.createTables();

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Gerenciamento de briefings - API")
})

//Criação de briefing
app.post("/api/briefing", async (req: Request<BriefingCreateDTO>, res: Response) => {


    const response = await service.createBriefing(req.body);
    res.status(response.status).send(response.msg)

})


//Recuperação de briefing
app.get("/api/briefing", async (req: Request, res: Response) => {

    const response = await service.getAllBriefings();
    res.status(response.status).send(response.val);

})

//Recuperação de briefing por id
app.get("/api/briefing/:id", async (req: Request, res: Response) => {

    if (!req.params.id) {
        res.sendStatus(400)
        return;
    }

    const response = await service.getBriefingByid(req.params.id);
    res.status(response.status).send(response.val)

})

//Apagar briefing
app.delete("/api/briefing/:id", async (req: Request, res: Response) => {

    if (!req.params.id) {
        res.sendStatus(400)
        return;
    }

    console.log("AB id, ", req.params.id)

    const response = await service.removeBriefing(req.params.id);
    res.status(response.status).send(response.msg);

})

//Editar briefing
app.patch("/api/briefing/:id", async (req: Request<BriefingEditDTO>, res: Response) => {

    if (!req.params.id) {
        res.sendStatus(400)
        return;
    }

    const response = await service.editBriefing(req.params.id, req.body);
    res.status(response.status).send(response.status == 400 ? response.msg : response.val);

})

export default app;
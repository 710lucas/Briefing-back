import request from "supertest";

import app from "./BriefingController";
import { BriefingCreateDTO } from "./dtos/BriefingCreateDTO";
import { Database, pool } from "./PostgresFunctions";
import { Server } from "http";
import { Briefing } from "./entity/Briefing";
import { BriefingState } from "./enums/BriefingState";

const defaultBriefingCreate : BriefingCreateDTO = {clientName: "test", description: "test description"};

describe("Endpoints API", () => {

    let server : Server;

    beforeAll(async () =>{
        await database.createTables();
        server = app.listen(3000);
    })

    afterAll(async () => {
        await pool.end()
        server.close()
    })

    let createdId : string | undefined = undefined;

    let database : Database = new Database();


    it("Criar um novo briefing", async () => {

        const response = await request(app)
            .post("/api/briefing")
            .send(defaultBriefingCreate)

        expect(response.status).toBe(200);

    });

    it("Criar um briefing inválido", async () => {
        //Cria-se um briefing com informações inválidas e espera um erro
        const invalidNameBriefing : BriefingCreateDTO = {clientName: "", description: "Valid description"};

        const response = await request(app)
            .post("/api/briefing")
            .send(invalidNameBriefing);
        
        expect(response.status).toBe(400);

        const invalidDescriptionBriefing : BriefingCreateDTO = {clientName : "Test", description : ""};

        const response2 = await request(app)
            .post("/api/briefing")
            .send(invalidDescriptionBriefing)

        expect(response2.status).toBe(400)
    })

    it("Pegar todos os briefings", async () => {
        const response = await request(app)
            .get("/api/briefing")
        
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].client_name).toBe(defaultBriefingCreate.clientName);
        expect(response.body[0].description).toBe(defaultBriefingCreate.description);

        createdId = response.body[0].id;
    })

    it("Pegar briefing criado", async () => {
        const response = await request(app)
            .get("/api/briefing/"+createdId)
        expect(response.status).toBe(200);
        expect(response.body.state).toBe("Negociação");
        expect(response.body.deleted).toBe(false);
    })

    it("Editar briefing criado", async () => {
        const response = await request(app)
            .patch("/api/briefing/"+createdId)
            .send({
                clientName: "teste2",
                description: "descrição2"
            })
        expect(response.status).toBe(200);
        expect(response.body.clientName).toBe("teste2");
        expect(response.body.description).toBe("descrição2");
        expect(response.body.state).toBe(BriefingState.negociacao);
    })

    it("Editar briefing criado com informações inválidas", async () => {
        const response = await request(app)
            .patch("/api/briefing/"+createdId)
            .send({
                clientName : "",
                description : ""
            })
        expect(response.status).toBe(400)
    })

    it("Garantindo que nenhuma alteração foi feita ao editar briefing com informações inválidas", async () => {

        const response = await request(app)
            .get("/api/briefing/"+createdId)
        expect(response.status).toBe(200);
        expect(response.body.client_name).toBe("teste2");
        expect(response.body.description).toBe("descrição2");
        expect(response.body.state).toBe(BriefingState.negociacao);
        expect(response.body.deleted).toBeFalsy();
    })

    it("Deletar briefing", async () => {
        const response = await request(app)
            .delete("/api/briefing/"+createdId)
        
        expect(response.status).toBe(200);
    })

    it("Deletar briefing inexistente", async () => {
        const response = await request(app)
            .delete("/api/briefing/1")

        expect(response.status).toBe(400)
    })

    it("Verificando todos os briefings após delete", async () => {
        const response = await request(app)
            .get("/api/briefing")
        expect(response.status).toBe(200);
        console.log(response.body)
        expect(response.body.length).toBe(0);
    })

    it("Verificando getById após delete", async () => {
        const response = await request(app)
            .get("/api/briefing/"+createdId)
        expect(response.status).toBe(400);
    })

})
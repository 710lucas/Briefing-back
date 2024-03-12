import request from "supertest";

import app from ".";
import { BriefingCreateDTO } from "./dtos/BriefingCreateDTO";

const defaultBriefingCreate : BriefingCreateDTO = {clientName: "test", description: "test description"};

describe("Endpoints API", () => {

    let createdId : string | undefined = undefined;

    it("Criar um novo briefing", async () => {
        const response = await request(app)
            .post("/api/briefing")
            .send(defaultBriefingCreate)
        expect(response.status).toBe(200);
    });

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
    })

    it("Deletar briefing", async () => {
        const response = await request(app)
            .delete("/api/briefing/"+createdId)
        
        expect(response.status).toBe(200);
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
        expect(response.status).toBe(500);
    })

})
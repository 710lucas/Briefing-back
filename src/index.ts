import app from "./BriefingController";

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Servidor de gerenciamento de briefings está rodando na porta ", port, "Acesse http://localhost:"+port)
})
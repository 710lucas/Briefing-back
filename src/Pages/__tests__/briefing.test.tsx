import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react'
import { Briefing } from '../Briefing/Briefing';
import { BriefingState, BriefingType } from '../../utils/Api';

describe("Teste de briefings e modal", async () => {

    const defaultBriefing : BriefingType = {
        client_name: "lucas",
        description: "descrição",
        date: new Date(),
        deleted: false,
        id: "id",
        state: BriefingState.negociacao
    }

    it("testando renderização de briefing", async () => {
        render(<Briefing briefing={defaultBriefing} whenSaved={() => {}}></Briefing>)
        const name = screen.queryByText("lucas")
        const description = screen.queryByText("descrição")
        expect(name).not.toBe(null)
        expect(description).not.toBe(null)
    })

    it("testando botão de expandir e diminuir", async () => {
        let expandir = await screen.queryByText("Expandir")
        let diminuir = await screen.queryByText("Diminuir")
        expect(expandir).not.toBeNull();
        expect(diminuir).toBeNull();
        fireEvent.click(expandir!);

        expandir = await screen.queryByText("Expandir")
        diminuir = await screen.queryByText("Diminuir")
        expect(expandir).toBeNull();
        expect(diminuir).not.toBeNull();
        fireEvent.click(diminuir!)

        expandir = await screen.queryByText("Expandir")
        diminuir = await screen.queryByText("Diminuir")
        expect(expandir).not.toBeNull();
        expect(diminuir).toBeNull();
    })

    it("testando botão de modal e modal", async () => {
        window.scrollTo = () => {
            document.documentElement.scrollTop = 100;
          }
        const editar = await screen.queryByText("Editar");
        expect(editar).not.toBeNull();
        fireEvent.click(editar!)

        let fechar = await screen.queryByText("Fechar");
        expect(fechar).not.toBeNull();
        fireEvent.click(fechar!)

        let confirmarFechar = await screen.queryByText("Sim");
        expect(confirmarFechar).not.toBeNull();
        fireEvent.click(confirmarFechar!);

        async function pause(x : number) {
            await new Promise(resolve => setTimeout(resolve, x));
          }
          
         await pause(500);
         //pausa para animação do modal de confirmação, necessário para carregar botão OK

        let confirmarConfirmacao = await screen.queryByText("OK");
        expect(confirmarConfirmacao).not.toBeNull();
        fireEvent.click(confirmarConfirmacao!)

        let salvar = await screen.queryByText("Salvar")
        expect(salvar).toBeNull();
    })

})

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react'
import { Home } from '../Home/Home';

describe("Teste de home", async () => {

    it("testando renderização de home", async () => {
        render(<Home></Home>)
        const name = screen.queryByText("Gestor de Briefings")
        const adicionar = screen.queryByText("Adicionar briefing")
        const expandirTodos = screen.queryByText("Expandir todos")
        expect(name).not.toBe(null)
        expect(adicionar).not.toBe(null)
        expect(expandirTodos).not.toBe(null)
    })

    it("testando botão expandir", async () => {
        let expandirTodos = screen.queryByText("Expandir todos")
        expect(expandirTodos).not.toBe(null)
    })

    it("testando botão criar novo briefing", async () => {
        let adicionar = screen.queryByText("Adicionar briefing")
        expect(adicionar).not.toBeNull();
        fireEvent.click(adicionar!)

        let criar = screen.queryByText("Criar Briefing")
        expect(criar).not.toBeNull();

    })

})
/// <reference types="Cypress" />

import locator from '../support/utils/locators'
import '../support/conta/commandsConta'
import '../support/movimentacao/commandsMov'

describe('Functional tests', () => {
    const user = Cypress.env('user_email')
    const password = Cypress.env('user_psswd')

    before(() => {
        cy.login(user,password)
        cy.resetApp()
    });

    beforeEach(() => {
        Cypress.config('chromeWebSecurity', true);
        cy.get(locator.MENU.HOME)
        cy.resetApp()
    });

    it('Should create a new account', () => {
        cy.acessarMenuContas()
        cy.inserirConta('Conta de teste')
        cy.get(locator.MESSAGE).should('contain', 'Conta inserida com sucesso!')
    });

    it('Should update an account', () => {
        cy.acessarMenuContas()
        cy.alterarConta('Conta para alterar', 'Conta alterada')
        cy.get(locator.MESSAGE).should('contain', 'Conta atualizada com sucesso!')
    });

    it('Should not create an account with same name', () => {
        cy.acessarMenuContas()
        cy.inserirConta('Conta mesmo nome')
        cy.get(locator.MESSAGE).should('contain', 'Erro: Error: Request failed with status code 400')
    });

    it('Should create a financial move', () => {
        cy.acessarMenuMovimentacao()
        cy.inserirMovimentacao('Movimentação de teste', '1200.01', 'Anizio', 'Conta para movimentacoes')
        cy.get(locator.MESSAGE).should('contain', 'Movimentação inserida com sucesso!')
        cy.get(locator.EXTRATO.LINHAS).should('have.length', 7)
        cy.xpath(locator.EXTRATO.VALUE('Movimentação de teste', '1.200')).should('exist')
    });

    it('Must check balance', () => {
        cy.xpath(locator.SALDO.SALDO_CONTA('Conta para saldo')).should('contain','534')
    });

    it('Should remove a financial move', () => {
        cy.get(locator.MENU.EXTRATO).click()
        cy.removerMovimentacao('Movimentacao para exclusao')
        cy.get(locator.MESSAGE).should('contain', 'Movimentação removida com sucesso!')
    });

    it('Edit movement and check balance', () => {
        cy.get(locator.MENU.EXTRATO).click()

        cy.editarMovimentacao('Movimentacao 1, calculo saldo')
        cy.get(locator.MESSAGE).should('contain', 'Movimentação alterada com sucesso!')
        
        cy.get(locator.MENU.HOME).click()
        cy.xpath(locator.SALDO.SALDO_CONTA('Conta para saldo')).should('contain','4.034,00')

    });

});
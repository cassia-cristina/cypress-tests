/// <reference types="Cypress" />

import locator from '../support/utils/locators'
import '../support/conta/commandsConta'
import '../support/movimentacao/commandsMov'
import buildEnv from  '../support/utils/buildEnv'

describe('Frontend tests', () => {

    beforeEach(() => {
        buildEnv()
        cy.login('login@gmail.com', '0000')
        cy.get(locator.MENU.HOME)
    });

    after(() => {
        cy.clearLocalStorage()
    });

    it('Should create a new account', () => {
        cy.acessarMenuContas()

        cy.intercept('POST', '/contas', (req) => {
            req.reply({
                statusCode: 201,
                fixture: 'cadastroConta.json'
            })
        }).as('criarConta')

        cy.intercept('GET', '/contas', (req) => {
            req.reply({
                statusCode: 200,
                fixture: 'contasAtual.json'
            })
        }).as('contasAtual')

        cy.inserirConta('Conta de teste')

        cy.get(locator.MESSAGE).should('contain', 'Conta inserida com sucesso!')
    });

    it('Should update an account', () => {
        cy.acessarMenuContas()

        cy.intercept('PUT', '/contas/**', (req) => {
            req.reply({
                statusCode: 200,
                body: {
                    id: 1031123,
                    nome: 'Conta alterada',
                    visivel: true,
                    usuario_id: 27272
                }
            })
        }).as('update')

        cy.intercept('GET', '/contas', (req) => {
            req.reply({
                statusCode: 200,
                fixture: 'contasUpdate.json'
            })
        }).as('contaAlterada')

        cy.alterarConta('Conta para alterar', 'Conta alterada')

        cy.get(locator.MESSAGE).should('contain', 'Conta atualizada com sucesso!')
    });

    it('Should not create an account with same name', () => {
        cy.acessarMenuContas()

        cy.intercept('POST', '/contas', (req) => {
            req.reply({
                statusCode: 400,
                body: {
                    error: 'Já existe uma conta com esse nome!'
                }
            })
        }).as('mesmoNome')
        cy.inserirConta('Conta mesmo nome')

        cy.get(locator.MESSAGE).should('contain', 'Erro: Error: Request failed with status code 400')
    });

    it('Should create a financial move', () => {
        cy.intercept('POST', '/transacoes', (req) => {
            req.reply({
                statusCode: 201,
                fixture: 'movimentacao.json'
            })
        }).as('createMov')

        cy.intercept('GET', '/extrato/**', (req) => {
            req.reply({
                statusCode: 200,
                fixture: 'extrato.json'
            })
        }).as('extrato')

        cy.acessarMenuMovimentacao()
        cy.inserirMovimentacao('Movimentação de teste', '1200.01', 'Anizio', 'Conta para movimentacoes stub')
        cy.get(locator.MESSAGE).should('contain', 'Movimentação inserida com sucesso!')
        cy.get(locator.EXTRATO.LINHAS).should('have.length', 7)
        cy.xpath(locator.EXTRATO.VALUE('Movimentação de teste', '1.200')).should('exist')
    });

    it('Must check balance', () => {
        cy.xpath(locator.SALDO.SALDO_CONTA('Conta para saldo stub')).should('contain', '534')
    });

    it('Should remove a financial move', () => {
        cy.intercept('GET', '/extrato/**', (req) => {
            req.reply({
                statusCode: 200,
                fixture: 'extrato.json'
            })
        }).as('extrato')
        cy.get(locator.MENU.EXTRATO).click()

        cy.intercept('DELETE', '/transacoes/**', (req) => {
            req.reply({
                statusCode: 204
            })
        }).as('deleteMov')

        cy.intercept('GET', '/extrato/**', (req) => {
            req.reply({
                statusCode: 200,
                fixture: 'extratoRemove.json'
            })
        }).as('extratoEdit')

        cy.removerMovimentacao('Movimentacao para exclusao stub')
        cy.get(locator.MESSAGE).should('contain', 'Movimentação removida com sucesso!')
        cy.xpath(locator.EXTRATO.DESC('Movimentacao para exclusao stub')).should('not.exist')
    });

    it('Edit movement and check balance', () => {
        cy.get(locator.MENU.EXTRATO).click()

        cy.intercept('GET', '/extrato/**', (req) => {
            req.reply({
                statusCode: 200,
                fixture: 'extrato.json'
            })
        }).as('extrato')

        cy.intercept('GET', '/transacoes/**', (req) => {
            req.reply({
                statusCode: 200,
                fixture: 'movimentacaoEdit.json'
            })
        }).as('movimentacoes') 

        cy.intercept('PUT', '/transacoes/**', (req) => {
            req.reply({
                statusCode: 201,
                fixture: 'movimentacaoEdit.json'
            })
        }).as('editMov')
        cy.editarMovimentacao('Movimentacao 1, calculo saldo', 'Conta para movimentacoes stub')

        cy.get(locator.MESSAGE).should('contain', 'Movimentação alterada com sucesso!')

        cy.intercept('GET', '/saldo', (req) => {
            req.reply({
                statusCode: 200,
                fixture: 'saldoEdit.json'
            })
        }).as('saldoEdit')
        
        cy.get(locator.MENU.HOME).click()
        cy.xpath(locator.SALDO.SALDO_CONTA('Conta para movimentacoes stub')).should('contain', '4.034,00')
    });

    it('Must not register an account without a name', () => {
        cy.intercept('POST', '/contas', (req) => {
            req.reply({
                statusCode: 201,
                fixture: 'cadastroConta.json'
            })
            expect(req.body.nome).to.be.not.empty
        }).as('criarConta')

        cy.acessarMenuContas()

        cy.intercept('GET', '/contas', (req) => {
            req.reply({
                statusCode: 200,
                fixture: 'contasAtual.json'
            })
        }).as('contasAtual')        

        cy.inserirConta('Conta de teste')

        cy.get(locator.MESSAGE).should('contain', 'Conta inserida com sucesso!')
    });

    it('Check colors', () => {
        cy.intercept('GET', '/extrato/**', (req) => {
            req.reply({
                statusCode: 200,
                fixture: 'extratoColors.json'
            })
        }).as('extratoColors')

        cy.get(locator.MENU.EXTRATO).click()
        cy.xpath(locator.EXTRATO.DESC('Receita paga')).should('have.class', 'receitaPaga')
        cy.xpath(locator.EXTRATO.DESC('Receita pendente')).should('have.class', 'receitaPendente')
        cy.xpath(locator.EXTRATO.DESC('Despesa paga')).should('have.class', 'despesaPaga')
        cy.xpath(locator.EXTRATO.DESC('Despesa pendente')).should('have.class', 'despesaPendente')
    });

    it('Should test the responsiveness', () => {
        cy.get(locator.MENU.HOME).should('exist').and('be.visible')
        cy.viewport(500,700)
        cy.get(locator.MENU.HOME).should('exist').and('not.be.visible')

        cy.viewport('macbook-13')
        cy.get(locator.MENU.HOME).should('exist').and('be.visible')
    });

});
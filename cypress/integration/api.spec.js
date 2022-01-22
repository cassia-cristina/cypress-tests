/// <reference types="Cypress" />

import '../support/api/commandsApi'

describe('API tests: account registration and transactions', () => {
    let token
    const user = Cypress.env('user_email')
    const password = Cypress.env('user_psswd')

    before(() => {
        //Gera o token e já armazena em uma variavel de ambiente
        cy.getToken(user, password)

    });

    beforeEach(() => {
        cy.resetAccounts()
    });

    it('Should create a new account', () => {
        cy.createAccount('teste conta nova2').as('newAccount')
        // ------ Assertivas com chai
        cy.get('@newAccount').then(resp => {
            expect(resp.status).to.be.equal(201)
            expect(resp).include({ status: 201 })
            expect(resp.body).to.have.property('nome', 'teste conta nova2')
            expect(resp.body.nome).contains('nova')
            expect(resp.body.nome).to.match(/conta/)
            expect(resp.body.nome).to.be.a('String')
        })

    });

    it('Should update an account', () => {
        cy.updateAccount('Conta para alterar', 'Conta alterada rest').as('update')

        cy.get('@update').then(resp => {
            expect(resp.status).to.be.equal(200)
            expect(resp.body.nome).contains('Conta alterada rest')
        })
    });

    it('Should not create an account with same name', () => {
        cy.repeatedAccount('Conta para alterar').as('response')

        cy.get('@response').then(resp => {
            expect(resp.status).to.be.equal(400)
            expect(resp.body.error).to.be.equal('Já existe uma conta com esse nome!')
        })
    });

    it('Should create a financial move', () => {
        cy.createMov('Conta para movimentacoes', 'Movimentação rest', 'Rosalinda', '1400.02').as('transaction')

        cy.get('@transaction').then(resp => {
            expect(resp.status).to.be.equal(201),
            expect(resp.body.valor).to.be.equal('1400.02')
        })

    });

    it('Must check balance', () => {
        cy.getBalance('Conta para saldo').as('balance')

        cy.get('@balance').then(saldo => {
            expect(saldo).to.be.equal('534.00')
        })
    });

    it('Should remove a financial move', () => {
        cy.removeMov('Movimentacao para exclusao').as('remove')

        cy.get('@remove').then(resp => {
            expect(resp.status).to.be.equal(204)
        })

    });

    it('Edit movement and check balance', () => {
        cy.editMov('Movimentacao 1, calculo saldo').as('edit')

        cy.get('@edit').then(resp =>{
            expect(resp).to.include({status:200})
            expect(resp.body).to.have.property('descricao', 'Movimentacao 1, calculo saldo')
            expect(resp.body.status).to.be.equal(true)
        })

        cy.getBalance('Conta para saldo').then(saldo => {
            expect(saldo).to.be.equal('4034.00')
        })
    });

});
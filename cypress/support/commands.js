/// <reference types="Cypress" />

import locator from './locators'

// *** Comandos para a aplicação 1 (pasta: diversos) ***
Cypress.Commands.add('register', (message) => {
    cy.get("input[type='button'][name='formCadastrar']").click()
    cy.get('#resultado > :nth-child(1)').should('contain', message)

})

Cypress.Commands.add('fillForms', usuario => {
    cy.get('#formNome').type(usuario.nome)
    cy.get('[data-cy="dataSobrenome"]').type(usuario.sobrenome)
    cy.get(`[name=formSexo][value=${usuario.sexo}]`).click()
    cy.get(`[name=formComidaFavorita][value=${usuario.comida}]`).click()
    cy.get('#formEscolaridade').select(usuario.escolaridade)
    cy.get('#formEsportes').select(usuario.esportes)
})

Cypress.Commands.add('clickAlert', (locator, message) => {
    cy.get(locator).click()
    cy.on('window:alert', msg => {
        console.log(msg)
        expect(msg).to.be.equal(message)
    })
})

// *** Comandos para a aplicação Barriga React ***
Cypress.Commands.add('login', (user, psswd) => {
    cy.visit('https://barrigareact.wcaquino.me/')
    cy.get(locator.LOGIN.EMAIL).type(user)
    cy.get(locator.LOGIN.PASSWORD).type(psswd)
    cy.get(locator.LOGIN.BTN_LOGIN).click()
    cy.get(locator.MESSAGE).should('contain', 'Bem vindo')
})

Cypress.Commands.add('resetApp', () => {
    cy.get(locator.MENU.SETTINGS).click()
    cy.get(locator.MENU.RESET).click()
})

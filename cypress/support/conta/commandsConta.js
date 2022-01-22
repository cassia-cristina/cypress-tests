/// <reference types="Cypress" />

import locator from './locators'

Cypress.Commands.add('acessarMenuContas', () => {
    cy.get(locator.MENU.SETTINGS).click()
    cy.get(locator.MENU.CONTAS).click()
})

Cypress.Commands.add('inserirConta', conta => {
    cy.get(locator.CONTAS.NAME).type(conta)
    cy.get(locator.CONTAS.BTN_SALVAR).click()
})

Cypress.Commands.add('alterarConta', (contaAnterior, contaNova) => {
    cy.xpath(locator.CONTAS.EDIT(contaAnterior)).click()
    cy.get(locator.CONTAS.NAME)
        .clear()
        .type(contaNova)
    cy.get(locator.CONTAS.BTN_SALVAR).click()
})
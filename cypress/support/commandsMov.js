/// <reference types="Cypress" />

import locator from './locators'

Cypress.Commands.add('acessarMenuMovimentacao', () => {
    cy.get(locator.MENU.MOVIMENTACAO).click()   
})

Cypress.Commands.add('inserirMovimentacao', (desc, value, interest, conta) => {
    cy.get(locator.MOVIMENTACAO.DESCRIPTION).type(desc)
    cy.get(locator.MOVIMENTACAO.VALUE).type(value)
    cy.get(locator.MOVIMENTACAO.INTERESTED).type(interest)
    cy.get(locator.MOVIMENTACAO.SELECT_CONTA).select(conta)
    cy.get(locator.MOVIMENTACAO.STATUS).click()
    cy.xpath(locator.MOVIMENTACAO.BTN_SALVAR).click()
})

Cypress.Commands.add('editarMovimentacao', desc => {
    cy.xpath(locator.EXTRATO.EDIT(desc)).click()
    cy.get(locator.MOVIMENTACAO.DESCRIPTION).should('have.value', desc)
    cy.get(locator.MOVIMENTACAO.STATUS).click()
    cy.xpath(locator.MOVIMENTACAO.BTN_SALVAR).click()
})

Cypress.Commands.add('removerMovimentacao', desc => {
    cy.xpath(locator.EXTRATO.REMOVE(desc)).click()
})
/// <reference types="Cypress" />

import locator from './locators'

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

const buildEnv = () => {
    cy.intercept('POST', '/signin', (req) => {
        req.reply({
            statusCode: 200,
            fixture: 'userFront.json'
        })
    }).as('signin')

    cy.intercept('GET', '/saldo', (req) => {
        req.reply({
            statusCode: 200,
            fixture: 'saldo.json'
        })
    }).as('saldo')

    cy.intercept('GET', '/contas', (req) => {
        req.reply({
            statusCode: 200,
            fixture: 'contas.json'
        })
    }).as('contas')   

}

export default buildEnv
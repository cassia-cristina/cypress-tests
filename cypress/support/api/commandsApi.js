/// <reference types="Cypress" />

import moment from 'moment'

Cypress.Commands.add('getToken', (user, password) => {
    //Faz uma requisição do tipo POST e obtem somente o token - usando o its
    cy.request({
        method: 'POST',
        url: '/signin',
        body: {
            email: user,
            redirecionar: false,
            senha: password
        }
    }).its('body.token').should('not.be.empty').then(token => {
        Cypress.env('token', token)
        return token
    })
})

Cypress.Commands.add('createAccount', (name) => {
    cy.request({
        method: 'POST',
        url: '/contas',
        body: {
            nome: name
        }
    })
})

Cypress.Commands.add('resetAccounts', () => {
    cy.request({
        method: 'GET',
        url: '/reset'
    }).its('status').should('be.equal', 200)
})

Cypress.Commands.add('getAccountId', account => {
    cy.request({
        method: 'GET',
        url: '/contas',
        qs: {
            nome: account
        }
    }).then(resp => { return resp.body[0].id })

})

Cypress.Commands.add('updateAccount', (account, account2) => {
    cy.getAccountId(account).then(contaId => {
        cy.request({
            method: 'PUT',
            url: `/contas/${contaId}`,
            body: {
                nome: account2
            }
        })
    })
})

Cypress.Commands.add('repeatedAccount', account => {
    cy.request({
        method: 'POST',
        url: '/contas',
        body: {
            nome: account
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('createMov', (account, desc, interested, value) => {
    cy.getAccountId(account).then(AccountId => {
        cy.request({
            method: 'POST',
            url: '/transacoes',
            body: {
                conta_id: AccountId,
                data_pagamento: moment().add(1, 'day').format('DD/MM/YYYY'),
                data_transacao: moment().format('DD/MM/YYYY'),
                descricao: desc,
                envolvido: interested,
                status: true,
                tipo: "REC",
                valor: value
            }
        })
    })
})

Cypress.Commands.add('getMov', desc => {
    cy.request({
        method: 'GET',
        url: '/transacoes',
        qs: {
            descricao: desc
        }
    })
})

Cypress.Commands.add('editMov', desc => {
    cy.getMov(desc).then(resp => {
        cy.request({
            method: 'PUT',
            url: `/transacoes/${resp.body[0].id}`,
            body: {
                conta_id: resp.body[0].conta_id,
                data_pagamento: moment(resp.body[0].data_transacao).format('DD/MM/YYYY'),
                data_transacao: moment(resp.body[0].data_pagamento).format('DD/MM/YYYY'),
                descricao: resp.body[0].descricao,
                envolvido: resp.body[0].envolvido,
                observacao: resp.body[0].observacao,
                parcelamento_id: resp.body[0].parcelamento_id,
                status: true,
                tipo: resp.body[0].tipo,
                transferencia_id: resp.body[0].transferencia_id,
                usuario_id: resp.body[0].usuario_id,
                valor: resp.body[0].valor
            }
        })
    })
})

Cypress.Commands.add('getBalance', account => {
    cy.request({
        method: 'GET',
        url: '/saldo'
    }).then(resp => {
        let saldoConta = null
        resp.body.forEach(ct => {
            if (ct.conta === account) { saldoConta = ct.saldo }
        })
        return saldoConta
    })
})

Cypress.Commands.add('removeMov', desc => {
    cy.getMov(desc).then(resp => {
        cy.request({
            method: 'DELETE',
            url: `/transacoes/${resp.body[0].id}`
        })
    })

})

//Sobrescrevendo o request. Mantem as options originais e adiciona uma option (headers) para todas as requests.
Cypress.Commands.overwrite('request', (originalFn, ...options) => {
    if (options.length === 1) {
        if (Cypress.env('token')) {
            options[0].headers = {
                Authorization: `JWT ${Cypress.env('token')}`
            }
        }
    }
    return originalFn(...options)
})
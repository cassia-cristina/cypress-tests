const locators = {
    LOGIN: {
        EMAIL: 'input[data-test="email"]',
        PASSWORD: 'input[data-test="passwd"]',
        BTN_LOGIN: 'button[type="submit"]'
    },
    MENU: {
        HOME: 'a[data-test="menu-home"]',
        MOVIMENTACAO: '[data-test="menu-movimentacao"]',
        EXTRATO: 'a[data-test="menu-extrato"]',
        SETTINGS: 'a[data-test="menu-settings"]',
        CONTAS: 'a[href="/contas"]',
        RESET: 'a[href="/reset"]'
    },
    CONTAS: {
        NAME: 'input[data-test="nome"]',
        BTN_SALVAR: '.form-group > button',
        EDIT: conta => `//table//td[contains(.,"${conta}")]/..//i[@class="far fa-edit"]`
    },
    MOVIMENTACAO: {
        DESCRIPTION: '[data-test="descricao"]',
        TIPO_RECEITA: '[data-test="tipo-receita"]',
        TIPO_DESPESA: '[data-test="tipo-despesa"]',
        VALUE: '[data-test="valor"]',
        INTERESTED: '[data-test="envolvido"]',
        SELECT_CONTA: '[data-test="conta"]',
        BTN_SALVAR: '//button[contains(.,"Salvar")]',
        STATUS: '[data-test="status"]'
    },
    EXTRATO: {
        LINHAS: '.list-group li',
        VALUE: (desc, value) => `//li[contains(.,"${desc}")]//following-sibling::small[contains(.,"${value}")]`,
        REMOVE: desc => `//li[contains(.,"${desc}")]/div/div[2]/i`,
        EDIT: desc => `//li[contains(.,"${desc}")]//a`
    },
    SALDO: {
        SALDO_CONTA: conta => `//td[contains(.,"${conta}")]/following-sibling::td`
    },
    MESSAGE: '.toast-message'

}

export default locators;
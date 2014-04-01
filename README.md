# istim-item

Gerenciamento de itens dos [usuários](https://github.com/istim/istim-user) da plataforma.

## Server URL

http://istimitem.nodejitsu.com/

## Services

Parâmetros em *itálico* representam parâmetros opcionais.

### Autenticação
- Criar sessão
    - ```POST /login```
        - email: string
        - senha: string
- Efetuar logout
    - ```GET|POST|PUT|DELETE /logout```

### Itens do Usuário
- Ver itens do usuário
    - ```GET /useritem/mine```
        - *user_id: string*

### Mercado de Itens
- Ver itens a venda
    - ```GET /sale/for_sale```
        - *user_id: string*
- Ver itens que está vendendo
    - ```GET /sale/selling```
        - *user_id: string*
- Colocar item a venda
    - ```POST /sale/sell```
        - useritem_id: integer
        - *user_id: string*
- Cancelar venda de item
    - ```POST /sale/cancel```
        - sale_id: integer
        - *user_id: string*
- Comprar item
    - ```POST /sale/buy```
        - sale_id: integer
        - *user_id: string*

## Dependências

- **istim-users:** autenticação dos usuários
- **istim-virtualCoin:** validação do dinheiro do jogador para efetuar as transações

## Todo
[ ] Desenvolver os testes para a controladora TradeController
[ ] Criar uma nova documentação da API no [Apiary.io](http://apiary.io/)

## Notas Importantes

Todas as rotas que exigem autênticação possuem um parâmetro opcional *user_id*, esse parâmetro simula o papel do token de acesso do usuário enquanto essa funcionalidade não é implementada na [API de Usuários](https://github.com/istim/istim-user). Esse token é a garantia de identidade do usuário e, no caso, substitui a necessidade de autenticação na API de Itens.

Dessa forma, no momento de integração de todas as APIs, só seria necessário logar na API de Usuários, na restante seria usado o Token como uma forma de garantir a integridade do usuário.

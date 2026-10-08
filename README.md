# PetStore: Automação de Testes de API

Automação de testes de API com **Playwright** e **JavaScript** sobre a entidade **User** da [Swagger Petstore](https://petstore.swagger.io/). O projeto cobre o ciclo completo do usuário (criar, consultar, autenticar, atualizar, excluir e confirmar a exclusão) e executa a criação de usuários com várias massas de dados lidas de um arquivo CSV (Data-Driven Testing).

> Projeto de portfólio desenvolvido na Formação em Teste de Software e Qualidade (QA) da Iterasys.

📹 **Vídeo de demonstração:** https://www.loom.com/share/98317e46521c4df69c6bb28091542b6d

## O que é testado

Um fluxo sequencial de 7 testes, em que cada etapa depende da anterior, mais 1 teste de criação por linha do CSV (3 linhas hoje, 10 testes no total).

| # | Teste | Requisição | O que é validado |
|---|---|---|---|
| 1 | POST user com sucesso | `POST /user` | Status 200; `code` 200; `type` "unknown"; `message` igual ao id enviado |
| 2 | GET user by user name | `GET /user/{username}` | Status 200; todos os campos retornados (id, username, nome, sobrenome, e-mail, senha, telefone e status) iguais aos enviados |
| 3 | GET login | `GET /user/login?username=&password=` | Status 200; `code` 200; mensagem "logged in user session:"; extração do token de sessão |
| 4 | PUT update user | `PUT /user/{username}` | Status 200 após alterar nome, sobrenome, e-mail e telefone |
| 5 | GET user atualizado | `GET /user/{username}` | Status 200; os campos alterados refletem a atualização |
| 6 | DELETE user | `DELETE /user/{username}` | Status 200; `code` 200; `type` "unknown"; `message` igual ao username |
| 7 | GET após DELETE (cenário negativo) | `GET /user/{username}` | Status 404; `code` 1; `type` "error"; mensagem "User not found" |
| 8 a 10 | POST user com DDT | `POST /user` | Um teste por linha do CSV (`gabriela1`, `jane2`, `john3`): status 200, `code` 200, `type` e `message` iguais ao id da linha |

## Estratégia de testes

- **Fluxo CRUD encadeado:** os testes de 1 a 7 usam `test.describe.serial`, pois cada passo depende do estado criado pelo anterior.
- **Data-Driven Testing:** o arquivo `data/csv/users.csv` é lido com `csv-parse`, e cada linha gera um teste de criação de usuário, com o JSON montado dinamicamente a partir das colunas.
- **Massa de dados em JSON:** `data/json/user.json` guarda o usuário usado no fluxo principal.
- **Validação de resposta:** status HTTP, `code`, `type`, `message` e comparação campo a campo entre o que foi enviado e o que foi retornado.
- **Cenário negativo:** consulta de um usuário já excluído, esperando 404 e a mensagem de erro da API.

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Playwright Test | Execução dos testes e requisições HTTP (`request`) |
| JavaScript (Node.js) | Linguagem dos testes |
| csv-parse | Leitura da massa de dados em CSV |
| Git e GitHub | Versionamento |

## Estrutura do projeto

```
petstore-api-testing/
├── data/
│   ├── csv/
│   │   └── users.csv         # massa de dados do teste DDT
│   └── json/
│       └── user.json         # usuário do fluxo principal
├── tests/
│   └── api/
│       └── user.spec.js      # testes da entidade User
├── playwright.config.js      # configuração do Playwright
├── package.json
└── README.md
```

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS)
- Git

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/gabrielazenilins/petstore-api-testing.git
cd petstore-api-testing

# 2. Instalar as dependências
npm install

# 3. Executar todos os testes
npx playwright test

# 4. Abrir o relatório HTML da última execução
npx playwright show-report
```

Para rodar apenas os testes de usuário:

```bash
npx playwright test tests/api/user.spec.js
```

## Observações

- A Swagger Petstore é uma **API pública e compartilhada**. Outras pessoas usam os mesmos dados, então um id ou username pode colidir e, ocasionalmente, a API pode ficar instável ou lenta.
- Os dados dos arquivos de teste (nomes, e-mails e senhas) são **fictícios**.

## Autora

**Gabriela Zeni Lins**: Engenheira Química em transição para QA, com formação em Teste de Software e Qualidade pela Iterasys.

- LinkedIn: https://www.linkedin.com/in/gabrielazenilins/
- GitHub: https://github.com/gabrielazenilins

//Atividade 18 FTS147 - Testes de API com Playwright entidade USER
import {test, expect} from '@playwright/test'
import user from '../../data/json/user.json'
import { parse } from 'csv-parse/sync'
import {readFileSync} from 'fs'

const userAlterado = user;
let token = ''

test.describe.serial('Testes de API - User', async() => {

  test ('POST user com sucesso ', async ({request}) => {
//JSON do user

const response = await request.post('user', {
  data: user
  
})
//Validações
  expect (response.status()).toBe(200)
  const responseJson = await response.json()

  
  expect(responseJson.code).toBe(200)
  expect(responseJson.type).toBe('unknown')
  expect(responseJson.message).toBe(user.id.toString())
        

})

  test ('GET user by user name com sucesso', async ({request}) => {

  const response = await request.get(`user/${user.username}`)
  expect(response.status()).toBe(200)

  const responseJson = await response.json()
    expect(responseJson.id).toBe(user.id)
    expect(responseJson.username).toBe(user.username)
    expect(responseJson.firstName).toBe(user.firstName)
    expect(responseJson.lastName).toBe(user.lastName)
    expect(responseJson.email).toBe(user.email)
    expect(responseJson.password).toBe(user.password)
    expect(responseJson.phone).toBe(user.phone)
    expect(responseJson.userStatus).toBe(user.userStatus)

})

  test('GET login user com sucesso', async ({ request }) => {

        const response = await request.get('user/login', {
            params: {
                username: user.username,
                password: user.password
            }
        })

        expect(response.status()).toBe(200)

        const responseJson = await response.json()

        expect(responseJson.code).toBe(200)
        expect(responseJson.message).toContain('logged in user session:')
        let message = responseJson.message.split(':') 
        token = message[1]
        console.log('=== TOKEN extraido ===')
        console.log(token)
    })

  test('PUT update user com sucesso', async ({request}) => {
      console.log('=== Antes da alteração ===')
    console.log(JSON.stringify(user, null, 2))

    userAlterado.firstName = 'Gabriela Kaenna'
    userAlterado.lastName = 'Zeni Navarro Lins'
    userAlterado.email = 'gabrielazenilins@email.com'
    userAlterado.phone = '4588888888'

    console.log('=== Depois da alteração ===')
    console.log(JSON.stringify(userAlterado, null, 2))

    const response = await request.put(`user/${user.username}`, {
        data: userAlterado
    })

    expect(response.status()).toBe(200)
    
})

  test('GET user atualizado com sucesso', async ({ request }) => {

    const response = await request.get(`user/${user.username}`)

    expect(response.status()).toBe(200)

    const responseJson = await response.json()

    expect(responseJson.firstName).toBe(userAlterado.firstName)
    expect(responseJson.lastName).toBe(userAlterado.lastName)
    expect(responseJson.email).toBe(userAlterado.email)
    expect(responseJson.phone).toBe(userAlterado.phone)
        
    })

  test('DELETE user com sucesso', async ({ request }) => {

    const response = await request.delete(`user/${user.username}`)

    expect(response.status()).toBe(200)

    const responseJson = await response.json()

    expect(responseJson.code).toBe(200)
    expect(responseJson.type).toBe('unknown')
    expect(responseJson.message).toBe(user.username)


})

  test('GET user após DELETE deve retornar 404', async ({ request }) => {

    const response = await request.get(`user/${user.username}`)

    expect(response.status()).toBe(404)

    const responseJson = await response.json()

    console.log('\n=== Resposta do GET após DELETE ===')
    console.log(responseJson)

    expect(responseJson.code).toBe(1)
    expect(responseJson.type).toBe('error')
    expect(responseJson.message).toBe('User not found')
})

// TESTE DE DDT 
  const massa = parse (readFileSync('data/csv/users.csv'), {
    columns: true,
  
  })

   massa.forEach(linha => {
  test(`POST user com DDT ${linha.username}`, async ({request}) => {
    // Montagem dinamica do JSON a partir do arquivo CSV
    const user ={}

    user.id = parseInt(linha.id)
    user.username = linha.username
    user.firstName = linha.firstName
    user.lastName = linha.lastName
    user.email = linha.email
    user.password = linha.password
    user.phone = linha.phone
    user.userStatus = parseInt(linha.userStatus)
  
  // Exibe a massa de dados utilizada

     console.log('\n=== Resposta do POST com DDT ===')
     console.log(user)
      const response = await request.post('user', {
        data: user })

    expect (response.status()).toBe(200)
      const responseJson = await response.json()
    expect(responseJson.code).toBe(200)
    expect(responseJson.type).toBe('unknown')
    expect(responseJson.message).toBe(user.id.toString())
        })

      })

 })
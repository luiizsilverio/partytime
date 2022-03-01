<table>
  <tr>
    <td><img src="https://github.com/luiizsilverio/partytime/blob/main/backend/assets/logo.png" /></td>
    <td><h1>PARTYTIME-API</h1></td>
  </tr>
</table>

## Conteúdo
* [Sobre o Projeto](#sobre-o-projeto)
* [Tecnologias](#hammer_and_wrench-tecnologias)
* [Licença](#balance_scale-licença)
* [Contato](#email-contato)

## Sobre o projeto
API desenvolvida em __Node.js__ com __Mongoose__, durante o curso [MongoDB do básico ao avançado](https://www.udemy.com/course/mongodb-do-basico-ao-avancado-c-mongoose-e-projetos/), do prof. Matheus Battisti.<br />
Possui autenticação JWT, cadastro de eventos (parties) e usuários.<br />


### Rotas da aplicação

| Método | Caminho da Rota | Descrição da Rota |
|---|---|---|
| POST | http://localhost:3000/api/auth/register | Criar um usuário |
| POST | http://localhost:3000/api/auth/login | Login do usuário |
| GET | http://localhost:3000/api/user/:id | Retorna os dados do usuário |
| PUT | http://localhost:3000/api/user | Cria um novo usuário |
| POST | http://localhost:3000/api/party | Inclui novo evento |
| GET | http://localhost:3000/api/party/all | Retorna a lista de eventos públicos |
| GET | http://localhost:3000/api/party/userparties | Retorna os eventos do usuário |
| GET | http://localhost:3000/api/party/userparty/:id | Retorna os dados do evento |
| GET | http://localhost:3000/api/party/:id | Retorna os dados do evento |
| DELETE | http://localhost:3000/api/party | Exclui um evento |
| PUT | http://localhost:3000/api/party | Altera um evento |

## :hammer_and_wrench: Tecnologias
* __Node.js__
* __Mongoose ORM__ para acessar o banco
* __Cors__ para liberar acesso à API
* __jsonwebtoken__ para criar uma sessão
* __Multer__ para fazer upload de imagens

## :balance_scale: Licença
Este projeto está licenciado sob a [licença MIT](LICENSE).

## :email: Contato

E-mail: [**luiiz.silverio@gmail.com**](mailto:luiiz.silverio@gmail.com)

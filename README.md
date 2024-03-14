# Sistema de gerenciamento de Briefings

**OBS.:** O back funciona normalmente sem o front, porém é recomendado que se use o front para um uso mais fácil da ferramenta. [Acesse o repositório do front](https://github.com/710lucas/Briefing-front)

Atenção: também é possível acessar o front através da [branch front](https://github.com/710lucas/Briefing-back/tree/front). Porém, rodando pela branch os testes automatizados não funcionam, é necessário acessar o repositório dedicado ao front

Se for utilizado o front através da branch nesse repositório, adapte as etapas à branch



1. [Como rodar](#como-rodar)
   
    1.2. [Com docker](#com-docker)

    1.3. [Sem o docker](#sem-o-docker)

2. [Uso de IAs](#uso-de-ias)

## Como rodar

É possível rodar o projeto tanto com o Docker quanto usando o Node direto no seu computador

### Com Docker

1. Tenha o Docker instalado no seu computador: [Veja aqui como baixar e instalar](https://www.docker.com/get-started/)
2. Clone ou baixe o repositório

    Depois de baixar o docker, você precisa ter o repositório em seu computador, pois ele contem os arquivos essenciais para que o docker consiga rodar o projeto

    Para fazer isso, basta executar o comando `git clone https://github.com/710lucas/Briefing-back.git` ou `git clone git@github.com:710lucas/Briefing-back.git`
   
    Caso você não possua o github baixado em seu computador, basta licar [neste link](https://github.com/710lucas/Briefing-back/archive/refs/heads/main.zip), ou clicar no botão verde "Code" e depois "Download zip", depois extraia a pasta e continue

3. Executar o docker

    Entre na pasta que você acabou de clonar/baixar e abra um terminal

    Use o comando `docker compose up` e o programa estará funcionando, uma mensagem irá aparecer no terminal falando que o back está rodando na porta 3000, ou outra porta, caso seja informada nas configurações

### Sem o docker

1. Baixe e configure o postgresql no seu computador: [Link](https://www.postgresql.org/)

2. Crie a database

    Crie uma database chamada briefing, um usuário chamado postgres com a senha postgres
   
    Se você quiser usar uma database com um nome, usuário, senha e portas customizadas, adicione as suas configurações no arquivo .env usando as seguintes váriaveis:
   
    `POSTGRES_USER` Para usuário
   
    `POSTGRES_PASSWORD` Para senha
   
    `POSTGRES_DB` Para database
   
    `POSTGRES_HOST` Para outro endereço ip (padrão: localhost)
   
    `POSTGRES_PORT` Para porta

4. Deixe o postgres rodando no fundo
5. Baixe e configure o [NodeJS](https://nodejs.org/en) no seu computador
6. Clone ou baixe o repositório

    Depois de baixar o docker, você precisa ter o repositório em seu computador, pois ele contem os arquivos essenciais para que o docker consiga rodar o projeto

    Para fazer isso, basta executar o comando `git clone https://github.com/710lucas/Briefing-back.git` ou `git clone git@github.com:710lucas/Briefing-back.git`
   
    Caso você não possua o github baixado em seu computador, basta licar [neste link](https://github.com/710lucas/Briefing-back/archive/refs/heads/main.zip), ou clicar no botão verde "Code" e depois "Download zip", depois extraia a pasta e continue

7. Instale as dependencias

    Entre na pasta que você acabou de clonar/baixar e abra um terminal
    Em seguida rode o comando `npm install`

8. Rodar o programa

   Ainda no terminal, execute o comando `npm run dev`

-----

## Uso de IAs

Para a realização deste projeto, foi utilizado o ChatGPT 3.5, o uso do ChatGPT foi feito para:

1. Compreensão de problemas e auxilio em sua resolução:

    Quando havia algum problema que estava tomando mais tempo que o normal, o uso do ChatGPT para identificar o problema foi bastante importante, além de agilizar bastante o processo. Porém, nenhum problema foi resolvido 100% pelo ChatGPT, principalmente pelo fato de que várias respostas não se encaixavam no contexto geral do aplicativo, gerando mais problemas do que resolvendo.

2. Dúvidas em relação à novas áreas do conhecimento:

   Alguns dos critérios de entrega foram completamente novos para mim, principalmente a parte de testes, tanto no back, quanto no front. Sendo assim, o uso do ChatGPT para gerar exemplos de testes, nos quais eu pude editar o código e compreender antes de implementar no projeto, agilizou bastante a compreensão de algo completamente novo. Além da geração de arquivos de configuração, que foram usados como exemplos e me ajudaram bastante a entender como configurar o projeto especificamente para minhas necessidades.

3. Geração de textos de exemplos:

  Foram gerados exemplos de descrições de Briefings usando o ChatGPT, ajudando bastante a testar o design do site e adapta-lo a exemplos mais próximos da realidade

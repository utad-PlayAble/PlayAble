<div align="center">
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/3d0bf903-621e-4d04-8aaf-50c9f3cc3e79">
    <img alt="Logo do PlayAble" height=200 src="https://github.com/user-attachments/assets/1637a2a1-0520-4649-ba35-849c38cfd4b2">
  </picture>
</div>

# playAble - Plataforma digital de minijogos didáticos e acessíveis ![build](https://github.com/utad-playAble/playAble/actions/workflows/dotnet.yml/badge.svg)

Este projeto foi desenvolvido no âmbito da unidade curricular Interação Pessoa Computador da [Licenciatura em Engenharia Informática da Universidade de Trás-os-Montes e Alto Douro](https://www.utad.pt/estudar/cursos/engenharia-informatica/).

## Configuração

Uma vez baixado o código fonte disponível neste repositório e instaladas todas as bibliotecas necessárias, é necessário criar a base de dados que será usada pela aplicação.

Para isto, basta executar o seguinte comando na pasta em que se encontra o ficheiros `.csproj` (`utad.playAble`)
```cmd
dotnet ef database update
```

É possível que as ferramentas que fornecem este comando não estejam instaladas no seu computador, originando um erro; neste caso, é necessário instalá-las usando o comando `dotnet tool install --global dotnet-ef` e, uma vez instaladas, executar novamente comando supracitado.

Após este passo, a plataforma está pronta a ser executada e usada, não sendo necessária configuração adicional. 

É ainda necessário criar o ficheiro ``utad.PlayAble/appsettings.json``, configurando nele a connection string para a base de dados, bem como os detalhes de login para o email a ser usado pela plataforma.

## Adicionar jogos

A plataforma playAble permite adicionar jogos ao repositório de forma simples, uma vez que a lista dos jogos em base de dados, bem como a lista de categorias, é atualizada cada vez que a aplicação é iniciada. Os jogos devem ser desenvolvidos para a web e capazes de rodar stand-alone num navegador; a página principal do jogo deve ser chamada `index.html`, uma vez que será para esta que o utilizador será redirecio quando clicar no botão de jogar. Os jogos na playAble são executados apenas pelo seu index, não sendo visível qualquer parte da plataforma durante a gameplay.

Para adicionar um jogo, basta criar um diretório com o short name que pretendemos usar para jogo no diretório `utad.PlayAble/wwwroot/games` e colocar o código fonte do mesmo nesta pasta. O short name que escolhermos será usado no URL do jogo. É também necessário criar, no mesmo diretório, uma pasta chamada `playable-meta`,  onde serão armazenados os ficheiros necessários para o jogo aparecer na plataforma. Neste diretório deve existir um ficheiro `meta.json` com os metadados do jogo, bem como uma imagem `thumb.png`, que será mostrada na página do jogo, na home page e em resultados de pesquisa. O ficheiro json tem o seguinte formato:

```json
{
  "Title": "nome do jogo",
  "Description": "pequena descrição do jogo, que aparece na home page e resultados de pesquisa e que é pesquisável",
  "Instructions": "instruções de como jogar|a barra vertical separa as instruções em bullet points|são mostradas na página do jogo",
  "Credits": "créditos para os criadores do jogo, em texto corrido",
  "Category": "categoria_que_será_usada_para_agrupar_o_jogo_com_outros_semelhantes"
}
```

### Exemplo prático

Para adicionar o jogo [Bomboclat](https://github.com/Daydream127/CG-BOMBERMAN) ao playAble, em primeiro lugar devemos garantir que é possível rodar o jogo no browser, apenas com os seus ficherios de código fonte, sem recurso a qualquer sistema externo como o Node.js. Neste caso, é necessário garantir que as bibliotecas usadas pelo jogo (como o Three.js) são importadas pelo ficheiro .html, de forma a que o jogo possa ser executado apenas com um navegador. 

Após garantir que o jogo está a funcionar isoladamente, devemos criar um diretório no caminho `/wwwroot/games/` com o nome que desejarmos; para este exemplo vamos usar "Bomboclat". É também necessário criar, dentro deste diretório, um chamado `playable-meta`. 

Dentro do diretório `playable-meta`, criamos o ficheiros `meta.json`, que preenchemos de forma apropriada. Copiamos também uma imagem, `thumb.png`, que será mostrada aos utilizadores sempre que este jogo aparecer.

```json
{
  "Title": "Bomboclat",
  "Description": "Jogo no estilo Bomberman onde se tem de fugir de ratos assassinos e de apanhar moedas para progredir.",
  "Instructions": "Usa as teclas W-A-S-D para mover o bombardeiro, a tecla C para mudar a câmera e a tecla ESPAÇO para colocar uma bomba.|Tens três vidas, o objetivo é apanhar todas as moedas sem morrer.|Levas dano quando os ratos de atacam ou quando te explodes com uma das tuas bombas.|Tens de usar as bombas para partir os obstáculos no teu caminho e para atacar os teus inimigos, uma bomba dá dano em até três blocos de distância.",
  "Credits": "Este jogo foi criado no âmbito da unidade curricular de Computação Gráfica da Licenciatura em Engenharia Informática da Universidade de Trás-os-Montes e Alto Douro por David Santos, Diogo Pinto, Filipa Monteiro e João Esteves. O seu código fonte está disponível no repositório Daydream127/CG-BOMBERMAN do GitHub.",
  "Category": "Arcade"
}
```

Podemos agora copiar o código fonte do jogo para dentro do primeiro diretório; no fim, a estrutura de ficheiros deverá assemelhar-se à seguinte, podendo ainda incluir outros ficheiros necessários para o funcionamento do jogo:

```
utad.PlayAble
  └───wwwroot
      └───games
          └───Bomboclat            // pasta com o short name (usado no url) que escolhemos
              │   index.html       // (nome obrigatório) página principal do código-fonte do jogo  
              └───playable-meta    // (nome obrigatório) pasta para os metadados do jogo
                      meta.json    // (nome obrigatório) configuração usada para criar o jogo na base de dados
                      thumb.png    // (nome obrigatório) imagem que será mostrada sempre que o jogo aparecer
```

Este jogo, corretamente configurado, está disponível neste repositório no caminho [``utad.PlayAble/wwwroot/games/Bomboclat``](https://github.com/utad-PlayAble/PlayAble/tree/master/utad.PlayAble/wwwroot/games/Bomboclat).

## Remover jogos

Neste momento, não existe um sistema automático para remover jogos após estes terem sido integrados na base de dados. Assim, para remover um jogo, recomenda-se k seguinte procedimento:

1. Identificar a entrada relativa ao jogo a remover na tabela `Games` da base de dados e anotar o seu `Id`.
2. Remover todas as entradas que contenham o ID supracitado da tabela `UserFavoriteGames`.
3. Remover a entrada do jogo na tabela `Games`.
4. Remover a pasta do jogo do diretório `/wwwroot/games/`.

Este procedimento deve ser realizado por utilizadores com experiência em bases de dados SQL, com a aplicação encerrada, e com todos os devidos cuidados para evitar perdas de dados indesejadas. 

## Fair use

Este projeto foi desenvolvido no contexto de uma unidade curricular universitária, com fins exclusivamente educacionais e sem qualquer objetivo lucrativo. Para facilitar a avaliação do trabalho realizado e ilustrar a funcionalidade da plataforma com diversos exemplos, este repositório inclui alguns jogos que não são de nossa autoria.

Os jogos selecionados têm seu código-fonte original disponível publicamente na internet e são utilizados apenas para demonstrar a operação da plataforma com uma variedade de jogos. Eles são empregados sem fins lucrativos, ao abrigo do fair use e com a devida atribuição nos metadados usados para configurar a plataforma, bem como nas páginas dos respectivos jogos acessíveis ao usuário.

Disponibilizamos abaixo uma lista completa dos jogos incluídos neste repositório, acompanhada dos links onde o códigos-fonte dos mesmos pode ser encontrado. É importante salientar que o código disponível neste repositório pode diferir do código fonte original devido à possível necessidade de adaptar os jogos ao nosso sistema, bem como a atualizações que os jogos poderão ter recebido depois de terem sido integrados neste projeto.

* [Bomboclat](https://github.com/Daydream127/CG-BOMBERMAN)
* [King Tiles](https://thefrugalgamer.itch.io/kings-tiles)
* [Racer](https://github.com/jakesgordon/javascript-racer/)
* [Clumsy Bird](https://github.com/ellisonleao/clumsy-bird)
* [2048](https://github.com/gabrielecirulli/2048)
* [0hh1](https://github.com/florisluiten/0hh1)
* [Hextris](https://github.com/Hextris/hextris)
* [MathQuiz](https://github.com/Jisll/MathGame)

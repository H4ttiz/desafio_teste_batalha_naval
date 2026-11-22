# Batalha naval - tabuleiro 10 x 10

**Colaborador:** Leonardo Bezerra da Silva.

**RA:** 24000726-2.

## Especificação do desafio

Base: [desafios da disciplina](https://github.com/JoaoChoma/teste_software_2026/blob/main/desafios.md). Implementação e testes em JavaScript, conforme solicitado. Este projeto é independente e deve ser publicado em um repositório chamado **desafio_teste_batalha_naval**.

Cada jogador possui um tabuleiro 10 x 10, com índices 0 a 9, e exatamente quatro navios: um porta-aviões de 5 casas, um encouraçado de 4, um submarino de 3 e um destróier de 2. Foi escolhida a alternativa destróier prevista no enunciado, sem adicionar um hidroavião extra.

Os navios são posicionados horizontalmente (`H`) ou verticalmente (`V`), sem sair do tabuleiro nem se sobrepor. Navios podem ser adjacentes: não se impõe uma distância mínima não prevista no enunciado. Um posicionamento inválido não ocupa casas parcialmente. Não é possível reposicionar navios depois do primeiro tiro.

O tiro retorna água, acerto ou afundamento, incluindo o tipo do navio quando há acerto. Coordenadas inválidas e tiros repetidos são rejeitados. A frota completa é necessária antes do combate. A partida entre dois jogadores começa com o jogador 0 e alterna a vez após cada tiro válido, inclusive acertos, como convenção desta implementação.

A destruição das 14 casas da frota adversária declara o vencedor e bloqueia ações de combate posteriores. A classe `Tabuleiro` trata a frota e os tiros; `BatalhaNaval` coordena preparação, turnos e vitória de dois jogadores.

## Executar

Requisito: Node.js 22 ou superior, com npm. O projeto não possui dependências externas; não é necessário executar `npm install`.

```bash
npm test
npm run coverage
```

O primeiro comando executa todos os testes com `node:test` e `node:assert/strict`. O segundo acrescenta o relatório de cobertura nativo do Node. O processo termina com código diferente de zero se algum teste falhar.

## Exemplo de uso

```javascript
import { Tabuleiro } from './src/batalha-naval.js';
const alvo = new Tabuleiro();
alvo.posicionar('porta-avioes', 0, 0, 'H');
alvo.posicionar('encouracado', 1, 0, 'H');
alvo.posicionar('submarino', 2, 0, 'H');
alvo.posicionar('destroier', 3, 0, 'H');
console.log(alvo.atirar(3, 0)); // { resultado: 'acertou', navio: 'destroier' }
```

Os exemplos são executados como módulos ES, em um arquivo `.js` dentro deste projeto. A lógica fica em [src/batalha-naval.js](src/batalha-naval.js) e os testes em [test/batalha-naval.test.js](test/batalha-naval.test.js).

## Casos de teste e funcionamento

Cada teste prepara uma partida independente, executa uma ação pública do motor e compara o resultado ou o estado esperado. Operações inválidas são verificadas com `assert.throws`; quando relevante, o estado anterior e posterior também é comparado. Os testes não substituem a implementação por mocks.

| Caso | Comportamento verificado |
|---|---|
| CT01 | frota possui os quatro navios de tamanhos exigidos |
| CT02 | aceita posicionamento horizontal na ultima coluna permitida |
| CT03 | aceita posicionamento vertical na ultima linha permitida |
| CT04 | rejeita navios fora do tabuleiro sem posicionar parcialmente |
| CT05 | rejeita sobreposicao, duplicidade, tipo e direcao invalidos |
| CT06 | tiros distinguem agua, acerto e afundamento |
| CT07 | rejeita tiros repetidos e coordenadas invalidas |
| CT08 | exige frota completa e impede reposicionamento apos tiro |
| CT09 | destruir as 14 casas encerra a frota |
| CT10 | exige duas frotas prontas, jogador valido e alternancia |
| CT11 | partida completa declara vencedor e bloqueia novos tiros |
| CT12 | acerto sem afundamento tambem alterna a vez entre os jogadores |
| CT13 | navios adjacentes sao permitidos lado a lado |
| CT14 | agua retornada por BatalhaNaval mantem shape {resultado,navio} |

## Evidências da execução

Execução em 22/11/2026, Node.js 24.15.0: **14 testes aprovados, zero falhas, zero ignorados**. Saída completa em [evidencias/testes.log](evidencias/testes.log).

Cobertura do arquivo de produção: **100.00% de linhas, 100.00% de ramificações e 100.00% de funções**. Os percentuais são do arquivo `src/batalha-naval.js`; não foi usada a média que inclui o código dos testes. Cobertura indica código exercitado e não prova ausência de defeitos ou atendimento de variantes não especificadas.

## Organização e entrega

`src/` contém o motor do jogo; `test/` contém os casos automatizados; `evidencias/` registra o resultado real. O projeto não exige navegador, banco ou interface gráfica. Há uma configuração de GitHub Actions para repetir os testes a cada push ou pull request.

O professor exige um repositório por desafio e aceita no máximo cinco para avaliação. Este pacote é uma entrega individual do colaborador acima.

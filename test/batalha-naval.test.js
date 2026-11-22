import test from 'node:test';
import assert from 'node:assert/strict';
import { Tabuleiro, BatalhaNaval, FROTA } from '../src/batalha-naval.js';

function posicionar(alvo, jogador) {
  Object.keys(FROTA).forEach((tipo, linha) =>
    jogador === undefined ? alvo.posicionar(tipo, linha, 0, 'H') : alvo.posicionar(jogador, tipo, linha, 0, 'H'));
  return alvo;
}
const pronto = () => posicionar(new Tabuleiro());

test('CT01 - frota possui os quatro navios de tamanhos exigidos', () => {
  assert.deepEqual(Object.values(FROTA), [5,4,3,2]);
  assert.equal(pronto().pronto, true);
});
test('CT02 - aceita posicionamento horizontal na ultima coluna permitida', () => {
  const t = new Tabuleiro(); t.posicionar('porta-avioes', 9, 5, 'H');
  assert.equal(t.pronto, false);
});
test('CT03 - aceita posicionamento vertical na ultima linha permitida', () => {
  const t = new Tabuleiro(); t.posicionar('porta-avioes', 5, 9, 'V');
});
test('CT04 - rejeita navios fora do tabuleiro sem posicionar parcialmente', () => {
  const t = new Tabuleiro();
  assert.throws(() => t.posicionar('porta-avioes', 9, 6, 'H'), RangeError);
  t.posicionar('porta-avioes', 9, 5, 'H');
});
test('CT05 - rejeita sobreposicao, duplicidade, tipo e direcao invalidos', () => {
  const t = new Tabuleiro(); t.posicionar('porta-avioes', 0, 0, 'H');
  assert.throws(() => t.posicionar('encouracado', 0, 2, 'V'));
  assert.throws(() => t.posicionar('porta-avioes', 5, 0, 'H'));
  assert.throws(() => t.posicionar('outro', 0, 0, 'H'), RangeError);
  assert.throws(() => t.posicionar('submarino', 3, 0, 'X'), RangeError);
});
test('CT06 - tiros distinguem agua, acerto e afundamento', () => {
  const t = pronto();
  assert.deepEqual(t.atirar(9,9), { resultado:'agua', navio:null });
  assert.deepEqual(t.atirar(3,0), { resultado:'acertou', navio:'destroier' });
  assert.deepEqual(t.atirar(3,1), { resultado:'afundou', navio:'destroier' });
  assert.equal(t.derrotado, false);
});
test('CT07 - rejeita tiros repetidos e coordenadas invalidas', () => {
  const t = pronto(); t.atirar(9,9);
  assert.throws(() => t.atirar(9,9));
  for (const [l,c] of [[10,0], [-1,0], [0,10], [0,0.5]])
    assert.throws(() => t.atirar(l,c), RangeError);
  assert.equal(t.tiros, 1);
});
test('CT08 - exige frota completa e impede reposicionamento apos tiro', () => {
  assert.throws(() => new Tabuleiro().atirar(0,0));
  const t = pronto(); t.atirar(9,9);
  assert.throws(() => t.posicionar('submarino', 8,0,'H'));
});
test('CT09 - destruir as 14 casas encerra a frota', () => {
  const t = pronto();
  Object.values(FROTA).forEach((n,l) => { for (let c=0;c<n;c++) t.atirar(l,c); });
  assert.equal(t.derrotado, true);
  assert.throws(() => t.atirar(9,9));
});
test('CT10 - exige duas frotas prontas, jogador valido e alternancia', () => {
  const j = new BatalhaNaval();
  assert.throws(() => j.atirar(0,0,0));
  assert.throws(() => j.posicionar(2,'submarino',0,0,'H'), RangeError);
  posicionar(j,0); posicionar(j,1);
  assert.throws(() => j.atirar(1,0,0));
  j.atirar(0,9,9);
  assert.equal(j.estado.vez, 1);
  assert.throws(() => j.atirar(0,8,9));
});
test('CT11 - partida completa declara vencedor e bloqueia novos tiros', () => {
  const j = new BatalhaNaval(); posicionar(j,0); posicionar(j,1);
  let agua = 90;
  Object.values(FROTA).forEach((n,l) => {
    for (let c=0;c<n;c++) {
      j.atirar(0,l,c);
      if (j.estado.vencedor === null) { j.atirar(1,Math.floor(agua/10),agua%10); agua--; }
    }
  });
  assert.equal(j.estado.vencedor, 0);
  assert.throws(() => j.atirar(1,8,0));
});
test('CT12 - acerto sem afundamento tambem alterna a vez entre os jogadores', () => {
  const j = new BatalhaNaval(); posicionar(j,0); posicionar(j,1);
  const r = j.atirar(0,0,0);
  assert.deepEqual(r, { resultado:'acertou', navio:'porta-avioes' });
  assert.equal(j.estado.vez, 1);
  const r2 = j.atirar(1,0,0);
  assert.deepEqual(r2, { resultado:'acertou', navio:'porta-avioes' });
  assert.equal(j.estado.vez, 0);
});
test('CT13 - navios adjacentes sao permitidos lado a lado', () => {
  const t = new Tabuleiro();
  t.posicionar('porta-avioes', 0, 0, 'H');
  t.posicionar('encouracado', 1, 0, 'H');
  t.posicionar('submarino', 2, 0, 'H');
  t.posicionar('destroier', 3, 0, 'H');
  assert.equal(t.pronto, true);
});
test('CT14 - agua retornada por BatalhaNaval mantem shape {resultado,navio}', () => {
  const j = new BatalhaNaval(); posicionar(j,0); posicionar(j,1);
  const r = j.atirar(0, 9, 9);
  assert.deepEqual(r, { resultado:'agua', navio:null });
});

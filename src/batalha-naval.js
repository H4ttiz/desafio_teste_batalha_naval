export const FROTA = Object.freeze({ 'porta-avioes': 5, encouracado: 4, submarino: 3, destroier: 2 });

export class Tabuleiro {
  #navios = new Map(); #tiros = new Set();
  #chave(l, c) {
    if (![l, c].every(n => Number.isInteger(n) && n >= 0 && n < 10))
      throw new RangeError('Coordenada invalida');
    return l * 10 + c;
  }
  posicionar(tipo, l, c, direcao) {
    if (this.#tiros.size) throw new Error('Nao pode posicionar apos os tiros');
    if (!Object.hasOwn(FROTA, tipo) || !['H', 'V'].includes(direcao))
      throw new RangeError('Navio ou direcao invalida');
    if (this.#navios.has(tipo)) throw new Error('Navio ja posicionado');
    const casas = Array.from({ length: FROTA[tipo] }, (_, i) =>
      this.#chave(l + (direcao === 'V' ? i : 0), c + (direcao === 'H' ? i : 0)));
    if ([...this.#navios.values()].some(n => n.some(casa => casas.includes(casa))))
      throw new Error('Sobreposicao de navios');
    this.#navios.set(tipo, casas);
  }

  atirar(l, c) {
    if (!this.pronto) throw new Error('Posicione a frota completa');
    if (this.derrotado) throw new Error('Frota ja destruida');
    const chave = this.#chave(l, c);
    if (this.#tiros.has(chave)) throw new Error('Tiro repetido');
    this.#tiros.add(chave);
    for (const [tipo, casas] of this.#navios)
      if (casas.includes(chave))
        return { resultado: casas.every(n => this.#tiros.has(n)) ? 'afundou' : 'acertou', navio: tipo };
    return { resultado: 'agua', navio: null };
  }

  get pronto() { return this.#navios.size === 4; }
  get derrotado() {
    return this.pronto && [...this.#navios.values()].every(n => n.every(c => this.#tiros.has(c)));
  }
  get tiros() { return this.#tiros.size; }
}

export class BatalhaNaval {
  #tabuleiros = [new Tabuleiro(), new Tabuleiro()]; #vez = 0; #vencedor = null;
  posicionar(jogador, ...args) {
    this.#jogador(jogador);
    this.#tabuleiros[jogador].posicionar(...args);
  }
  #jogador(j) { if (j !== 0 && j !== 1) throw new RangeError('Jogador invalido'); }
  atirar(jogador, l, c) {
    this.#jogador(jogador);
    if (this.#vencedor !== null) throw new Error('Partida encerrada');
    if (!this.#tabuleiros.every(t => t.pronto)) throw new Error('Frotas incompletas');
    if (jogador !== this.#vez) throw new Error('Fora da vez');
    const alvo = this.#tabuleiros[1 - jogador];
    const resultado = alvo.atirar(l, c);
    if (alvo.derrotado) this.#vencedor = jogador;
    else this.#vez = 1 - jogador;
    return resultado;
  }
  get estado() { return { vez: this.#vez, vencedor: this.#vencedor }; }
}

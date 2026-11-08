/* Adaptador para o app existente. Carregue com <script src="historico.js"></script>. */
(function (root) {
  'use strict';
  const UUID = 'b213c74a-3f6d-4a92-98f1-cbb892aa4d10';
  function decodificar(view) {
    if (view.byteLength < 28 || view.getUint32(0, true) !== 0x3148474f || view.getUint8(4) !== 1 || view.getUint8(5) !== 32)
      throw new Error('Formato de histórico incompatível.');
    const n = view.getUint16(6, true);
    if (n > 10 || view.byteLength !== 28 + n * 32) throw new Error('Página de histórico incompleta.');
    const pagina = { total: view.getUint16(8, true), flags: view.getUint16(10, true),
      maisAntigo: view.getUint32(12, true), maisNovo: view.getUint32(16, true),
      cursor: view.getUint32(20, true), identidade: view.getUint32(24, true), registros: [] };
    for (let i = 0; i < n; i++) {
      const p = 28 + 32 * i;
      const r = { id: view.getUint32(p, true), inicioUnix: view.getUint32(p + 4, true),
        fimUnix: view.getUint32(p + 8, true), amareloMs: view.getUint32(p + 12, true),
        azulMs: view.getUint32(p + 16, true), metaMs: view.getUint32(p + 20, true),
        ativoMs: view.getUint32(p + 24, true), vencedor: view.getUint8(p + 28),
        motivo: view.getUint8(p + 29), capturas: view.getUint16(p + 30, true), identidade: pagina.identidade };
      if (r.id <= (pagina.registros.at(-1)?.id ?? pagina.cursor) || r.vencedor > 2 || r.motivo < 1 || r.motivo > 3)
        throw new Error('Registro de histórico inválido.');
      pagina.registros.push(r);
    }
    return pagina;
  }
  async function sincronizar(service, rx) {
    // Todas as escritas GATT do app devem ser serializadas com esta operação.
    const hist = await service.getCharacteristic(UUID);
    const escrever = texto => (rx.writeValueWithResponse || rx.writeValue).call(rx,new TextEncoder().encode(texto));
    await escrever('T,' + Math.floor(Date.now() / 1000));
    let cursor = 0, primeira, registros = [], flags = 0;
    for (let i = 0; i < 10; i++) {
      await escrever('H,' + cursor);
      const p = decodificar(await hist.readValue());
      if (p.cursor !== cursor) throw new Error('Outra leitura de histórico está em andamento.');
      if (!primeira) primeira = p;
      if (p.identidade !== primeira.identidade) throw new Error('O histórico foi reiniciado durante a leitura. Tente novamente.');
      if (cursor && p.maisAntigo > cursor + 1 && cursor < primeira.maisNovo)
        throw new Error('O histórico avançou durante a leitura. Sincronize novamente.');
      flags |= p.flags;
      const novos = p.registros.filter(r => r.id <= primeira.maisNovo);
      registros.push(...novos);
      if (!novos.length || novos.at(-1).id >= primeira.maisNovo)
        return { registros, identidade: primeira.identidade, maisAntigo: primeira.maisAntigo,
          maisNovo: primeira.maisNovo, gravaçãoPendente: Boolean(flags & 1), relógioSincronizado: Boolean(flags & 2) };
      cursor = novos.at(-1).id;
    }
    throw new Error('Limite de páginas excedido.');
  }
  function mesclar(antigos, novos) {
    return [...new Map([...antigos, ...novos].map(r => [r.identidade + ':' + r.id, r])).values()];
  }
  function resumoDiario(registros, timeZone = 'America/Sao_Paulo') {
    const formato = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
    const grupos = new Map();
    for (const r of mesclar([], registros)) {
      const dia = r.fimUnix ? formato.format(new Date(r.fimUnix * 1000)) : 'Data desconhecida';
      if (!grupos.has(dia)) grupos.set(dia, { dia, concluidas: 0, interrompidas: 0, vitoriasAmarelo: 0, vitoriasAzul: 0, amareloMs: 0, azulMs: 0, ativoMs: 0 });
      const g = grupos.get(dia);
      if (r.motivo === 1) { g.concluidas++; if (r.vencedor === 1) g.vitoriasAmarelo++; if (r.vencedor === 2) g.vitoriasAzul++; }
      else g.interrompidas++;
      g.amareloMs += r.amareloMs; g.azulMs += r.azulMs; g.ativoMs += r.ativoMs;
    }
    return [...grupos.values()];
  }
  root.OvergrownHistory = { UUID, decodificar, sincronizar, mesclar, resumoDiario };
})(globalThis);

# App Overgrown atualizado

Publique **index.html e historico.js juntos na mesma pasta**. Não há instalação, build nem backend. O endereço deve usar HTTPS para Web Bluetooth. Se usar GitHub Pages, substitua/adicone esses dois arquivos na raiz publicada do repositório; se usar outra cloud estática, publique o conteúdo desta pasta. Nenhuma publicação foi feita por esta entrega.

A versão compatível da central está no pacote de firmware desta entrega, em `Overgrown_ESP32/Central/Central.ino`. Use ESP32 Dev Module, core Espressif 3.3.11 e partição Huge APP (3MB). As periféricas já gravadas permanecem compatíveis.

## O que mudou

- Busca automática dos registros na flash ao conectar, botão “Buscar da central” e nova busca nas transições relevantes e a cada 30 s enquanto conectado.
- Sincronização de hora ao conectar/buscar. A central pode ficar sem o celular durante as partidas.
- Resultados importados alimentam a mesma lista, o backup JSON e as exportações PNG/PDF. IDs do banco + partida evitam duplicação após reconexão, nova importação e restauração em outro celular.
- Registros antigos do navegador são mantidos. Registros aproximados do firmware antigo não são fundidos automaticamente com os da flash: não é possível garantir a correspondência.
- Filtro “Sem data” para jogos encerrados antes de a central ter referência de horário. Eles não são atribuídos artificialmente ao dia da sincronização.
- Resumo diário de vitórias e tempos de domínio na tela e no cabeçalho dos relatórios. Interrupções são identificadas como parciais.
- Contagem de pré-jogo/15 s e pausa vêm da telemetria da central. Meta, pré-jogo e brilho têm confirmação de leitura.
- Limites alinhados: meta 1–180 min, pré-jogo 0–180 min e brilho 1–100%. Tempos editáveis apenas no pré-jogo.
- Falhas na leitura, na flash da central ou no armazenamento do navegador são informadas. Comandos e sincronização não disputam operações GATT no app.

## Uso

1. Grave o firmware atualizado na central.
2. Abra o app publicado e conecte uma vez no começo do evento, para enviar a hora e buscar registros existentes.
3. O celular pode desconectar durante o jogo. A central guarda as últimas 64 partidas encerradas, inclusive interrupções por reset/início forçado.
4. Reconecte e aguarde a mensagem de sincronização. Escolha o dia para ver/exportar o relatório. Os horários e o agrupamento usam o fuso do celular.
5. Faça backup do navegador, principalmente antes de mudar de domínio/cloud: o armazenamento local pertence ao endereço do site. Importe o JSON no endereço novo para recuperar os dados que já não estiverem entre os 64 da central.

Não habilite “Erase All Flash” ao atualizar firmware se quiser preservar os resultados gravados. A central não tem RTC com bateria: após desligar, conecte novamente para acertar a hora. Uma partida interrompida por falta de energia antes de seu encerramento não é recuperada; os resultados já gravados permanecem. Sincronize antes de exceder 64 partidas sem coleta.

## Validação

O firmware final compilou no core 3.3.11: 1.820.827 bytes de programa (57% da Huge APP) e 69.604 bytes de RAM global (21%).

O JavaScript foi executado em ambiente de teste com DOM, armazenamento e BLE simulados: leitura em várias páginas, preservação de histórico antigo, deduplicação em reconexão/outro celular, backup importado, interrupções, filtro sem data, resumo diário, contagem de 15 segundos, pré-jogo zero, fluxo de exportação e tratamento de falha de armazenamento. Nos testes de exportação, o canvas foi simulado; isso valida o fluxo e a construção do PDF, não a aparência visual do arquivo.

Ainda falta testar o conjunto com a central física, o navegador/celular e a persistência após desligar. O app não foi publicado nem o novo firmware gravado automaticamente.

Referência para HTTPS e compatibilidade do Web Bluetooth: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API

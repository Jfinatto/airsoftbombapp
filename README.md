# Overgrown — Jogo, Relatórios e Testes

Publique **index.html e historico.js juntos** no GitHub Pages. É um site estático, sem instalação nem build. Use HTTPS e navegador compatível com Web Bluetooth.

## Versão de 09/11/2026

- **Jogo:** placar e controles essenciais da partida.
- **Relatórios:** busca do histórico, resumo por dia e imagens PNG. Sem PDF nem download JSON; importação de backup antigo preservada.
- **Testes:** oito saídas individuais, botões/diagnóstico, brilho e ajuste do pulso da principal.
- **Silenciar todos os sons:** corta sirenes e buzzers, inclusive em andamento. A seleção permanece salva após desligar.

Entre no modo teste durante o pré-jogo. A contagem fica congelada. Componentes desativados não são acionados pelos testes. Use “Voltar ao jogo” para retomar.

O app precisa da nova versão nas **três ESP32**. A apresentação das periféricas foi preservada. A central agora deixa os 10 pixels inferiores vazios por causa do aço.

## Relatórios em imagem

Selecione um dia com partidas em Relatórios. As imagens são preparadas automaticamente. Use “Salvar / compartilhar imagem” ou “Baixar PNG”. Os downloads podem ficar em Downloads, e não na galeria. Há prévia que pode ser mantida pressionada no celular e link para abrir. Relatórios longos são divididos em páginas.

O compartilhamento nativo aparece quando suportado. O download direto não depende dele. As imagens são geradas localmente.

## Dados

O histórico existente do navegador é preservado. A central mantém um buffer circular de até 64 partidas recentes; somente resultados datados sobrevivem ao desligamento. Conecte uma vez após ligar para enviar hora/fuso, e o celular pode desconectar durante as partidas. O placar de vitórias do OLED zera ao ligar e na virada do dia, separadamente do histórico.

As regras completas estão em `Overgrown_ESP32/ATUALIZACAO_09_NOV.md` no pacote completo. Não habilite “Erase All Flash” ao atualizar se quiser preservar o histórico.

## Verificações

Testado em Chrome real com BLE simulado, em largura de celular e desktop: todos os botões de teste, controles de saídas, pulso, silêncio, busca, armazenamento e erros. PNGs foram baixados e abertos como imagens reais. Compartilhamento verificado com arquivo pronto e gesto ativo, usando destino simulado. Ainda falta testar no equipamento e celular físicos.

As prévias `previa-jogo.png` e `previa-testes.png` são capturas do navegador com dados simulados. Esta entrega não publica o site nem grava placas automaticamente.

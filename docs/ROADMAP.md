# Roadmap com critérios de aceite

## Entregue — 0.2

- 20 casos interativos, seis trilhas, evidências sintéticas e consequências de decisões.
- Busca, filtros, mapa conceitual, registro, progresso local e exportação JSON.
- Avaliação determinística e testes de regressão de impacto colateral.
- Benchmark e fontes primárias. Workflows de CI e publicação estática manual.

## Próximo — motor de redes: motor de redes

Implementar DHCP → ARP → DNS → conexão TCP/HTTP por eventos discretos. Configuração deve determinar o resultado sem ações que simplesmente definem `success=true`. Aceite: testes de timeout, gateway inválido, DNS bloqueado, regressão de segmentação e replay determinístico. Capturas devem ser rotuladas sintéticas até existir serialização de pacotes testada.

## Próxima etapa: OT

Modelo de operações de leitura/escrita, janela de manutenção e canais aprovados. Acrescentar evidência de protocolo e matriz de fluxos. Aceite: negar escrita fora da janela sem interromper leitura; distinguir política TCP de inspeção de função; documentar ausência de modelo físico.

## Etapa posterior: investigação e CTI

Novos casos com hipóteses concorrentes, linha do tempo temporal, relações de fontes e validade de indicadores. Rubricas humanas para texto livre. Aceite: erros de atribuição por infraestrutura compartilhada e duplicação de fontes não podem gerar conclusão de alta confiança.

## Etapa posterior: exportação e interoperabilidade

Adaptador Containerlab para subconjunto implementado; depois intercâmbio STIX 2.1 e integrações opcionais MISP/OpenCTI. Aceite: validação dos artefatos com ferramentas de destino e limitações de round-trip documentadas. Sem prometer compatibilidade pela extensão do arquivo.

## Pendências de QA

Validação visual em navegador, navegação completa por teclado e checagem automatizada de acessibilidade ainda não executadas nesta entrega. CI do motor e build não substitui esses testes. Antes de anunciar prontidão para sala de aula: validar mobile/desktop, exportação real e persistência por recarga em navegador.

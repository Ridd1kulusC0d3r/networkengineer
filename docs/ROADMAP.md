# Roadmap com critérios de aceite

## Entregue — 0.1

- 12 casos interativos, seis trilhas, evidências sintéticas e consequências de decisões.
- Busca, filtros, mapa conceitual, registro, progresso local e exportação JSON.
- Avaliação determinística e testes de regressão de impacto colateral.
- Benchmark e fontes primárias. Workflows de CI e publicação estática manual.

## Próximo — 0.2: motor de redes

Implementar DHCP → ARP → DNS → conexão TCP/HTTP por eventos discretos. Configuração deve determinar o resultado sem ações que simplesmente definem `success=true`. Aceite: testes de timeout, gateway inválido, DNS bloqueado, regressão de segmentação e replay determinístico. Capturas devem ser rotuladas sintéticas até existir serialização de pacotes testada.

## 0.3: OT

Modelo de operações de leitura/escrita, janela de manutenção e canais aprovados. Acrescentar evidência de protocolo e matriz de fluxos. Aceite: negar escrita fora da janela sem interromper leitura; distinguir política TCP de inspeção de função; documentar ausência de modelo físico.

## 0.4: investigação e CTI

Novos casos com hipóteses concorrentes, linha do tempo temporal, relações de fontes e validade de indicadores. Rubricas humanas para texto livre. Aceite: erros de atribuição por infraestrutura compartilhada e duplicação de fontes não podem gerar conclusão de alta confiança.

## 0.5: exportação e interoperabilidade

Adaptador Containerlab para subconjunto implementado; depois intercâmbio STIX 2.1 e integrações opcionais MISP/OpenCTI. Aceite: validação dos artefatos com ferramentas de destino e limitações de round-trip documentadas. Sem prometer compatibilidade pela extensão do arquivo.

## Pendências de QA

Validação visual em navegador, navegação completa por teclado e checagem automatizada de acessibilidade ainda não executadas nesta entrega. CI do motor e build não substitui esses testes. Antes de anunciar prontidão para sala de aula: validar mobile/desktop, exportação real e persistência por recarga em navegador.

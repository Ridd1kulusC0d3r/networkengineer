# Arquitetura 0.1

Aplicação estática em módulos ES, sem dependências de runtime. Esta entrega escolhe JavaScript nativo para manter o primeiro laboratório executável sem instalação. React/TypeScript podem ser adotados quando o editor de topologia justificar a complexidade adicional.

## Separação de responsabilidades

- `src/scenarios.js`: dados versionados, evidências, efeitos permitidos e condições finais.
- `src/engine.js`: funções puras `createSession`, `inspect`, `act`, `evaluate`, `report`, `restore`.
- `src/app.js`: DOM, busca, filtros, hash de cenário, persistência e download.
- `src/style.css`: identidade visual, estados, responsividade e foco de teclado.
- `tests/engine.test.js`: caminhos de solução e regressões que distinguem restauração de serviço de correção segura.

## Modelo

Um cenário tem `id`, `version`, `track`, `kind`, `title`, `brief`, `objective`, `nodes`, `evidence`, `initial`, `actions`, `checks`, `explanation`, `references` e `minutes` (estimativa editorial, não medição).

A ação é uma transição explícita no estado. A avaliação compara as condições finais e exige inspeção das evidências. Não avalia a veracidade de texto livre e não representa um mecanismo de certificação. Cenários operacionais abstraem configuração e disponibilidade; cenários analíticos abstraem decisões e confiança.

O contador de eventos é um relógio lógico, não tempo de protocolo. Repetir a mesma sequência gera o mesmo estado. Funções não mutam entradas. Progresso restaurado é reconstruído a partir de eventos válidos; estados e resultados persistidos não são tratados como autoridade. Mesmo assim, o usuário controla o navegador e pode editar os dados: não existe segurança antifraude.

## Persistência e exportação

Chaves `networkengineer:v1:<id>` em localStorage. Não há transmissão. Sessões incompatíveis ou corrompidas recomeçam do estado inicial. Notas limitadas a 8.000 caracteres; histórico de restauração limitado a 5.000 eventos. Exportação JSON identifica `synthetic: true`, `model: rule-based` e inclui apenas evidências inspecionadas. Não há importação arbitrária de relatórios nem suporte STIX.

## Fronteiras de fidelidade

- Estados são modelados, não derivados de uma pilha de pacotes.
- O mapa não é editável e não contém encaminhamento de pacotes.
- OT: controle local é uma condição lógica; nenhuma dinâmica física ou função safety é simulada.
- TLS: validade de identidade é uma condição; não há criptografia.
- Tor/I2P: relações conceituais, não circuitos reais ou garantias de anonimato.
- Os domínios `.example` e faixas documentais são fictícios. Os rótulos SERVICE-A/B não são onion addresses.

## Evolução

Adicionar um motor de eventos de rede como módulo independente, mantendo casos analíticos neste motor de decisões. Não usar o mesmo checkbox como substituto silencioso de handshake ou evidência de tráfego. Exportações para Containerlab só devem ser anunciadas depois de testes do laboratório gerado.

# Guia de uso — Network Engineer

Laboratório de autoestudo com 20 casos: Redes (2), OT (2), Cyber (10), CTI (2), Darkweb (2) e Darknet (2). Os casos usam evidências sintéticas e transições por regras. Não executam comandos contra redes reais.

## 1. Primeiro acesso

1. Abra a página inicial e escolha uma trilha na lateral. Em telas pequenas, as trilhas e os cartões ficam em faixas horizontais.
2. Use “Buscar cenário” para procurar título, descrição ou trilha. Limpe a busca se o caso desejado não aparecer.
3. Clique no cartão do laboratório. O endereço ganha o identificador do caso após `#`, permitindo compartilhar qual exercício abrir.
4. Leia a missão antes de tomar decisões. O objetivo inclui preservar serviços ou evitar inferências indevidas, não somente deixar um indicador verde.

O link de um caso não contém seu progresso. Cada pessoa começa com seu próprio estado salvo no navegador.

## 2. Entenda a bancada

| Elemento | Como usar | O que significa |
|---|---|---|
| Missão | Leia antes de investigar | Condições que sua solução precisa satisfazer |
| 01 / Mapa do caso | Identifique participantes e relações | Diagrama conceitual, não tráfego real |
| Indicadores OK/PENDENTE | Compare antes e depois das ações | Estado atual dos requisitos do modelo |
| 02 / Evidências | Abra E1, E2 e E3 | Observações sintéticas com nome da fonte |
| 03 / Decisões | Escolha uma intervenção ou conclusão | Ação que altera o estado do exercício |
| 04 / Registro da investigação | Revise a sequência | Eventos T01, T02…; ordem lógica, não segundos |
| Sua hipótese e justificativa | Explique evidência, decisão e incerteza | Texto livre salvo e exportado; não recebe nota automática |
| Verificar resultado | Execute após investigar e agir | Checa requisitos finais e abertura das evidências |
| Exportar relatório JSON | Baixe sua tentativa | Inclui estado, ações, evidências abertas e avaliação |
| Reiniciar caso | Confirme para recomeçar | Apaga o progresso local somente daquele caso |
| Referências e limites | Expanda ao final | Fontes conceituais e limites de fidelidade |

## 3. Exercício guiado: DNS sem perder segmentação

Caso: `net-dns` — “IP recebido. Serviço invisível.”

1. Abra a trilha Redes e selecione o caso.
2. Abra E1: existe um lease válido. Receber IP não garante que o DNS funcione.
3. Abra E2: o acesso por IP funciona, mas a consulta ao resolvedor falha.
4. Abra E3: uma regra bloqueia UDP/53 para o resolvedor autorizado.
5. Registre a hipótese: “A conectividade por IP está funcional; a falha observada é compatível com o bloqueio da consulta DNS.”
6. Para observar o efeito colateral, escolha “Liberar todo o tráfego”. A resolução fica OK, mas a segmentação fica pendente.
7. Clique em “Verificar resultado”. O caso não deve ser aprovado: disponibilidade sozinha é insuficiente.
8. Escolha “Restaurar política restritiva” e depois “Permitir DNS somente ao resolvedor”.
9. Verifique novamente. Com todas as evidências abertas, os objetivos devem ser atendidos.
10. Exporte o JSON. Observe que o histórico preserva a tentativa inadequada e a correção final.

A aprovação verifica o estado final, não penaliza tentativas anteriores. O histórico permite ao instrutor discutir como você chegou à solução.

## 4. Exercício guiado: restaurar não é apenas ter backup

Caso: `cyber-backup` — “Backup verde, restauração incerta”.

1. Leia as três evidências. Sucesso do job de backup não demonstra recuperação testada.
2. Tente “Liberar serviço após validação” no estado inicial. O motor deve informar que falta um pré-requisito, sem registrar uma ação bem-sucedida.
3. Execute “Restaurar em ambiente isolado”.
4. Execute “Validar integridade e dados”.
5. Execute “Liberar serviço após validação”.
6. Escreva quais verificações sustentam a recuperação e quais testes de negócio ainda seriam necessários em ambiente real.
7. Verifique e exporte o resultado.

Os pré-requisitos representam a ordem deste exercício. Não substituem o plano de resposta e recuperação da sua organização.

## 5. Exercício guiado: uma alegação não é confirmação

Caso: `dw-claim` — “A alegação não é a prova”.

1. Abra a publicação original, o repost e a observação interna.
2. Identifique que o repost depende da mesma origem: duas publicações não são duas confirmações independentes.
3. Selecione “Registrar alegação não confirmada”.
4. Selecione “Marcar repost como derivado”.
5. Selecione “Definir confiança baixa na alegação”.
6. Registre o que falta verificar. Baixa confiança não significa que a alegação seja falsa.
7. Verifique e exporte o relatório.

Este caso não acessa a darkweb nem contém material vazado real. A competência praticada é avaliação de evidências.

## 6. Sequência sugerida de aprendizagem

| Etapa | Casos | Pergunta central |
|---|---|---|
| Fundamentos | net-dns → net-dhcp | Qual camada ou política explica o sintoma? |
| Segurança técnica | cyber-tls → cyber-egress → cyber-waf | A correção preserva autenticação e serviço? |
| Resposta | cyber-session → cyber-mfa → cyber-ransom | O que precisa ser contido e preservado? |
| Recuperação | cyber-secret → cyber-storage → cyber-backup | A recuperação e o acesso foram verificados? |
| Triagem | cyber-scan → cti-shared → cti-expiry | O contexto sustenta a classificação? |
| OT | ot-conduit → ot-write | A ação preserva supervisão e controle local? |
| Investigação | dw-claim → dw-clone → dn-tor → dn-i2p | O que pode ser concluído e o que continua desconhecido? |

## 7. Como interpretar a avaliação

A porcentagem é a fração de verificações satisfeitas: requisitos do caso mais a checagem de que todas as evidências foram abertas. Não é probabilidade de uma hipótese, nível real de segurança, nota de certificação ou avaliação do texto escrito.

É possível concluir um caso clicando nas soluções conhecidas. Para aprender, tente justificar cada ação antes de executá-la. Nos casos analíticos, separe fato observado, hipótese e confiança.

Modelo de anotação:

- Observação: o que E1/E2/E3 realmente mostram?
- Hipótese: qual explicação é compatível com essas observações?
- Alternativa: que outra explicação ainda não foi excluída?
- Decisão: qual ação tem o menor impacto necessário?
- Validação: qual resultado demonstra a correção?
- Limite: o que este modelo não permite afirmar?

## 8. Salvar, compartilhar e retomar

O progresso fica no armazenamento local do navegador, separado por caso. Fechar a aba normalmente mantém esse progresso; limpar os dados do site, trocar de navegador ou usar navegação privada pode removê-lo.

GitHub Pages e a versão chatgpt.site são origens diferentes: o progresso de uma não aparece automaticamente na outra. Exporte suas tentativas antes de migrar. Não há importação de JSON nesta versão.

O relatório JSON contém identificação e versão do caso, estado, evidências abertas, histórico, anotação e avaliação. Ele é uma exportação de autoestudo, sem assinatura ou garantia antifraude. Ao compartilhá-lo, confira primeiro o texto livre que você escreveu.

## 9. Uso por instrutores

1. Defina quais casos e requisitos serão discutidos.
2. Peça uma hipótese antes de cada intervenção.
3. Solicite o JSON e uma explicação oral ou escrita, sem tratar a porcentagem como prova de domínio.
4. Discuta tentativas inadequadas e efeitos colaterais no histórico.
5. Avalie separadamente qualidade da evidência, hipóteses alternativas, justificativa da ação e limites da conclusão.

Não há turma, conta, sincronização, envio automático ao professor ou correção de texto por IA.

## 10. Problemas comuns

| Sintoma | O que fazer |
|---|---|
| GitHub Pages retorna 404 | Confira se o workflow Publish GitHub Pages terminou e se a origem é GitHub Actions |
| Caso não aparece | Selecione Todas e limpe a busca; a busca considera título, descrição e trilha |
| Pré-requisito não atendido | Reveja a ordem das etapas; não há alteração de estado quando a ação é rejeitada |
| Indicadores OK mas avaliação incompleta | Abra todas as evidências e verifique novamente |
| Progresso sumiu ao mudar de endereço | O armazenamento é específico da origem e do navegador |
| Exportação não apareceu | Confira downloads e políticas de download do navegador |
| Aplicação não abre por file:// | Sirva o projeto por HTTP conforme README |
| Resultado já aparece resolvido | Use Reiniciar caso se quiser uma tentativa limpa |

## 11. Limites importantes

Os mapas são fixos, as evidências são sintéticas e o motor aplica regras. Não há emulação de PLC, handshake real, pacotes PCAP, rede Tor/I2P ou ações contra serviços externos. As referências explicam conceitos, mas não certificam a implementação. A validação visual completa permanece pendente.

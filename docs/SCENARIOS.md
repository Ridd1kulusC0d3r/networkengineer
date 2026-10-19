# Catálogo de cenários

20 casos executáveis por regras, todos sintéticos. Cyber contém 10 casos.

## net-dns — IP recebido. Serviço invisível.

- Trilha: Redes; modelo operacional; versão 1.
- Objetivo: Restaurar a resolução sem liberar o segmento inteiro.
- Contexto: A filial recebeu um endereço, mas portal.example não abre. O teste por IP funciona.
- Evidências: lease.txt, probe.log, firewall.log.
- Avaliação: Resolução DNS responde; Segmentação preservada; inspecionar todas as evidências.
- Limite: O lease não garante resolução. O teste por IP isola o defeito de DNS; a correção deve preservar a política de acesso.
- Referência: https://www.rfc-editor.org/rfc/rfc1035

## net-dhcp — A oferta que não chega

- Trilha: Redes; modelo operacional; versão 1.
- Objetivo: Restabelecer DHCP sem aceitar ofertas de portas de usuário.
- Contexto: Após uma alteração de switch, novos clientes não recebem lease. Clientes antigos continuam operando.
- Evidências: client.log, switch.log, change.txt.
- Avaliação: Cliente recebe oferta autorizada; Ofertas não autorizadas bloqueadas; inspecionar todas as evidências.
- Limite: A confiança de DHCP snooping pertence à porta que leva ao servidor autorizado. Modelo didático: não implementa DORA em bytes nem temporizadores.
- Referência: https://www.rfc-editor.org/rfc/rfc2131

## ot-conduit — A HMI perdeu a leitura

- Trilha: OT; modelo operacional; versão 1.
- Objetivo: Recuperar leitura autorizada e manter a rede corporativa isolada.
- Contexto: A célula industrial continua em controle local, mas a HMI perdeu visibilidade após uma alteração no firewall.
- Evidências: asset.csv, flow.log, process.log.
- Avaliação: Leitura da HMI disponível; TI continua isolada do PLC; Controle local preservado; inspecionar todas as evidências.
- Limite: Disponibilidade e segmentação precisam ser verificadas juntas. TCP/502 permitido não restringe funções de escrita: este cenário modela o conduíte, não um firewall DPI.
- Referência: https://attack.mitre.org/matrices/ics/

## ot-write — Leitura permitida, escrita indevida

- Trilha: OT; modelo operacional; versão 1.
- Objetivo: Restringir escrita e preservar supervisão e controle local.
- Contexto: Uma estação de manutenção pode enviar uma escrita fora da janela. A supervisão precisa continuar lendo.
- Evidências: audit.log, matrix.csv, process.log.
- Avaliação: Escrita fora da janela negada; Supervisão preservada; Controle local preservado; inspecionar todas as evidências.
- Limite: Exercício de política abstrata. Uma implementação real exigiria controle no endpoint, gateway ou inspeção de protocolo capaz de distinguir operações.
- Referência: https://attack.mitre.org/matrices/ics/

## cyber-egress — Conter sem apagar o negócio

- Trilha: Cyber; modelo operacional; versão 1.
- Objetivo: Conter o endpoint, preservar pedidos e registrar evidências.
- Contexto: Um endpoint comprometido mantém conexões externas. Um bloqueio global derrubaria o sistema de pedidos.
- Evidências: edr.json, flows.csv, case.txt.
- Avaliação: Endpoint contido; Pedidos continuam operando; Eventos preservados; inspecionar todas as evidências.
- Limite: O resultado exige contenção com escopo, continuidade e evidência. A interface não executa ações de EDR ou firewall reais.
- Referência: https://www.misp-project.org/warninglists/

## cyber-tls — O atalho do certificado

- Trilha: Cyber; modelo operacional; versão 1.
- Objetivo: Restaurar conexão autenticada sem desligar a verificação.
- Contexto: Uma aplicação passou a rejeitar o certificado após mudança de domínio. Desativar validação parece resolver.
- Evidências: tls.log, change.txt, policy.txt.
- Avaliação: Certificado corresponde ao serviço; Validação continua habilitada; inspecionar todas as evidências.
- Limite: Criptografia sem validação da identidade não resolve este incidente. Não há handshake ou criptografia real neste modelo.
- Referência: https://www.rfc-editor.org/rfc/rfc8446

## cti-shared — Mesmo IP, mesmo adversário?

- Trilha: CTI; modelo analítico; versão 1.
- Objetivo: Registrar infraestrutura compartilhada, confiança baixa e necessidade de corroborar.
- Contexto: Dois domínios aparecem no mesmo IP de CDN. Um relatório os atribui ao mesmo operador.
- Evidências: passive-dns.csv, provider.txt, source-review.txt.
- Avaliação: Sem atribuição indevida; Confiança calibrada; inspecionar todas as evidências.
- Limite: IP compartilhado é uma relação de infraestrutura, não prova de identidade. Uma warninglist alerta para revisão; não prova benignidade.
- Referência: https://www.misp-project.org/warninglists/

## cti-expiry — O indicador envelheceu

- Trilha: CTI; modelo analítico; versão 1.
- Objetivo: Retirar bloqueio automático, manter histórico e pedir revalidação.
- Contexto: Um feed antigo recomenda bloquear um IP. O endereço agora atende um serviço legítimo compartilhado.
- Evidências: feed.json, current.txt, review.txt.
- Avaliação: Sem bloqueio cego; Histórico preservado; Revalidação solicitada; inspecionar todas as evidências.
- Limite: Indicadores exigem contexto e validade temporal. Este exercício não implementa interoperabilidade MISP/STIX.
- Referência: https://www.misp-project.org/warninglists/

## dw-claim — A alegação não é a prova

- Trilha: Darkweb; modelo analítico; versão 1.
- Objetivo: Distinguir alegação de incidente confirmado e verificar independência das fontes.
- Contexto: Uma captura sintética de um site de vazamentos menciona a organização fictícia Aurora.
- Evidências: capture.txt, repost.txt, internal.txt.
- Avaliação: Alegação separada de fato; Dependência de fontes identificada; Confiança explicitada; inspecionar todas as evidências.
- Limite: Darkweb descreve conteúdo/serviços acessados por redes específicas. Reposts não multiplicam evidência. Não há acesso a sites reais ou dados vazados.
- Referência: https://community.torproject.org/onion-services/overview/

## dw-clone — Espelho ou imitação?

- Trilha: Darkweb; modelo analítico; versão 1.
- Objetivo: Evitar atribuição baseada em aparência e preservar a proveniência.
- Contexto: Dois serviços sintéticos exibem a mesma identidade visual. Um agregador declara que são do mesmo operador.
- Evidências: capture-a.txt, capture-b.txt, origin.txt.
- Avaliação: Sem atribuição visual automática; Proveniência preservada; inspecionar todas as evidências.
- Limite: Similaridade de conteúdo é uma pista, não uma identidade criptográfica. SERVICE-A/B são rótulos; não são endereços onion.
- Referência: https://community.torproject.org/onion-services/overview/

## dn-tor — O caminho não tem saída

- Trilha: Darknet; modelo analítico; versão 1.
- Objetivo: Corrigir o modelo de caminho e os limites da atribuição.
- Contexto: Um diagrama de investigação coloca um exit relay entre cliente e serviço onion.
- Evidências: destination.txt, diagram.txt, attribution.txt.
- Avaliação: Caminho onion sem saída pública; Sem atribuição ao relay; inspecionar todas as evidências.
- Limite: Onion services permanecem na rede Tor e não usam exit relay. A figura é conceitual; não simula construção de circuitos nem anonimato.
- Referência: https://community.torproject.org/onion-services/overview/

## dn-i2p — Indisponível não significa removido

- Trilha: Darknet; modelo analítico; versão 1.
- Objetivo: Separar falha de observação, disponibilidade e conclusão de remoção.
- Contexto: Um serviço I2P sintético não responde em uma única observação. Surge a hipótese de derrubada definitiva.
- Evidências: attempt.txt, router.txt, second.txt.
- Avaliação: Conclusão calibrada; Hipótese local considerada; Verificação adicional planejada; inspecionar todas as evidências.
- Limite: I2P é uma rede sobreposta distinta do Tor. Neste exercício, darknet significa rede de anonimato; não significa telescope de IPs não usados.
- Referência: https://i2p.net/en/docs/overview/intro/

## cyber-session — Senha trocada. Sessão ativa.

- Trilha: Cyber; modelo operacional; versão 1.
- Objetivo: Invalidar a sessão, proteger novos acessos e preservar a auditoria.
- Contexto: Uma conta sofreu phishing. A senha foi alterada, mas a sessão indevida permanece válida.
- Evidências: signin.log, session.json, audit.txt.
- Avaliação: Sessão indevida revogada; Novos acessos protegidos; Auditoria preservada; inspecionar todas as evidências.
- Limite: Revogação depende do provedor. MFA protege novas autenticações; não invalida automaticamente tokens já emitidos.
- Referência: https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html

## cyber-ransom — Criptografia em andamento

- Trilha: Cyber; modelo operacional; versão 1.
- Objetivo: Conter a propagação, preservar evidência e manter os demais serviços.
- Contexto: O endpoint LAB-22 começou a modificar arquivos em um compartilhamento. O restante da rede ainda opera.
- Evidências: edr.log, smb.log, response.txt.
- Avaliação: Endpoint isolado; Sessão de escrita encerrada; Evidências preservadas; Serviços não afetados disponíveis; inspecionar todas as evidências.
- Limite: Modelo de resposta coordenada, não execução de malware. Isolamento não reverte arquivos já alterados.
- Referência: https://www.cisa.gov/stopransomware/ransomware-guide

## cyber-backup — Backup verde, restauração incerta

- Trilha: Cyber; modelo operacional; versão 1.
- Objetivo: Comprovar recuperação isolada antes de liberar o serviço.
- Contexto: O painel indica sucesso de backup. Ninguém testou a recuperação depois do incidente.
- Evidências: backup.log, integrity.txt, change.txt.
- Avaliação: Restauração executada; Integridade e dados validados; Liberação controlada; inspecionar todas as evidências.
- Limite: Sucesso do job não comprova capacidade de restauração. O modelo exige a ordem restaurar → validar → liberar.
- Referência: https://www.cisa.gov/stopransomware/ransomware-guide

## cyber-secret — A chave continua funcionando

- Trilha: Cyber; modelo operacional; versão 1.
- Objetivo: Substituir e revogar a chave sem indisponibilizar o serviço.
- Contexto: Uma chave de API apareceu em um arquivo público fictício. Apagar o arquivo não interrompe o acesso.
- Evidências: finding.txt, service.txt, access.log.
- Avaliação: Aplicação migrada; Chave antiga revogada; Uso anterior investigado; inspecionar todas as evidências.
- Limite: Neste exercício, a troca coordenada preserva disponibilidade. Um incidente real pode exigir revogação imediata conforme risco e uso observado.
- Referência: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html

## cyber-waf — A proteção bloqueou o checkout

- Trilha: Cyber; modelo operacional; versão 1.
- Objetivo: Corrigir a regra específica e comprovar segurança e continuidade.
- Contexto: Uma nova regra WAF impede compras legítimas; desativar toda a proteção seria um atalho.
- Evidências: waf.log, regression.txt, change.txt.
- Avaliação: Ajuste específico aplicado; Proteção preservada; Compra legítima testada; Bloqueio malicioso testado; inspecionar todas as evidências.
- Limite: Ajuste de WAF deve ser sustentado por testes positivos e negativos. Não há payload ofensivo ou requisição externa.
- Referência: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html

## cyber-storage — Público por engano

- Trilha: Cyber; modelo operacional; versão 1.
- Objetivo: Remover acesso anônimo, preservar acesso autorizado e revisar exposição.
- Contexto: Um armazenamento de relatórios foi exposto. A aplicação usa identidade própria para acessá-lo.
- Evidências: policy.json, access.log, service.txt.
- Avaliação: Acesso anônimo removido; Aplicação continua autorizada; Exposição investigada; inspecionar todas as evidências.
- Limite: Não há bucket real nem alteração em nuvem. Política abstraída para mostrar diferença entre remoção pública e indisponibilidade total.
- Referência: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html

## cyber-scan — Scanner autorizado ou intrusão?

- Trilha: Cyber; modelo analítico; versão 1.
- Objetivo: Correlacionar origem, horário e escopo antes de classificar.
- Contexto: O SIEM marcou uma varredura interna. Existe uma janela de manutenção, mas isso não autoriza qualquer origem.
- Evidências: alert.log, change.txt, inventory.txt.
- Avaliação: Contexto correlacionado; Classificação adequada; Detecção preservada; inspecionar todas as evidências.
- Limite: A coincidência de horário sozinha não bastaria. Neste caso sintético, origem e escopo também foram verificados.
- Referência: https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html

## cyber-mfa — Muitas notificações, uma aprovação

- Trilha: Cyber; modelo operacional; versão 1.
- Objetivo: Conter a sessão, verificar identidade por canal conhecido e fortalecer autenticação.
- Contexto: O usuário recebeu notificações de MFA não iniciadas por ele e aprovou uma delas.
- Evidências: idp.log, user.txt, helpdesk.txt.
- Avaliação: Sessão revogada; Identidade verificada; Fator reforçado; MFA preservado; inspecionar todas as evidências.
- Limite: Uma aprovação de MFA não prova intenção legítima. Não há prompts, usuários ou identidades reais neste caso.
- Referência: https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html


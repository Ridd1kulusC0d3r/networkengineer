# Catálogo de cenários

12 casos executáveis por regras, todos sintéticos. Os itens de expansão no final são planejados, não implementados.

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

## Expansão planejada

| Trilha | Próximos cenários | Evidência esperada |
|---|---|---|
| Redes | PMTUD, VLAN/trunk incorreto, BGP/ROV, loop de roteamento | Eventos e pacotes sintéticos derivados do futuro motor |
| OT | Acesso de fornecedor, perda de sincronismo, redundância, baseline de protocolo | Matriz de fluxos, leitura/escrita, eventos de manutenção |
| Cyber | Falso positivo de scan, DNS suspeito, regras com efeito colateral, isolamento parcial | Telemetria sintética e testes de regressão |
| CTI | Desconflição de entidades, relação temporal, classificação de fonte, disseminação | Proveniência e hipóteses alternativas |
| Darkweb | Alegação reciclada, campanha de desinformação, fonte dependente, identidade não autenticada | Capturas fictícias e cadeia de origem |
| Darknet | Tor versus clearnet, falha de circuito, indisponibilidade I2P, observabilidade limitada | Modelos conceituais sem infraestrutura externa |

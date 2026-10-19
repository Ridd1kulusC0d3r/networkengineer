export const scenarios = [
  {
    "id": "net-dns",
    "version": 1,
    "track": "Redes",
    "title": "IP recebido. Serviço invisível.",
    "brief": "A filial recebeu um endereço, mas portal.example não abre. O teste por IP funciona.",
    "objective": "Restaurar a resolução sem liberar o segmento inteiro.",
    "nodes": [
      "Cliente",
      "Gateway",
      "DNS",
      "Portal"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "lease.txt",
        "content": "IP 192.0.2.10/24; gateway 192.0.2.1; DNS 192.0.2.53; lease ativo."
      },
      {
        "id": "E2",
        "source": "probe.log",
        "content": "TCP 198.51.100.20:443 OK; consulta UDP 192.0.2.53:53 timeout."
      },
      {
        "id": "E3",
        "source": "firewall.log",
        "content": "Regra 42 DROP cliente → DNS UDP/53. HTTPS já permitido."
      }
    ],
    "initial": {
      "dns": false,
      "segmented": true
    },
    "actions": [
      {
        "id": "A1",
        "label": "Permitir DNS somente ao resolvedor",
        "effect": {
          "dns": true
        },
        "feedback": "Regra específica aplicada ao resolvedor 192.0.2.53."
      },
      {
        "id": "A2",
        "label": "Liberar todo o tráfego",
        "effect": {
          "dns": true,
          "segmented": false
        },
        "feedback": "O portal volta, mas a segmentação foi perdida."
      },
      {
        "id": "A3",
        "label": "Restaurar política restritiva",
        "effect": {
          "dns": false,
          "segmented": true
        },
        "feedback": "Política inicial restaurada; a exceção DNS continua necessária."
      }
    ],
    "checks": [
      {
        "label": "Resolução DNS responde",
        "key": "dns",
        "equals": true
      },
      {
        "label": "Segmentação preservada",
        "key": "segmented",
        "equals": true
      }
    ],
    "explanation": "O lease não garante resolução. O teste por IP isola o defeito de DNS; a correção deve preservar a política de acesso.",
    "references": [
      "https://www.rfc-editor.org/rfc/rfc1035"
    ],
    "minutes": 15,
    "kind": "operacional"
  },
  {
    "id": "net-dhcp",
    "version": 1,
    "track": "Redes",
    "title": "A oferta que não chega",
    "brief": "Após uma alteração de switch, novos clientes não recebem lease. Clientes antigos continuam operando.",
    "objective": "Restabelecer DHCP sem aceitar ofertas de portas de usuário.",
    "nodes": [
      "Cliente",
      "Switch",
      "DHCP",
      "Gateway"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "client.log",
        "content": "DISCOVER enviado; nenhuma oferta entregue ao cliente."
      },
      {
        "id": "E2",
        "source": "switch.log",
        "content": "OFFER descartado: porta uplink DHCP marcada untrusted."
      },
      {
        "id": "E3",
        "source": "change.txt",
        "content": "Servidor autorizado está na porta uplink; portas access são estações."
      }
    ],
    "initial": {
      "offer": false,
      "rogueBlocked": true
    },
    "actions": [
      {
        "id": "A1",
        "label": "Confiar somente no uplink DHCP",
        "effect": {
          "offer": true,
          "rogueBlocked": true
        },
        "feedback": "Oferta do servidor autorizado passa; portas access permanecem não confiáveis."
      },
      {
        "id": "A2",
        "label": "Confiar em todas as portas",
        "effect": {
          "offer": true,
          "rogueBlocked": false
        },
        "feedback": "Ofertas passam de qualquer origem."
      },
      {
        "id": "A3",
        "label": "Remover confiança de todas as portas",
        "effect": {
          "offer": false,
          "rogueBlocked": true
        },
        "feedback": "Servidor autorizado também foi bloqueado."
      }
    ],
    "checks": [
      {
        "label": "Cliente recebe oferta autorizada",
        "key": "offer",
        "equals": true
      },
      {
        "label": "Ofertas não autorizadas bloqueadas",
        "key": "rogueBlocked",
        "equals": true
      }
    ],
    "explanation": "A confiança de DHCP snooping pertence à porta que leva ao servidor autorizado. Modelo didático: não implementa DORA em bytes nem temporizadores.",
    "references": [
      "https://www.rfc-editor.org/rfc/rfc2131"
    ],
    "minutes": 15,
    "kind": "operacional"
  },
  {
    "id": "ot-conduit",
    "version": 1,
    "track": "OT",
    "title": "A HMI perdeu a leitura",
    "brief": "A célula industrial continua em controle local, mas a HMI perdeu visibilidade após uma alteração no firewall.",
    "objective": "Recuperar leitura autorizada e manter a rede corporativa isolada.",
    "nodes": [
      "HMI",
      "Firewall OT",
      "PLC",
      "TI"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "asset.csv",
        "content": "HMI 192.0.2.10; PLC 192.0.2.20; controle local ativo."
      },
      {
        "id": "E2",
        "source": "flow.log",
        "content": "HMI → PLC TCP/502 DROP; TI → PLC DROP."
      },
      {
        "id": "E3",
        "source": "process.log",
        "content": "Controle local estável. Não há autorização para reiniciar o PLC."
      }
    ],
    "initial": {
      "read": false,
      "itBlocked": true,
      "control": true
    },
    "actions": [
      {
        "id": "A1",
        "label": "Permitir HMI → PLC no conduíte",
        "effect": {
          "read": true
        },
        "feedback": "Fluxo HMI/PLC autorizado. O modelo representa leitura, não inspeção Modbus real."
      },
      {
        "id": "A2",
        "label": "Liberar TI e HMI para PLC",
        "effect": {
          "read": true,
          "itBlocked": false
        },
        "feedback": "Visibilidade voltou com exposição adicional."
      },
      {
        "id": "A3",
        "label": "Reiniciar PLC",
        "effect": {
          "control": false
        },
        "feedback": "Controle interrompido no modelo; não resolveu a política de rede."
      },
      {
        "id": "A4",
        "label": "Restaurar baseline da célula",
        "effect": {
          "read": false,
          "itBlocked": true,
          "control": true
        },
        "feedback": "Estado inicial restaurado."
      }
    ],
    "checks": [
      {
        "label": "Leitura da HMI disponível",
        "key": "read",
        "equals": true
      },
      {
        "label": "TI continua isolada do PLC",
        "key": "itBlocked",
        "equals": true
      },
      {
        "label": "Controle local preservado",
        "key": "control",
        "equals": true
      }
    ],
    "explanation": "Disponibilidade e segmentação precisam ser verificadas juntas. TCP/502 permitido não restringe funções de escrita: este cenário modela o conduíte, não um firewall DPI.",
    "references": [
      "https://attack.mitre.org/matrices/ics/"
    ],
    "minutes": 15,
    "kind": "operacional"
  },
  {
    "id": "ot-write",
    "version": 1,
    "track": "OT",
    "title": "Leitura permitida, escrita indevida",
    "brief": "Uma estação de manutenção pode enviar uma escrita fora da janela. A supervisão precisa continuar lendo.",
    "objective": "Restringir escrita e preservar supervisão e controle local.",
    "nodes": [
      "Manutenção",
      "Política OT",
      "PLC",
      "HMI"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "audit.log",
        "content": "Solicitação WRITE fora da janela aceita pela política atual."
      },
      {
        "id": "E2",
        "source": "matrix.csv",
        "content": "HMI: READ. Manutenção: WRITE somente com janela aprovada."
      },
      {
        "id": "E3",
        "source": "process.log",
        "content": "Bloquear todo o TCP/502 remove a supervisão; controle local é independente neste modelo."
      }
    ],
    "initial": {
      "writeBlocked": false,
      "read": true,
      "control": true
    },
    "actions": [
      {
        "id": "A1",
        "label": "Aplicar política por operação e janela",
        "effect": {
          "writeBlocked": true,
          "read": true
        },
        "feedback": "Política lógica nega WRITE fora da janela e mantém READ."
      },
      {
        "id": "A2",
        "label": "Bloquear todo o serviço industrial",
        "effect": {
          "writeBlocked": true,
          "read": false
        },
        "feedback": "Escrita negada, mas supervisão indisponível."
      },
      {
        "id": "A3",
        "label": "Repor política inicial",
        "effect": {
          "writeBlocked": false,
          "read": true
        },
        "feedback": "Baseline restaurado."
      }
    ],
    "checks": [
      {
        "label": "Escrita fora da janela negada",
        "key": "writeBlocked",
        "equals": true
      },
      {
        "label": "Supervisão preservada",
        "key": "read",
        "equals": true
      },
      {
        "label": "Controle local preservado",
        "key": "control",
        "equals": true
      }
    ],
    "explanation": "Exercício de política abstrata. Uma implementação real exigiria controle no endpoint, gateway ou inspeção de protocolo capaz de distinguir operações.",
    "references": [
      "https://attack.mitre.org/matrices/ics/"
    ],
    "minutes": 15,
    "kind": "operacional"
  },
  {
    "id": "cyber-egress",
    "version": 1,
    "track": "Cyber",
    "title": "Conter sem apagar o negócio",
    "brief": "Um endpoint comprometido mantém conexões externas. Um bloqueio global derrubaria o sistema de pedidos.",
    "objective": "Conter o endpoint, preservar pedidos e registrar evidências.",
    "nodes": [
      "Endpoint",
      "Firewall",
      "Destino",
      "Pedidos"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "edr.json",
        "content": "Endpoint LAB-07 confirmado comprometido por análise local sintética."
      },
      {
        "id": "E2",
        "source": "flows.csv",
        "content": "LAB-07 → 203.0.113.90:443; pedidos → 198.51.100.20:443."
      },
      {
        "id": "E3",
        "source": "case.txt",
        "content": "Preservar eventos antes de encerrar o caso; nenhum destino representa infraestrutura real."
      }
    ],
    "initial": {
      "contained": false,
      "orders": true,
      "preserved": false
    },
    "actions": [
      {
        "id": "A1",
        "label": "Isolar LAB-07",
        "effect": {
          "contained": true
        },
        "feedback": "Isolamento específico aplicado."
      },
      {
        "id": "A2",
        "label": "Bloquear todas as saídas",
        "effect": {
          "contained": true,
          "orders": false
        },
        "feedback": "Contenção ampla interrompeu pedidos."
      },
      {
        "id": "A3",
        "label": "Preservar eventos do caso",
        "effect": {
          "preserved": true
        },
        "feedback": "Evidências marcadas como preservadas no exercício."
      },
      {
        "id": "A4",
        "label": "Restaurar política inicial",
        "effect": {
          "contained": false,
          "orders": true
        },
        "feedback": "Conectividade inicial restaurada."
      }
    ],
    "checks": [
      {
        "label": "Endpoint contido",
        "key": "contained",
        "equals": true
      },
      {
        "label": "Pedidos continuam operando",
        "key": "orders",
        "equals": true
      },
      {
        "label": "Eventos preservados",
        "key": "preserved",
        "equals": true
      }
    ],
    "explanation": "O resultado exige contenção com escopo, continuidade e evidência. A interface não executa ações de EDR ou firewall reais.",
    "references": [
      "https://www.misp-project.org/warninglists/"
    ],
    "minutes": 15,
    "kind": "operacional"
  },
  {
    "id": "cyber-tls",
    "version": 1,
    "track": "Cyber",
    "title": "O atalho do certificado",
    "brief": "Uma aplicação passou a rejeitar o certificado após mudança de domínio. Desativar validação parece resolver.",
    "objective": "Restaurar conexão autenticada sem desligar a verificação.",
    "nodes": [
      "Cliente",
      "Validação TLS",
      "Servidor",
      "CA"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "tls.log",
        "content": "Hostname portal.example ausente do SAN; cadeia confiável."
      },
      {
        "id": "E2",
        "source": "change.txt",
        "content": "Serviço migrado de antigo.example para portal.example."
      },
      {
        "id": "E3",
        "source": "policy.txt",
        "content": "Verificação de hostname deve permanecer habilitada."
      }
    ],
    "initial": {
      "san": false,
      "verify": true
    },
    "actions": [
      {
        "id": "A1",
        "label": "Emitir certificado com SAN correto",
        "effect": {
          "san": true
        },
        "feedback": "Identidade esperada incluída no certificado modelado."
      },
      {
        "id": "A2",
        "label": "Desativar validação TLS",
        "effect": {
          "verify": false
        },
        "feedback": "Erro visual desaparece, mas a autenticação foi removida."
      },
      {
        "id": "A3",
        "label": "Reativar validação TLS",
        "effect": {
          "verify": true
        },
        "feedback": "Validação de identidade reativada."
      }
    ],
    "checks": [
      {
        "label": "Certificado corresponde ao serviço",
        "key": "san",
        "equals": true
      },
      {
        "label": "Validação continua habilitada",
        "key": "verify",
        "equals": true
      }
    ],
    "explanation": "Criptografia sem validação da identidade não resolve este incidente. Não há handshake ou criptografia real neste modelo.",
    "references": [
      "https://www.rfc-editor.org/rfc/rfc8446"
    ],
    "minutes": 15,
    "kind": "operacional"
  },
  {
    "id": "cti-shared",
    "version": 1,
    "track": "CTI",
    "title": "Mesmo IP, mesmo adversário?",
    "brief": "Dois domínios aparecem no mesmo IP de CDN. Um relatório os atribui ao mesmo operador.",
    "objective": "Registrar infraestrutura compartilhada, confiança baixa e necessidade de corroborar.",
    "nodes": [
      "Fonte A",
      "IP CDN",
      "Fonte B",
      "Hipótese"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "passive-dns.csv",
        "content": "a.example e b.example resolvem para 203.0.113.10 no mesmo dia."
      },
      {
        "id": "E2",
        "source": "provider.txt",
        "content": "203.0.113.10 representa hospedagem compartilhada no conjunto sintético."
      },
      {
        "id": "E3",
        "source": "source-review.txt",
        "content": "Não há certificado exclusivo, conta, artefato ou outro vínculo independente."
      }
    ],
    "initial": {
      "verdict": "pending",
      "confidence": "pending"
    },
    "actions": [
      {
        "id": "A1",
        "label": "Registrar hipótese não corroborada",
        "effect": {
          "verdict": "unconfirmed"
        },
        "feedback": "Relação técnica preservada sem atribuição de operador."
      },
      {
        "id": "A2",
        "label": "Atribuir ao mesmo adversário",
        "effect": {
          "verdict": "attributed"
        },
        "feedback": "Atribuição excede as evidências."
      },
      {
        "id": "A3",
        "label": "Definir confiança baixa",
        "effect": {
          "confidence": "low"
        },
        "feedback": "Confiança calibrada para o vínculo de operador."
      },
      {
        "id": "A4",
        "label": "Definir confiança alta",
        "effect": {
          "confidence": "high"
        },
        "feedback": "Alta confiança exige suporte independente ausente."
      }
    ],
    "checks": [
      {
        "label": "Sem atribuição indevida",
        "key": "verdict",
        "equals": "unconfirmed"
      },
      {
        "label": "Confiança calibrada",
        "key": "confidence",
        "equals": "low"
      }
    ],
    "explanation": "IP compartilhado é uma relação de infraestrutura, não prova de identidade. Uma warninglist alerta para revisão; não prova benignidade.",
    "references": [
      "https://www.misp-project.org/warninglists/"
    ],
    "minutes": 15,
    "kind": "analítico"
  },
  {
    "id": "cti-expiry",
    "version": 1,
    "track": "CTI",
    "title": "O indicador envelheceu",
    "brief": "Um feed antigo recomenda bloquear um IP. O endereço agora atende um serviço legítimo compartilhado.",
    "objective": "Retirar bloqueio automático, manter histórico e pedir revalidação.",
    "nodes": [
      "Feed antigo",
      "Observação atual",
      "Política",
      "Histórico"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "feed.json",
        "content": "Indicador observado há 180 dias; sem atualização desde então."
      },
      {
        "id": "E2",
        "source": "current.txt",
        "content": "Telemetria atual do laboratório: serviço legítimo compartilhado; sem comportamento malicioso observado."
      },
      {
        "id": "E3",
        "source": "review.txt",
        "content": "Ausência de sinal atual não prova que toda atividade futura será benigna."
      }
    ],
    "initial": {
      "autoBlock": true,
      "history": true,
      "review": false
    },
    "actions": [
      {
        "id": "A1",
        "label": "Suspender bloqueio automático",
        "effect": {
          "autoBlock": false
        },
        "feedback": "Indicador retirado de enforcement enquanto é revalidado."
      },
      {
        "id": "A2",
        "label": "Apagar todo o histórico",
        "effect": {
          "history": false
        },
        "feedback": "Proveniência perdida."
      },
      {
        "id": "A3",
        "label": "Preservar histórico",
        "effect": {
          "history": true
        },
        "feedback": "Histórico preservado com contexto temporal."
      },
      {
        "id": "A4",
        "label": "Solicitar nova validação",
        "effect": {
          "review": true
        },
        "feedback": "Revisão de atualidade registrada."
      }
    ],
    "checks": [
      {
        "label": "Sem bloqueio cego",
        "key": "autoBlock",
        "equals": false
      },
      {
        "label": "Histórico preservado",
        "key": "history",
        "equals": true
      },
      {
        "label": "Revalidação solicitada",
        "key": "review",
        "equals": true
      }
    ],
    "explanation": "Indicadores exigem contexto e validade temporal. Este exercício não implementa interoperabilidade MISP/STIX.",
    "references": [
      "https://www.misp-project.org/warninglists/"
    ],
    "minutes": 15,
    "kind": "analítico"
  },
  {
    "id": "dw-claim",
    "version": 1,
    "track": "Darkweb",
    "title": "A alegação não é a prova",
    "brief": "Uma captura sintética de um site de vazamentos menciona a organização fictícia Aurora.",
    "objective": "Distinguir alegação de incidente confirmado e verificar independência das fontes.",
    "nodes": [
      "Publicação",
      "Repost",
      "Telemetria",
      "Avaliação"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "capture.txt",
        "content": "Publicação: “Aurora comprometida”. Nenhuma amostra verificável."
      },
      {
        "id": "E2",
        "source": "repost.txt",
        "content": "Segundo post repete literalmente o primeiro e aponta para a mesma captura."
      },
      {
        "id": "E3",
        "source": "internal.txt",
        "content": "Consulta interna inicial sem confirmação; investigação ainda aberta."
      }
    ],
    "initial": {
      "verdict": "pending",
      "independence": "pending",
      "confidence": "pending"
    },
    "actions": [
      {
        "id": "A1",
        "label": "Registrar alegação não confirmada",
        "effect": {
          "verdict": "unconfirmed"
        },
        "feedback": "Alegação registrada para investigação."
      },
      {
        "id": "A2",
        "label": "Declarar vazamento confirmado",
        "effect": {
          "verdict": "confirmed"
        },
        "feedback": "Conclusão excede as evidências disponíveis."
      },
      {
        "id": "A3",
        "label": "Marcar repost como derivado",
        "effect": {
          "independence": "derived"
        },
        "feedback": "Duas publicações, uma única origem."
      },
      {
        "id": "A4",
        "label": "Contar repost como confirmação independente",
        "effect": {
          "independence": "independent"
        },
        "feedback": "A contagem duplica a mesma fonte."
      },
      {
        "id": "A5",
        "label": "Definir confiança baixa na alegação",
        "effect": {
          "confidence": "low"
        },
        "feedback": "Confiança baixa não significa alegação falsa."
      }
    ],
    "checks": [
      {
        "label": "Alegação separada de fato",
        "key": "verdict",
        "equals": "unconfirmed"
      },
      {
        "label": "Dependência de fontes identificada",
        "key": "independence",
        "equals": "derived"
      },
      {
        "label": "Confiança explicitada",
        "key": "confidence",
        "equals": "low"
      }
    ],
    "explanation": "Darkweb descreve conteúdo/serviços acessados por redes específicas. Reposts não multiplicam evidência. Não há acesso a sites reais ou dados vazados.",
    "references": [
      "https://community.torproject.org/onion-services/overview/"
    ],
    "minutes": 15,
    "kind": "analítico"
  },
  {
    "id": "dw-clone",
    "version": 1,
    "track": "Darkweb",
    "title": "Espelho ou imitação?",
    "brief": "Dois serviços sintéticos exibem a mesma identidade visual. Um agregador declara que são do mesmo operador.",
    "objective": "Evitar atribuição baseada em aparência e preservar a proveniência.",
    "nodes": [
      "Captura A",
      "Captura B",
      "Agregador",
      "Registro"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "capture-a.txt",
        "content": "Identidade visual “Aurora Archive”; referência sintética SERVICE-A."
      },
      {
        "id": "E2",
        "source": "capture-b.txt",
        "content": "Mesmo logotipo e texto; referência sintética SERVICE-B."
      },
      {
        "id": "E3",
        "source": "origin.txt",
        "content": "Agregador não informa método. Nenhuma assinatura verificável ou anúncio autenticado de migração."
      }
    ],
    "initial": {
      "verdict": "pending",
      "provenance": false
    },
    "actions": [
      {
        "id": "A1",
        "label": "Classificar relação como inconclusiva",
        "effect": {
          "verdict": "unknown"
        },
        "feedback": "Similaridade registrada; autoria permanece desconhecida."
      },
      {
        "id": "A2",
        "label": "Confirmar mesma autoria pelo layout",
        "effect": {
          "verdict": "same"
        },
        "feedback": "Aparência pode ser copiada."
      },
      {
        "id": "A3",
        "label": "Registrar origem de cada captura",
        "effect": {
          "provenance": true
        },
        "feedback": "Fontes separadas no registro analítico."
      }
    ],
    "checks": [
      {
        "label": "Sem atribuição visual automática",
        "key": "verdict",
        "equals": "unknown"
      },
      {
        "label": "Proveniência preservada",
        "key": "provenance",
        "equals": true
      }
    ],
    "explanation": "Similaridade de conteúdo é uma pista, não uma identidade criptográfica. SERVICE-A/B são rótulos; não são endereços onion.",
    "references": [
      "https://community.torproject.org/onion-services/overview/"
    ],
    "minutes": 15,
    "kind": "analítico"
  },
  {
    "id": "dn-tor",
    "version": 1,
    "track": "Darknet",
    "title": "O caminho não tem saída",
    "brief": "Um diagrama de investigação coloca um exit relay entre cliente e serviço onion.",
    "objective": "Corrigir o modelo de caminho e os limites da atribuição.",
    "nodes": [
      "Cliente Tor",
      "Circuitos",
      "Rendezvous",
      "Onion service"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "destination.txt",
        "content": "Destino é um onion service, não um site da web pública."
      },
      {
        "id": "E2",
        "source": "diagram.txt",
        "content": "Diagrama recebido inclui “exit relay → servidor público”."
      },
      {
        "id": "E3",
        "source": "attribution.txt",
        "content": "Analista pretende atribuir o operador ao IP de um relay."
      }
    ],
    "initial": {
      "path": "exit",
      "attribution": "relay"
    },
    "actions": [
      {
        "id": "A1",
        "label": "Modelar rendezvous sem exit relay",
        "effect": {
          "path": "rendezvous"
        },
        "feedback": "Caminho conceitual corrigido; circuitos dos dois lados são abstraídos."
      },
      {
        "id": "A2",
        "label": "Usar saída para web pública",
        "effect": {
          "path": "exit"
        },
        "feedback": "Esse modelo não corresponde ao destino onion."
      },
      {
        "id": "A3",
        "label": "Marcar operador como desconhecido",
        "effect": {
          "attribution": "unknown"
        },
        "feedback": "IP de relay não identifica o operador do serviço."
      }
    ],
    "checks": [
      {
        "label": "Caminho onion sem saída pública",
        "key": "path",
        "equals": "rendezvous"
      },
      {
        "label": "Sem atribuição ao relay",
        "key": "attribution",
        "equals": "unknown"
      }
    ],
    "explanation": "Onion services permanecem na rede Tor e não usam exit relay. A figura é conceitual; não simula construção de circuitos nem anonimato.",
    "references": [
      "https://community.torproject.org/onion-services/overview/"
    ],
    "minutes": 15,
    "kind": "analítico"
  },
  {
    "id": "dn-i2p",
    "version": 1,
    "track": "Darknet",
    "title": "Indisponível não significa removido",
    "brief": "Um serviço I2P sintético não responde em uma única observação. Surge a hipótese de derrubada definitiva.",
    "objective": "Separar falha de observação, disponibilidade e conclusão de remoção.",
    "nodes": [
      "Observador",
      "Túnel de saída",
      "Destino I2P",
      "Túnel de retorno"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "attempt.txt",
        "content": "Uma tentativa falhou. Não há histórico suficiente."
      },
      {
        "id": "E2",
        "source": "router.txt",
        "content": "Estado do roteador local degradado durante a tentativa."
      },
      {
        "id": "E3",
        "source": "second.txt",
        "content": "Não existe confirmação independente de remoção."
      }
    ],
    "initial": {
      "verdict": "pending",
      "localCheck": false,
      "repeat": false
    },
    "actions": [
      {
        "id": "A1",
        "label": "Classificar disponibilidade como indeterminada",
        "effect": {
          "verdict": "unknown"
        },
        "feedback": "A única falha não sustenta remoção."
      },
      {
        "id": "A2",
        "label": "Declarar remoção definitiva",
        "effect": {
          "verdict": "removed"
        },
        "feedback": "Inferência não corroborada."
      },
      {
        "id": "A3",
        "label": "Verificar condição local",
        "effect": {
          "localCheck": true
        },
        "feedback": "Degradação local incorporada como hipótese alternativa."
      },
      {
        "id": "A4",
        "label": "Planejar observações independentes",
        "effect": {
          "repeat": true
        },
        "feedback": "Plano de validação registrado; nenhuma consulta externa executada."
      }
    ],
    "checks": [
      {
        "label": "Conclusão calibrada",
        "key": "verdict",
        "equals": "unknown"
      },
      {
        "label": "Hipótese local considerada",
        "key": "localCheck",
        "equals": true
      },
      {
        "label": "Verificação adicional planejada",
        "key": "repeat",
        "equals": true
      }
    ],
    "explanation": "I2P é uma rede sobreposta distinta do Tor. Neste exercício, darknet significa rede de anonimato; não significa telescope de IPs não usados.",
    "references": [
      "https://i2p.net/en/docs/overview/intro/"
    ],
    "minutes": 15,
    "kind": "analítico"
  }
];

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
  },
  {
    "id": "cyber-session",
    "version": 1,
    "track": "Cyber",
    "title": "Senha trocada. Sessão ativa.",
    "brief": "Uma conta sofreu phishing. A senha foi alterada, mas a sessão indevida permanece válida.",
    "objective": "Invalidar a sessão, proteger novos acessos e preservar a auditoria.",
    "nodes": [
      "Usuário",
      "IdP",
      "Sessão",
      "Auditoria"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "signin.log",
        "content": "Conta LAB-12: sessão S-9 criada após aprovação indevida de MFA."
      },
      {
        "id": "E2",
        "source": "session.json",
        "content": "Senha alterada às 10:03; S-9 ainda válida às 10:08 neste IdP fictício."
      },
      {
        "id": "E3",
        "source": "audit.txt",
        "content": "Logs disponíveis. Não apagar evidências durante recuperação."
      }
    ],
    "initial": {
      "revoked": false,
      "mfa": false,
      "audit": true
    },
    "actions": [
      {
        "id": "A1",
        "label": "Revogar sessões da conta",
        "effect": {
          "revoked": true
        },
        "feedback": "Sessão S-9 invalidada no modelo."
      },
      {
        "id": "A2",
        "label": "Exigir MFA resistente a phishing",
        "effect": {
          "mfa": true
        },
        "feedback": "Nova autenticação exige fator resistente a phishing."
      },
      {
        "id": "A3",
        "label": "Apenas trocar senha novamente",
        "effect": {},
        "feedback": "Neste modelo, alterar a senha não revoga a sessão existente."
      },
      {
        "id": "A4",
        "label": "Apagar logs de login",
        "effect": {
          "audit": false
        },
        "feedback": "Auditoria perdida."
      },
      {
        "id": "A5",
        "label": "Restaurar auditoria do caso",
        "effect": {
          "audit": true
        },
        "feedback": "Cópia sintética preservada recuperada."
      }
    ],
    "checks": [
      {
        "label": "Sessão indevida revogada",
        "key": "revoked",
        "equals": true
      },
      {
        "label": "Novos acessos protegidos",
        "key": "mfa",
        "equals": true
      },
      {
        "label": "Auditoria preservada",
        "key": "audit",
        "equals": true
      }
    ],
    "explanation": "Revogação depende do provedor. MFA protege novas autenticações; não invalida automaticamente tokens já emitidos.",
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
    ],
    "minutes": 20,
    "kind": "operacional"
  },
  {
    "id": "cyber-ransom",
    "version": 1,
    "track": "Cyber",
    "title": "Criptografia em andamento",
    "brief": "O endpoint LAB-22 começou a modificar arquivos em um compartilhamento. O restante da rede ainda opera.",
    "objective": "Conter a propagação, preservar evidência e manter os demais serviços.",
    "nodes": [
      "LAB-22",
      "Compartilhamento",
      "EDR",
      "Serviços"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "edr.log",
        "content": "Processo sintético confirmou criptografia anômala em LAB-22."
      },
      {
        "id": "E2",
        "source": "smb.log",
        "content": "LAB-22 mantém sessão de escrita; nenhum segundo host foi confirmado."
      },
      {
        "id": "E3",
        "source": "response.txt",
        "content": "Isolamento de rede disponível; coleta de evidências autorizada."
      }
    ],
    "initial": {
      "isolated": false,
      "sessionClosed": false,
      "evidence": false,
      "services": true
    },
    "actions": [
      {
        "id": "A1",
        "label": "Isolar LAB-22",
        "effect": {
          "isolated": true
        },
        "feedback": "Endpoint removido da comunicação de rede."
      },
      {
        "id": "A2",
        "label": "Encerrar sessão de escrita de LAB-22",
        "effect": {
          "sessionClosed": true
        },
        "feedback": "Sessão no compartilhamento encerrada."
      },
      {
        "id": "A3",
        "label": "Preservar eventos do endpoint",
        "effect": {
          "evidence": true
        },
        "feedback": "Eventos preservados no registro do exercício."
      },
      {
        "id": "A4",
        "label": "Desligar todos os serviços",
        "effect": {
          "services": false
        },
        "feedback": "Interrupção desnecessária dos sistemas não afetados."
      },
      {
        "id": "A5",
        "label": "Restaurar serviços não afetados",
        "effect": {
          "services": true
        },
        "feedback": "Continuidade dos demais serviços restabelecida."
      }
    ],
    "checks": [
      {
        "label": "Endpoint isolado",
        "key": "isolated",
        "equals": true
      },
      {
        "label": "Sessão de escrita encerrada",
        "key": "sessionClosed",
        "equals": true
      },
      {
        "label": "Evidências preservadas",
        "key": "evidence",
        "equals": true
      },
      {
        "label": "Serviços não afetados disponíveis",
        "key": "services",
        "equals": true
      }
    ],
    "explanation": "Modelo de resposta coordenada, não execução de malware. Isolamento não reverte arquivos já alterados.",
    "references": [
      "https://www.cisa.gov/stopransomware/ransomware-guide"
    ],
    "minutes": 20,
    "kind": "operacional"
  },
  {
    "id": "cyber-backup",
    "version": 1,
    "track": "Cyber",
    "title": "Backup verde, restauração incerta",
    "brief": "O painel indica sucesso de backup. Ninguém testou a recuperação depois do incidente.",
    "objective": "Comprovar recuperação isolada antes de liberar o serviço.",
    "nodes": [
      "Backup",
      "Ambiente isolado",
      "Validação",
      "Produção"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "backup.log",
        "content": "Job terminou com sucesso; nenhuma restauração de teste registrada."
      },
      {
        "id": "E2",
        "source": "integrity.txt",
        "content": "O catálogo possui hashes de referência e conjunto de registros esperado."
      },
      {
        "id": "E3",
        "source": "change.txt",
        "content": "Ambiente de restauração isolado disponível; liberação requer validação."
      }
    ],
    "initial": {
      "restored": false,
      "validated": false,
      "released": false
    },
    "actions": [
      {
        "id": "A1",
        "label": "Restaurar em ambiente isolado",
        "effect": {
          "restored": true
        },
        "feedback": "Cópia restaurada no ambiente de teste."
      },
      {
        "id": "A2",
        "label": "Validar integridade e dados",
        "effect": {
          "validated": true
        },
        "feedback": "Hashes e registros conferidos no conjunto sintético.",
        "requires": {
          "restored": true
        }
      },
      {
        "id": "A3",
        "label": "Liberar serviço após validação",
        "effect": {
          "released": true
        },
        "feedback": "Serviço liberado com evidência de recuperação.",
        "requires": {
          "validated": true
        }
      }
    ],
    "checks": [
      {
        "label": "Restauração executada",
        "key": "restored",
        "equals": true
      },
      {
        "label": "Integridade e dados validados",
        "key": "validated",
        "equals": true
      },
      {
        "label": "Liberação controlada",
        "key": "released",
        "equals": true
      }
    ],
    "explanation": "Sucesso do job não comprova capacidade de restauração. O modelo exige a ordem restaurar → validar → liberar.",
    "references": [
      "https://www.cisa.gov/stopransomware/ransomware-guide"
    ],
    "minutes": 20,
    "kind": "operacional"
  },
  {
    "id": "cyber-secret",
    "version": 1,
    "track": "Cyber",
    "title": "A chave continua funcionando",
    "brief": "Uma chave de API apareceu em um arquivo público fictício. Apagar o arquivo não interrompe o acesso.",
    "objective": "Substituir e revogar a chave sem indisponibilizar o serviço.",
    "nodes": [
      "Repositório",
      "Cofre",
      "API",
      "Aplicação"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "finding.txt",
        "content": "Chave sintética EXAMPLE-KEY exposta; não é uma credencial válida."
      },
      {
        "id": "E2",
        "source": "service.txt",
        "content": "Aplicação depende da chave atual; credencial substituta pode ser provisionada."
      },
      {
        "id": "E3",
        "source": "access.log",
        "content": "A chave antiga segue aceita até revogação explícita."
      }
    ],
    "initial": {
      "replacement": false,
      "migrated": false,
      "revoked": false,
      "reviewed": false
    },
    "actions": [
      {
        "id": "A1",
        "label": "Provisionar credencial substituta no cofre",
        "effect": {
          "replacement": true
        },
        "feedback": "Credencial substituta preparada."
      },
      {
        "id": "A2",
        "label": "Migrar e verificar aplicação",
        "effect": {
          "migrated": true
        },
        "feedback": "Aplicação validada com credencial substituta.",
        "requires": {
          "replacement": true
        }
      },
      {
        "id": "A3",
        "label": "Revogar chave exposta",
        "effect": {
          "revoked": true
        },
        "feedback": "Chave antiga invalidada.",
        "requires": {
          "migrated": true
        }
      },
      {
        "id": "A4",
        "label": "Revisar uso da chave exposta",
        "effect": {
          "reviewed": true
        },
        "feedback": "Auditoria de acesso revisada."
      },
      {
        "id": "A5",
        "label": "Somente apagar arquivo público",
        "effect": {},
        "feedback": "A exposição visual foi removida; a chave antiga continua válida."
      }
    ],
    "checks": [
      {
        "label": "Aplicação migrada",
        "key": "migrated",
        "equals": true
      },
      {
        "label": "Chave antiga revogada",
        "key": "revoked",
        "equals": true
      },
      {
        "label": "Uso anterior investigado",
        "key": "reviewed",
        "equals": true
      }
    ],
    "explanation": "Neste exercício, a troca coordenada preserva disponibilidade. Um incidente real pode exigir revogação imediata conforme risco e uso observado.",
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html"
    ],
    "minutes": 20,
    "kind": "operacional"
  },
  {
    "id": "cyber-waf",
    "version": 1,
    "track": "Cyber",
    "title": "A proteção bloqueou o checkout",
    "brief": "Uma nova regra WAF impede compras legítimas; desativar toda a proteção seria um atalho.",
    "objective": "Corrigir a regra específica e comprovar segurança e continuidade.",
    "nodes": [
      "Cliente",
      "WAF",
      "Checkout",
      "Testes"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "waf.log",
        "content": "Regra LAB-104 bloqueia payload legítimo do checkout."
      },
      {
        "id": "E2",
        "source": "regression.txt",
        "content": "Conjunto de teste: compra legítima e requisição maliciosa sintética."
      },
      {
        "id": "E3",
        "source": "change.txt",
        "content": "Outras regras não participaram dos bloqueios observados."
      }
    ],
    "initial": {
      "tuned": false,
      "protected": true,
      "legitTest": false,
      "attackTest": false
    },
    "actions": [
      {
        "id": "A1",
        "label": "Ajustar regra LAB-104 para o campo afetado",
        "effect": {
          "tuned": true
        },
        "feedback": "Exceção restrita ao campo legítimo."
      },
      {
        "id": "A2",
        "label": "Desativar WAF inteiro",
        "effect": {
          "protected": false
        },
        "feedback": "Proteções de outras rotas foram removidas."
      },
      {
        "id": "A3",
        "label": "Reativar proteção geral",
        "effect": {
          "protected": true
        },
        "feedback": "Demais regras ativas."
      },
      {
        "id": "A4",
        "label": "Testar compra legítima",
        "effect": {
          "legitTest": true
        },
        "feedback": "Compra de teste aceita.",
        "requires": {
          "tuned": true,
          "protected": true
        }
      },
      {
        "id": "A5",
        "label": "Testar bloqueio malicioso sintético",
        "effect": {
          "attackTest": true
        },
        "feedback": "Requisição maliciosa de teste bloqueada.",
        "requires": {
          "tuned": true,
          "protected": true
        }
      }
    ],
    "checks": [
      {
        "label": "Ajuste específico aplicado",
        "key": "tuned",
        "equals": true
      },
      {
        "label": "Proteção preservada",
        "key": "protected",
        "equals": true
      },
      {
        "label": "Compra legítima testada",
        "key": "legitTest",
        "equals": true
      },
      {
        "label": "Bloqueio malicioso testado",
        "key": "attackTest",
        "equals": true
      }
    ],
    "explanation": "Ajuste de WAF deve ser sustentado por testes positivos e negativos. Não há payload ofensivo ou requisição externa.",
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html"
    ],
    "minutes": 20,
    "kind": "operacional"
  },
  {
    "id": "cyber-storage",
    "version": 1,
    "track": "Cyber",
    "title": "Público por engano",
    "brief": "Um armazenamento de relatórios foi exposto. A aplicação usa identidade própria para acessá-lo.",
    "objective": "Remover acesso anônimo, preservar acesso autorizado e revisar exposição.",
    "nodes": [
      "Visitante",
      "Armazenamento",
      "Aplicação",
      "Auditoria"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "policy.json",
        "content": "Anonymous: read permitido; identidade app-reports: read permitido."
      },
      {
        "id": "E2",
        "source": "access.log",
        "content": "Acessos anônimos registrados; conteúdo sintético sem dados pessoais."
      },
      {
        "id": "E3",
        "source": "service.txt",
        "content": "Aplicação não depende de links públicos: usa app-reports."
      }
    ],
    "initial": {
      "public": true,
      "app": true,
      "review": false
    },
    "actions": [
      {
        "id": "A1",
        "label": "Remover leitura anônima",
        "effect": {
          "public": false
        },
        "feedback": "Acesso público removido."
      },
      {
        "id": "A2",
        "label": "Negar todas as identidades",
        "effect": {
          "public": false,
          "app": false
        },
        "feedback": "Relatórios indisponíveis também à aplicação."
      },
      {
        "id": "A3",
        "label": "Preservar acesso app-reports",
        "effect": {
          "app": true
        },
        "feedback": "Identidade da aplicação autorizada."
      },
      {
        "id": "A4",
        "label": "Revisar logs e escopo exposto",
        "effect": {
          "review": true
        },
        "feedback": "Janela e objetos acessados documentados."
      }
    ],
    "checks": [
      {
        "label": "Acesso anônimo removido",
        "key": "public",
        "equals": false
      },
      {
        "label": "Aplicação continua autorizada",
        "key": "app",
        "equals": true
      },
      {
        "label": "Exposição investigada",
        "key": "review",
        "equals": true
      }
    ],
    "explanation": "Não há bucket real nem alteração em nuvem. Política abstraída para mostrar diferença entre remoção pública e indisponibilidade total.",
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html"
    ],
    "minutes": 20,
    "kind": "operacional"
  },
  {
    "id": "cyber-scan",
    "version": 1,
    "track": "Cyber",
    "title": "Scanner autorizado ou intrusão?",
    "brief": "O SIEM marcou uma varredura interna. Existe uma janela de manutenção, mas isso não autoriza qualquer origem.",
    "objective": "Correlacionar origem, horário e escopo antes de classificar.",
    "nodes": [
      "SIEM",
      "Origem",
      "Mudança",
      "Analista"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "alert.log",
        "content": "SCAN de LAB-SCAN-01 contra sub-rede aprovada às 02:15."
      },
      {
        "id": "E2",
        "source": "change.txt",
        "content": "Mudança CHG-LAB: LAB-SCAN-01; 02:00–03:00; mesma sub-rede."
      },
      {
        "id": "E3",
        "source": "inventory.txt",
        "content": "Identidade do scanner verificada no inventário; nenhuma divergência neste conjunto."
      }
    ],
    "initial": {
      "correlated": false,
      "verdict": "pending",
      "detection": true
    },
    "actions": [
      {
        "id": "A1",
        "label": "Correlacionar origem, janela e escopo",
        "effect": {
          "correlated": true
        },
        "feedback": "Três dimensões correspondem à mudança aprovada."
      },
      {
        "id": "A2",
        "label": "Classificar atividade autorizada neste caso",
        "effect": {
          "verdict": "authorized"
        },
        "feedback": "Alerta contextualizado sem generalizar todas as varreduras.",
        "requires": {
          "correlated": true
        }
      },
      {
        "id": "A3",
        "label": "Classificar intrusão confirmada",
        "effect": {
          "verdict": "intrusion"
        },
        "feedback": "Conclusão incompatível com as evidências disponíveis."
      },
      {
        "id": "A4",
        "label": "Desativar detecção de varreduras",
        "effect": {
          "detection": false
        },
        "feedback": "Visibilidade de outros casos perdida."
      },
      {
        "id": "A5",
        "label": "Manter detecção para demais casos",
        "effect": {
          "detection": true
        },
        "feedback": "Cobertura permanece ativa."
      }
    ],
    "checks": [
      {
        "label": "Contexto correlacionado",
        "key": "correlated",
        "equals": true
      },
      {
        "label": "Classificação adequada",
        "key": "verdict",
        "equals": "authorized"
      },
      {
        "label": "Detecção preservada",
        "key": "detection",
        "equals": true
      }
    ],
    "explanation": "A coincidência de horário sozinha não bastaria. Neste caso sintético, origem e escopo também foram verificados.",
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
    ],
    "minutes": 20,
    "kind": "analítico"
  },
  {
    "id": "cyber-mfa",
    "version": 1,
    "track": "Cyber",
    "title": "Muitas notificações, uma aprovação",
    "brief": "O usuário recebeu notificações de MFA não iniciadas por ele e aprovou uma delas.",
    "objective": "Conter a sessão, verificar identidade por canal conhecido e fortalecer autenticação.",
    "nodes": [
      "Usuário",
      "IdP",
      "Sessão suspeita",
      "Suporte"
    ],
    "evidence": [
      {
        "id": "E1",
        "source": "idp.log",
        "content": "18 notificações; uma aprovação; sessão S-41 criada."
      },
      {
        "id": "E2",
        "source": "user.txt",
        "content": "Usuário relata que não iniciou o login."
      },
      {
        "id": "E3",
        "source": "helpdesk.txt",
        "content": "Canal corporativo previamente conhecido disponível para verificação."
      }
    ],
    "initial": {
      "revoked": false,
      "verified": false,
      "strong": false,
      "enabled": true
    },
    "actions": [
      {
        "id": "A1",
        "label": "Revogar sessão S-41",
        "effect": {
          "revoked": true
        },
        "feedback": "Sessão suspeita invalidada."
      },
      {
        "id": "A2",
        "label": "Verificar usuário por canal conhecido",
        "effect": {
          "verified": true
        },
        "feedback": "Identidade confirmada fora da solicitação suspeita."
      },
      {
        "id": "A3",
        "label": "Exigir fator resistente a phishing",
        "effect": {
          "strong": true
        },
        "feedback": "Política reforçada para novos acessos."
      },
      {
        "id": "A4",
        "label": "Desativar MFA para evitar notificações",
        "effect": {
          "enabled": false
        },
        "feedback": "Barreira de autenticação removida."
      },
      {
        "id": "A5",
        "label": "Manter MFA habilitado",
        "effect": {
          "enabled": true
        },
        "feedback": "Proteção de autenticação mantida."
      }
    ],
    "checks": [
      {
        "label": "Sessão revogada",
        "key": "revoked",
        "equals": true
      },
      {
        "label": "Identidade verificada",
        "key": "verified",
        "equals": true
      },
      {
        "label": "Fator reforçado",
        "key": "strong",
        "equals": true
      },
      {
        "label": "MFA preservado",
        "key": "enabled",
        "equals": true
      }
    ],
    "explanation": "Uma aprovação de MFA não prova intenção legítima. Não há prompts, usuários ou identidades reais neste caso.",
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
    ],
    "minutes": 20,
    "kind": "operacional"
  }
];

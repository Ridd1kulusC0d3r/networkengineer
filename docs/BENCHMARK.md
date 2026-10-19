# Benchmark crítico

Revisão documental em 19/10/2026 UTC (18/10 no início da sessão em São Paulo). Fontes primárias consultadas: documentação e repositórios dos próprios projetos. **Não executamos uma bateria comparativa de desempenho ou precisão.** Recursos declarados não são equivalentes a recursos independentemente testados. Não atribuímos notas numéricas sem medição.

| Projeto e fonte | Papel | Capacidades documentadas | Implicação para Network Engineer |
|---|---|---|---|
| [Simul-Net](https://github.com/peotta/Simul-Net) | Simulação didática por protocolo | Registro com 11 módulos disponíveis, 8 planejados; 174 cenários identificados na revisão `7350803`; diagramas e modelos React/TS + HTML legado | Referência de explicação. Não alegar paridade de protocolos com nosso MVP |
| [NetSim / Michael Borck](https://github.com/michael-borck/netsim) | Concorrente direto no navegador | Motor TS, sintaxe Linux, firewall, exercícios avaliados e exportação de configurações/Containerlab | Benchmark prioritário. Zero instalação, avaliação e exportação já existem; não são diferenciais inéditos |
| [NetSim / Joxorsayan](https://github.com/joxorsayan/netsim) | Simulação web, backend Python | CLI estilo IOS, PCAP, laboratórios e tutor, segundo README | Estudar precisão dos modelos antes de ampliar CLI/IA. Navegador não implica execução inteiramente client-side |
| [Cisco Packet Tracer](https://tutorials.ptnetacad.net/help/default/intro.htm) | Simulador educacional | Configuração e diagnóstico de redes, visualização e limitações explícitas de modelagem | Referência de progressão. Nossa versão não substitui prática de certificação |
| [GNS3](https://docs.gns3.com/docs/emulators/which-emulators-should-i-use) | Emulação e appliances | VMs, containers e sistemas de rede; imagens têm requisitos próprios | Melhor realismo operacional; custo de preparação maior que um exercício estático |
| [EVE-NG](https://www.eve-ng.net/index.php/features/) | Ambiente de laboratório | Gestão e consoles de laboratórios; funcionalidades por edição | Referência para futuro laboratório compartilhado. Verificar edição/licença antes de implantação |
| [Containerlab](https://containerlab.dev/) | Topologia como código | Provisionamento de redes em containers, automação e integração com CI | Futuro adaptador de validação externa. Não construir outro orquestrador agora |
| [MISP](https://www.misp-project.org/features/) | Plataforma adjacente de CTI | Compartilhamento, taxonomias, objetos e warninglists | Referência para proveniência e falsos positivos; não é simulador concorrente direto |
| [OpenCTI](https://docs.opencti.io/latest/) | Plataforma adjacente de conhecimento | Organização de inteligência e relacionamentos | Referência para futuro modelo de entidades. Não anunciar integração ainda |
| [Tor Project](https://community.torproject.org/onion-services/overview/) / [I2P](https://i2p.net/en/docs/overview/intro/) | Referências técnicas, não concorrentes | Arquiteturas e propriedades das redes sobrepostas | Base para cenários conceituais com limites explícitos; não confundir tecnologias |

## Decisão

O mercado já contém ferramentas com mais protocolos, topologia editável e execução mais realista. O MVP não é superior a elas nesses critérios. O recorte escolhido é uma bancada em português que combina diagnóstico técnico, impacto operacional e raciocínio de inteligência, com registro de decisões e evidências.

O diferencial é uma **hipótese de produto**, não uma exclusividade comprovada: avaliar correção + preservação do serviço + limites da inferência no mesmo fluxo. Deve ser validado com alunos, analistas e profissionais de OT.

## Critérios para uma próxima comparação executada

1. Rodar o mesmo incidente DNS nos simuladores que o suportam, documentando protocolo, versões e parâmetros.
2. Medir tempo de preparação separadamente do tempo de resolução.
3. Testar se liberar tudo é aceito como solução ou se há testes de segmentação.
4. Inspecionar fidelidade de pacotes, estado e temporização; nunca comparar animação com emulação como se fossem equivalentes.
5. Avaliar navegação por teclado, leitura em mobile e persistência após recarga.
6. Medir a qualidade do raciocínio com uma rubrica cega e casos inéditos, não pela pontuação de um quiz conhecido.

## Reuso

Código original neste repositório. As licenças MIT do Simul-Net e dos dois NetSim foram identificadas nas páginas dos projetos, mas nenhum código foi copiado. Qualquer reuso futuro exige revisão da licença do arquivo/versão, dependências e preservação de avisos. Ferramentas adjacentes não herdam permissões umas das outras.

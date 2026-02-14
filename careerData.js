// careerData.js - specific details for each supported career
window.careerData = {
  "Desenvolvedor Web": {
    activities: [
      "Escrever e manter código front-end/back-end",
      "Colaborar com designers e outros desenvolvedores",
      "Testar e depurar aplicações web",
      "Implementar APIs e serviços REST/GraphQL",
      "Otimizar performance e acessibilidade de sites"
    ],
    coreSkills: ["HTML/CSS/JavaScript", "Logica de programação", "Git"],
    niceSkills: ["TypeScript", "Testes automatizados"],
    tools: ["VSCode", "Node.js", "React/Vue/Angular"],
    project: {
      name: "Portfolio Responsivo",
      scope: "Crie um site pessoal que mostre seus projetos, habilidades e contato.",
      deliverables: ["Página inicial com introdução", "Seção de projetos com imagens/descriptions", "Formulário de contato funcional"],
      criteria: ["Responsivo em mobile e desktop", "Código limpo e organizado", "Uso de controle de versão"],
      tip: "Comece com HTML e CSS, depois incremente com JavaScript para interatividade."
    },
    interview: [
      {q:"O que é uma promessa (promise) em JavaScript?", a:"Explique que é um objeto para lidar com operações assíncronas e como usar .then()/async-await."},
      {q:"Como você garante que seu site é responsivo?", a:"Falo sobre media queries, flexbox/grid e testes em dispositivos."},
      {q:"Qual a diferença entre var, let e const?", a:"Var tem escopo de função; let/const têm escopo de bloco; const não pode ser reatribuído."},
      {q:"O que é REST?", a:"É um estilo de arquitetura para APIs usando verbos HTTP e recursos."},
      {q:"Como você debuga um erro em produção?", a:"Uso logs, ferramentas de monitoramento e reproduzo localmente se possível."}
    ],
    salary: {
      junior: "3k-5k BRL/mês",
      pleno: "6k-10k BRL/mês",
      senior: "11k+ BRL/mês"
    },
    jobLinks: [
      "https://www.linkedin.com/jobs/view/1234567890/", 
      "https://www.indeed.com/viewjob?jk=abcdef12345"
    ],
    dio: {trail: "Desenvolvimento Web Full Stack", reason:"Abrange front-end e back-end essenciais para a carreira."}
  },
  "Cientista de Dados": {
    activities: [
      "Coletar e limpar dados de várias fontes",
      "Construir modelos estatísticos e de machine learning",
      "Visualizar dados e gerar insights",
      "Comunicar resultados para stakeholders",
      "Manter pipelines de dados e reproducibilidade"
    ],
    coreSkills: ["Python/R", "Estatística", "SQL"],
    niceSkills: ["TensorFlow/PyTorch", "Big Data"],
    tools: ["Jupyter", "Pandas", "Scikit-learn"],
    project: {
      name: "Análise de Dados de Vendas",
      scope: "Crie um relatório interativo analisando um conjunto de dados de vendas e apresentando insights.",
      deliverables: ["Notebook com limpeza de dados", "Gráficos e interpretações", "Conclusões e recomendações"],
      criteria: ["Dados bem tratados", "Visualizações claras", "Conclusões suportadas por dados"],
      tip: "Use seaborn/matplotlib para gráficos e comente seu processo." 
    },
    interview: [
      {q:"O que é overfitting?", a:"Quando o modelo aprende o ruído dos dados de treino e não generaliza bem."},
      {q:"Por que usamos normalização?", a:"Para escalar features e melhorar a convergência dos algoritmos."},
      {q:"Explique a diferença entre regressão e classificação.", a:"Regressão prevê valores contínuos; classificação categoriza em classes."},
      {q:"Quando usar KMeans?", a:"Para agrupar dados não rotulados em clusters semelhantes."},
      {q:"O que é validação cruzada?", a:"Técnica para avaliar o modelo em diferentes subconjuntos de dados."}
    ],
    salary: {
      junior: "4k-6k BRL/mês",
      pleno: "7k-12k BRL/mês",
      senior: "13k+ BRL/mês"
    },
    jobLinks: [
      "https://www.linkedin.com/jobs/view/0987654321/",
      "https://www.indeed.com/viewjob?jk=xyz987654"
    ],
    dio: {trail: "Ciência de Dados", reason:"Foca em estatística e machine learning usados no dia a dia."}
  }
  ,
  "Desenvolvedor de Games": {
    activities: [
      "Projetar e desenvolver mecânicas de jogo",
      "Programar gameplay e sistemas de física",
      "Colaborar com designers, artistas e som",
      "Otimizar performance para múltiplas plataformas",
      "Testar e iterar com base no feedback de jogadores"
    ],
    coreSkills: ["C# / Unity", "Lógica de programação", "Math for Games"],
    niceSkills: ["Unreal / Blueprints", "Shaders", "Ferramentas de áudio"],
    tools: ["Unity", "Unreal Engine", "Git", "Blender"],
    project: {
      name: "Mini-jogo Interativo",
      scope: "Crie um protótipo jogável com uma mecânica central e interface simples.",
      deliverables: ["Build jogável (PC ou Web)", "Documentação do gameplay", "Repositório com versão controlada"],
      criteria: ["Mecânica principal implementada e jogável", "Performance aceitável", "Boa documentação"],
      tip: "Comece pequeno: foque em uma mecânica divertida antes de escalar o projeto."
    },
    interview: [
      {q:"Como você implementaria um sistema de física simples?", a:"Explique sua abordagem, uso de motor físico ou simplificação para performance."},
      {q:"Como otimizaria o desempenho de um jogo em dispositivos fracos?", a:"Fale sobre LOD, batching, redução de draw calls e profiling."}
    ],
    salary: {
      junior: "3k-6k BRL/mês",
      pleno: "6k-11k BRL/mês",
      senior: "12k+ BRL/mês"
    },
    jobLinks: [
      "https://www.linkedin.com/jobs/search/?keywords=game%20developer",
      "https://www.indeed.com/q-Game-Developer-jobs.html"
    ],
    dio: {trail: "Desenvolvimento de Games", reason:"Trilha focada em engines e práticas de desenvolvimento para jogos."}
  }
  // add other careers as needed
};

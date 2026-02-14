# copilot-prompts-agents
Os agentes funciona como Entrevistador de Carreira em Tecnologia e Planejador de Carreiras.

## 🧩 Estrutura dos Agentes

---

### 👤 Atlas - Entrevistador de Carreira
Responsável por conduzir uma **entrevista estruturada de 7 perguntas** para entender o perfil profissional da pessoa interessada em tecnologia.

**Funções principais:**
- Fazer perguntas sobre interesses, motivações e objetivos  
- Coletar informações sobre experiência prévia e disponibilidade de estudo  
- Identificar preferências (pessoas, dados ou código)  
- Analisar respostas e sugerir **3 carreiras ranqueadas**  
- Transferir para o Agent 2 após a escolha da carreira  

**Fluxo de trabalho do agente Atlas:**
1. Inicia a entrevista com 7 perguntas (uma por vez)  
2. Analisa as respostas e aplica a matriz de decisão  
3. Sugere 3 carreiras ranqueadas com vantagens e desafios  
4. Aguarda a escolha do usuário  
5. Transfere todas as informações para o agente Nova  

👉 [Converse com o Atlas](https://gilbertomarques.github.io/copilot-prompts-agents/atlas/)

---

### 🤖 Nova - Especialista em Carreira
Responsável por criar um **plano de estudos personalizado** com base na carreira escolhida e nas informações coletadas pelo Atlas.

**Funções principais:**
- Estruturar um roteiro de aprendizado passo a passo  
- Indicar tecnologias, ferramentas e recursos prioritários  
- Adaptar o plano conforme disponibilidade de horas semanais  
- Conectar interesses e experiências prévias com a carreira escolhida  
- Ajudar na evolução profissional (primeiro emprego, transição ou crescimento)  

**Fluxo de trabalho do Nova:**
1. Recebe as informações transferidas pelo Atlas 
2. Analisa carreira escolhida, tempo disponível e nível de experiência  
3. Monta um plano de estudos personalizado com etapas claras  
4. Sugere recursos, tecnologias e práticas recomendadas  
5. Acompanha a evolução e ajusta o plano conforme necessário  

👉 [Converse com o Nova](https://gilbertomarques.github.io/copilot-prompts-agents/nova/)

---

### 🔄 Fluxo Geral
1. O agente **Atlas** entrevista e sugere carreiras  
2. Usuário escolhe uma carreira  
3. O agente **Atlas** transfere informações para o agente **Nova**  
4. O agente **Nova** monta o plano de estudos personalizado

> **Nota:** os dados exibidos por Atlas (faixa salarial, hierarquias — junior/pleno/senior — e links de vagas) dependem do conteúdo de `careerData.js`. Se uma carreira não estiver listada ali, essas seções serão omitidas. Você pode editar o arquivo para adicionar mais profissões ou preencher os campos de salário/vagas. Consulte o modelo existente para copiar o formato.

---   

**Atlas** → simboliza quem guia e orienta (o entrevistador).

**Nova** → simboliza algo novo, crescimento e evolução (o especialista em carreira).

---

## 🔧 Configuração do Chat

Os agentes usam o **OpenAI Chat API** para fornecer respostas dinâmicas. Como o GitHub Pages é um site estático, você precisa fornecer sua própria chave de API.

1. Crie um arquivo `config.js` na raiz do diretório `agents/` com o conteúdo abaixo (não comite-o):
   ```js
   // config.js
   window.OPENAI_API_KEY = "sk-..."; // sua chave pessoal
   ```
2. O `.gitignore` já inclui `config.js` para evitar vazamento de credenciais.
3. Se não quiser usar a API, os agentes continuarão exibindo um campo de chat mas não responderão.
4. O plano gratuito do OpenAI costuma oferecer créditos iniciais; consulte [https://platform.openai.com/](https://platform.openai.com/) para cadastro.

> **Aviso de segurança:** armazenar chaves diretamente em arquivos públicos não é recomendado para produção. Este exemplo é apenas para protótipo/desenvolvimento.

## 📦 Publicando no GitHub Pages
Para que as páginas dos agentes (e todo o sistema) fiquem visíveis na web é preciso habilitar o GitHub Pages no repositório:

1. Acesse o repositório no GitHub.  
2. Vá em **Settings > Pages**.  
3. Em **Source**, selecione a branch `main` (ou outra que contenha os arquivos) e a pasta `/ (root)`.  
4. Salve as alterações. Aguarde alguns minutos enquanto o serviço constrói o site.  
5. O endereço será algo como `https://<seu-usuario>.github.io/<nome-do-repo>/agents/atlas/` e `.../agents/nova/`.

Se você vir uma mensagem como “Não existe um site do GitHub Pages aqui”, verifique:
- se a branch escolhida contém o diretório `agents/` e o `index.html`;  
- se não há arquivos bloqueados ou commits pendentes;  
- se alguém desativou o Pages para o repositório.  

Após a configuração, abra a URL disponibilizada e teste as interações — o Atlas deverá apresentar perguntas e, após escolher carreira, redirecionar ao Nova.

> ⚠️ Ainda não configurado? Execute git push em `main` e repita os passos acima.

---


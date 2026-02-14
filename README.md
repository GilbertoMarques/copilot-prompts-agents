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

**Fluxo de trabalho do Agent 1:**
1. Inicia a entrevista com 7 perguntas (uma por vez)  
2. Analisa as respostas e aplica a matriz de decisão  
3. Sugere 3 carreiras ranqueadas com vantagens e desafios  
4. Aguarda a escolha do usuário  
5. Transfere todas as informações para o Agent 2  

👉 [Converse com o Altas](URL_DO_AGENT_1)

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

👉 [Converse com o Nova](URL_DO_AGENT_2)

---

### 🔄 Fluxo Geral
1. **Atlas** entrevista e sugere carreiras  
2. Usuário escolhe uma carreira  
3. **Altas** transfere informações para o **Nova**  
4. **Nova** monta o plano de estudos personalizado

---   

**Atlas** → simboliza quem guia e orienta (o entrevistador).

**Nova** → simboliza algo novo, crescimento e evolução (o especialista em carreira).

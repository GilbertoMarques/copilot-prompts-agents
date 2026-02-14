// chat.js – implementação local orientada pelas regras do agente Atlas
// ensure script runs after DOM is ready to avoid missing elements
(function(){
  document.addEventListener('DOMContentLoaded', ()=>{
  const questions = [
    "Olá! Vou te ajudar a descobrir a melhor carreira em tecnologia para você.\n\nPara começar: o que mais te atrai em tecnologia - resolver problemas, criar produtos ou entender sistemas?",
    "Legal! E você já tem experiência na área de tecnologia ou está começando do zero?",
    "Entendi! Quantas horas por semana você consegue dedicar aos estudos?",
    "Perfeito! No seu dia a dia, você prefere lidar mais com pessoas, dados ou código?",
    "Ótimo! Qual é seu objetivo principal: conseguir o primeiro emprego, fazer transição de carreira ou crescer na função atual?",
    "Show! Quais assuntos ou tecnologias mais despertam seu interesse? Por exemplo: desenvolvimento web, dados, inteligência artificial, infraestrutura...",
    "Última pergunta: você tem alguma experiência prévia (mesmo que não seja em tech) que gostaria de aproveitar nessa nova jornada?"
  ];
  let answers = [];
  let answersMeta = {};

  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');

  function appendMessage(text, sender='bot'){
    const div = document.createElement('div');
    div.className = sender + '-message';
    if(sender==='bot'){
      // simple markdown: *bold*
      const html = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
      div.innerHTML = html.replace(/\n/g,'<br>');
    } else {
      div.textContent = text;
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  // simulate bot typing, returns promise that resolves when message fully shown
  async function sendBot(text){
    // show typing indicator
    const ind = appendMessage('...', 'bot');
    // delay proportional to length (min 500ms)
    await new Promise(r=>setTimeout(r, Math.max(500, text.length*20)));
    // remove indicator and append real message with markdown
    ind.remove();
    return appendMessage(text, 'bot');
  }

  // helpers: normalization, keyword extraction and simple intent checks
  function normalizeText(s){
    return (s||'').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').trim();
  }

  function extractKeywords(s){
    const norm = normalizeText(s);
    const words = norm.split(/[^a-z0-9]+/i).filter(Boolean);
    return Array.from(new Set(words));
  }

  function isLikelyTechInterest(s){
    const k = normalizeText(s);
    const tech = ['program', 'programar','codigo','codar','software','aplicativo','app','web','site','desenvolv','jogo','game','dados','infra','cloud','ux','design','ia','inteligencia','machine','aprender'];
    return tech.some(t=>k.includes(t));
  }

  function isNonInformative(s){
    const k = normalizeText(s);
    if(!k) return true;
    const junk = ['teste','ok','ta','tao','blabla','bla','sei','sei la','nao sei','naosei','qq','qqr','qualquer','teste123'];
    if(k.length<3) return true;
    if(junk.some(j=>k===j || k.includes(j))) return true;
    // if answer is a single unrelated word like 'jogar', consider asking clarifying
    if(k.split(/\s+/).length===1 && !isLikelyTechInterest(k)) return true;
    return false;
  }

  function mapPreference(s){
    const k = normalizeText(s);
    if(/pessoas|com pessoas|humano|usuari/.test(k)) return 'pessoas';
    if(/dados|data|analise|analit/.test(k)) return 'dados';
    if(/codigo|codigo|programa|desenvolv|dev|programar|code|codar/.test(k)) return 'código';
    return null;
  }

  function validateHours(s){
    const n = parseInt(s.replace(/[^0-9]/g,''));
    return isNaN(n) ? null : n;
  }

  async function askNext(){
    console.log('askNext called, answers so far', answers);
    if(answers.length < questions.length){
      // display question in italics for clarity
      await sendBot(`*${questions[answers.length]}*`);
    } else {
      await analyzeAndSuggest();
    }
  }

  form.addEventListener('submit', async e=>{
    e.preventDefault();
    const valRaw = input.value || '';
    const val = valRaw.trim();
    if(!val) return;
    // reject non-informative replies like "teste" and ask for clarification
    if(isNonInformative(val)){
      await sendBot('Não entendi sua resposta — pode responder com mais informações reais? Por exemplo: se for sobre interesses, diga *criar produtos*, *resolver problemas* ou *entender sistemas*.');
      return;
    }
    // show user's message
    appendMessage(val, 'user');
    input.value='';

    if(form.dataset.phase==='choice'){
      handleChoice(val);
      return;
    }

    // validation / normalization per question
    const idx = answers.length; // index of the question being answered
    // Q0: attraction (expect resolver/criar/entender) - ask clarifying if ambiguous
    if(idx===0){
      const norm = normalizeText(val);
      if(!/resolver|criar|entender/.test(norm)){
        if(isLikelyTechInterest(val)){
          // map common tech interest words to closest option
          if(/jogo|game/.test(norm)){
            await sendBot('Quando você diz que gosta de jogos, você quer *criar produtos* (ex: desenvolver jogos) ou é apenas hobby? Responda: criar produtos / resolver problemas / entender sistemas.');
            return;
          }
          // otherwise accept but normalize to 'criar produtos'
          answersMeta.attraction = 'criar produtos';
        } else {
          await sendBot('Poderia escolher entre: *resolver problemas*, *criar produtos* ou *entender sistemas*? Isso me ajuda a sugerir carreiras mais alinhadas.');
          return;
        }
      } else {
        answersMeta.attraction = norm.match(/resolver|criar|entender/)[0];
      }
    }

    // Q1: experience - store normalized
    if(idx===1){
      const n = normalizeText(val);
      if(/^\d/.test(n)){
        answersMeta.experience = n;
      } else if(/nao|nenhum|zero|sem|começando|inicio/.test(n)){
        answersMeta.experience = 'iniciante';
      } else if(/sim|ja|experiencia|anoso|anos/.test(n)){
        answersMeta.experience = 'com experiencia';
      } else {
        answersMeta.experience = n;
      }
    }

    // Q2: hours - require numeric
    if(idx===2){
      const h = validateHours(val);
      if(h===null){
        await sendBot('Por favor informe *apenas* um número aproximado de horas por semana (ex: 10).');
        return;
      }
      answersMeta.hours = h;
    }

    // Q3: preference - normalize to pessoas/dados/código
    if(idx===3){
      const pref = mapPreference(val);
      if(!pref){
        await sendBot('Você prefere lidar mais com *pessoas*, *dados* ou *código*? Responda com uma dessas opções.');
        return;
      }
      answersMeta.preference = pref;
    }

    // Q5: technical interests - extract keywords
    if(idx===5){
      answersMeta.interests = extractKeywords(val);
    }

    // push the (raw) value so existing flows work, then continue
    answers.push(val);
    await askNext();
  });

  // start
  // if we're in Nova page with career param, run planner instead
  const params = new URLSearchParams(window.location.search);
  if(params.has('career')){
    runPlanner(params);
    return;
  }
  askNext();

  async function analyzeAndSuggest(){
    const careers = [
      {name:'Desenvolvedor Web', interests:['criar produtos','resolver problemas','entender sistemas'], keywords:['web','html','css','javascript'], field:'código', advantages:['alta demanda','facil acesso a recursos'], challenges:['muita atualização constante','concorrência alta'], market:'muito alta'},
      {name:'Desenvolvedor de Games', interests:['criar produtos','resolver problemas'], keywords:['game','jogo','unity','unreal','c#'], field:'código', advantages:['criatividade e expressão','mercado nicho em crescimento'], challenges:['alta competitividade','requer portfólio forte'], market:'alta'},
      {name:'Cientista de Dados', interests:['entender sistemas','resolver problemas'], keywords:['dados','python','estatística'], field:'dados', advantages:['alto salário','trabalha com insights'], challenges:['curva de aprendizagem em matemática','ferramentas complexas'], market:'alta'},
      {name:'Engenheiro de Infraestrutura', interests:['entender sistemas','resolver problemas'], keywords:['infra','rede','cloud'], field:'código', advantages:['estruturas robustas','essencial em grandes empresas'], challenges:['on-call 24/7','trabalha com sistemas críticos'], market:'boa'},
      {name:'Designer de UX', interests:['criar produtos'], keywords:['design','ui','ux'], field:'pessoas', advantages:['envolvimento criativo','foco no usuário'], challenges:['subjetividade nas avaliações','pode ser desvalorizado'], market:'boa'},
      {name:'Analista de Segurança', interests:['entender sistemas','resolver problemas'], keywords:['segurança','hacker','pentest'], field:'dados', advantages:['demanda crescente','salários competitivos'], challenges:['trabalho sob pressão','exige atualização constante'], market:'alta'}
    ];
    careers.forEach(c=>{
      let score=0;
      // use normalized metadata when available
      const attr = normalizeText(answersMeta.attraction || answers[0] || '');
      const prefs = normalizeText(answersMeta.preference || answers[3] || '');
      const hrs = answersMeta.hours || validateHours(answers[2]||'') || 0;
      const kws = Array.isArray(answersMeta.interests) ? answersMeta.interests : extractKeywords(answers[5]||'');

      // attraction matching (strong weight)
      c.interests.forEach(i=>{
        const ni = normalizeText(i);
        if(attr.includes(ni) || attr.includes(ni.split(' ')[0])) score += 5;
      });

      // keyword overlap from user interests
      kws.forEach(k=>{
        c.keywords.forEach(ck=>{ if(normalizeText(ck).includes(k) || k.includes(normalizeText(ck))) score += 3; });
      });

      // preference field (people/data/code)
      if(prefs && normalizeText(c.field).includes(prefs)) score += 4;

      // hours availability
      if(hrs>=20) score += 5;
      else if(hrs>=10) score += 3;
      else if(hrs>0) score += 1;

      // if user mentioned 'jogo' map to developer if applicable
      if(kws.includes('jogo') || kws.includes('game')){
        if(c.name.toLowerCase().includes('desenvolvedor')) score += 3;
      }

      // small boost for market demand
      if(c.market && (c.market.includes('alta') || c.market.includes('muito'))) score += 1;

      c.score = score;
    });
    careers.sort((a,b)=>b.score-a.score);
    const top3=careers.slice(0,3);
    await sendBot("Com base no seu perfil, identifiquei 3 carreiras muito promissoras:");
    for(let i=0;i<top3.length;i++){
      const c = top3[i];
      const medal = ['🥇 1º LUGAR','🥈 2º LUGAR','🥉 3º LUGAR'][i];
      let block = `${medal}: *${c.name}* - *${c.score}/20*\n`;
      // add salary information if available
      const data = window.careerData?.[c.name] || {};
      if(data.salary){
        block += `💰 *FAIXA SALARIAL (junior/pleno/senior):*\n` +
                 `Junior: ${data.salary.junior} | ` +
                 `Pleno: ${data.salary.pleno} | ` +
                 `Senior: ${data.salary.senior}\n`;
      } else {
        block += `💰 *FAIXA SALARIAL:*\n` +
                 `Informação não disponível para esta carreira.\n`;
      }
      block += `💡 *POR QUE COMBINA COM VOCÊ:*\n- Afinidade com seus interesses e disponibilidade.\n`;
      block += `⚖️ *O QUE ESPERAR:*\n`;
      block += `*VANTAGENS:*\n- ${c.advantages.join('\n- ')}\n`;
      block += `*DESAFIOS:*\n- ${c.challenges.join('\n- ')}\n`;
      block += `*MERCADO:* ${c.market} (varia por região/experiência)`;
      if(data.jobLinks && data.jobLinks.length){
        block += `\n\n🔗 *VAGAS EM ALTA:*\n`;
        data.jobLinks.slice(0,2).forEach(l=>{ block += `- ${l}\n`; });
      } else {
        block += `\n\n🔗 *VAGAS EM ALTA:*\nNenhum link disponível no momento.\n`;
      }
      await sendBot(block);
    }
    await sendBot("Qual dessas carreiras te chamou mais atenção?");
    form.dataset.phase='choice';
    // wrap previous sent career blocks into result-cards for improved layout
    const cards = document.querySelectorAll('.bot-message');
    cards.forEach(msg=>{
      if(!msg.dataset.card){
        msg.classList.add('result-card');
        msg.dataset.card='1';
      }
    });
  }

  async function handleChoice(choice){
    const chosen = choice.trim().toLowerCase();
    const careersMap = { 'desenvolvedor web': 'Desenvolvedor Web', 'cientista de dados':'Cientista de Dados','engenheiro de infraestrutura':'Engenheiro de Infraestrutura','designer de ux':'Designer de UX','analista de segurança':'Analista de Segurança' };
    const careerName = careersMap[chosen] || choice;
    appendMessage(`Excelente escolha! Vou te passar para meu colega especialista em ${careerName}. Ele vai montar todo o plano de estudos personalizado para você!`,'bot');
    // simulate transfer typing
    await sendBot('Aguarde um instante, estou transferindo suas informações para o agente Nova...');
    const params = new URLSearchParams({
      career: careerName,
      hours: answers[2],
      experience: answers[1],
      objective: answers[4],
      preference: answers[3],
      interests: answers[5]
    });
    // compute target path relative to current location to robustly reach nova folder
    // remove last two segments from pathname (e.g. /foo/atlas/index.html -> /foo/)
    const parts = window.location.pathname.split('/').filter(p=>p.length>0);
    let base = '/';
    if(parts.length>2){
      base = '/' + parts.slice(0,-2).join('/') + '/';
    }
    const target = base + 'nova/index.html?' + params.toString();
    setTimeout(()=>{ window.location.href=target; }, 2000);
  }

  // planner logic executed when Nova page loaded with params
  function runPlanner(params){
    const career = params.get('career');
    const hours = params.get('hours');
    const exp = params.get('experience');
    const obj = params.get('objective');
    const pref = params.get('preference');
    const inter = params.get('interests');

    appendMessage(`Olá! Recebi suas informações do entrevistador.\n\nVejo que você escolheu ${career} e tem ${hours} horas por semana para estudar. Perfeito!\n\nVou montar agora seu plano completo personalizado...`,'bot');

    // load data for this career
    const data = window.careerData?.[career];
    const planObj = {};
    let planText = `🧩 VISÃO DO DIA A DIA\n\nComo é o trabalho de um(a) ${career}:\n`;
    (data?.activities||[]).forEach(a=>{ planText += `- ${a}\n`; });
    planText += `\n🧠 MAPA DE SKILLS\n\nCORE SKILLS (essenciais):\n`;
    (data?.coreSkills||[]).forEach(s=>{ planText += `- ${s}\n`; });
    planText += `\nNICE-TO-HAVE (complementares):\n`;
    (data?.niceSkills||[]).forEach(s=>{ planText += `- ${s}\n`; });
    planText += `\nFERRAMENTAS E TECNOLOGIAS:\n`;
    (data?.tools||[]).forEach(t=>{ planText += `- ${t}\n`; });

    planText += `\n📅 ROADMAP DE 90 DIAS\n\nADAPTADO PARA: ${hours} horas/semana\n\n`;
    planText += `MÊS 1 - FUNDAMENTOS\n\nSEMANA 1-2:\n- Estudar os fundamentos de ${career}.\n- Fazer exercícios práticos básicos.\n\nSEMANA 3-4:\n- Construir pequenos projetos de exemplo.\n- Revisar conceitos que ainda tiver dúvidas.\n\nMÊS 2 - PRÁTICA\n\nSEMANA 5-6:\n- Desenvolver projeto principal (ver abaixo).\n- Ler documentação e ampliar conhecimentos.\n\nSEMANA 7-8:\n- Adicionar funcionalidades extras ao projeto.\n- Começar a compartilhar código em GitHub.\n\nMÊS 3 - PORTFÓLIO E PREPARAÇÃO\n\nSEMANA 9-10:\n- Finalizar e documentar o projeto.\n- Criar perfil profissional (LinkedIn/GitHub).\n\nSEMANA 11-12:\n- Simular entrevistas com perguntas comuns.\n- Aplicar para vagas ou cursos.\n\n🚀 PROJETO DE PORTFÓLIO\n\nPROJETO: ${data?.project?.name||'Projeto de exemplo'}\n\nO QUE FAZER:\n${data?.project?.scope||'Descrever o escopo aqui.'}\n\nENTREGÁVEIS:\n`;
    (data?.project?.deliverables||[]).forEach(d=>{ planText += `- ${d}\n`; });
    planText += `\nCRITÉRIOS DE ACEITAÇÃO:\n`;
    (data?.project?.criteria||[]).forEach(c=>{ planText += `- ${c}\n`; });
    planText += `\nDICA: ${data?.project?.tip||''}\n`;

    planText += `\n💬 ROTEIRO DE ENTREVISTAS\n\n`;
    (data?.interview||[]).forEach((qa,i)=>{
      planText += `PERGUNTA ${i+1}: ${qa.q}\nCOMO RESPONDER:\n${qa.a}\n\n`;
    });

    planText += `🎓 TRILHA DIO RECOMENDADA\n\nTRILHA: ${data?.dio?.trail||''}\n\nPOR QUE ESSA TRILHA:\n${data?.dio?.reason||''}\n\nPRÓXIMOS PASSOS:\n1. Acesse dio.me\n2. Busque por "${data?.dio?.trail||''}"\n3. Inscreva-se gratuitamente\n4. Siga o cronograma junto com este roadmap\n\n✨ Seu plano está pronto!\n\nLembre-se: o mais importante é a constância, não a velocidade. Comece pela Semana 1 e vá no seu ritmo.\n\nTem alguma dúvida sobre o plano? Posso detalhar alguma parte específica?`;

    // persist plan in localStorage
    planObj.career=career; planObj.hours=hours;
    planObj.text=planText;
    // also store HTML version for future display
    planObj.html = planText.replace(/\n/g,'<br>');
    localStorage.setItem('lastPlan', JSON.stringify(planObj));

    appendMessage(planText,'bot');
    // add interaction buttons
    const btnContainer = document.createElement('div');
    btnContainer.className='plan-actions';
    const againBtn = document.createElement('button');
    againBtn.textContent='Diga outra carreira';
    againBtn.onclick=()=>{ window.location.href='../atlas/index.html'; };
    const pdfBtn = document.createElement('button');
    pdfBtn.textContent='Gerar PDF';
    pdfBtn.onclick=()=>{
      const w = window.open('','_blank');
      // inject minimal styles to mimic bubbles and cards
      const style = `
        body{font-family:Arial,sans-serif;padding:20px;color:#e6eef8;background:#0f1724;}
        .plan{white-space:pre-wrap;}
        .result-card{background:#334155;padding:10px 14px;border-radius:10px;margin:8px 0;}
      `;
      w.document.write('<html><head><title>Plano de Carreira</title><style>'+style+'</style></head><body>'+
        '<h1>'+career+'</h1>'+
        '<div class="plan">'+planText.replace(/</g,'&lt;').replace(/\n/g,'<br>')+'</div></body></html>');
      w.document.close();
      w.print();
    };
    const emailBtn = document.createElement('button');
    emailBtn.textContent='Enviar por email';
    emailBtn.onclick=()=>{
      const body = encodeURIComponent(planText);
      window.location.href='mailto:?subject=Meu plano de carreira&body='+body;
    };
    btnContainer.appendChild(againBtn);
    btnContainer.appendChild(pdfBtn);
    btnContainer.appendChild(emailBtn);
    messages.appendChild(btnContainer);

    form.querySelector('input').disabled=true;
    form.querySelector('button').disabled=true;
  }
  });
})();

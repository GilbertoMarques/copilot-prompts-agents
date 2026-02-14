// chat.js – implementação local orientada pelas regras do agente Atlas
(function(){
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

  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');

  function appendMessage(text, sender='bot'){
    const div = document.createElement('div');
    div.className = sender + '-message';
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function askNext(){
    if(answers.length < questions.length){
      appendMessage(questions[answers.length], 'bot');
    } else {
      analyzeAndSuggest();
    }
  }

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const val = input.value.trim();
    if(!val) return;
    appendMessage(val, 'user');
    input.value='';
    if(form.dataset.phase==='choice'){
      handleChoice(val);
    } else {
      answers.push(val);
      askNext();
    }
  });

  // start
  // if we're in Nova page with career param, run planner instead
  const params = new URLSearchParams(window.location.search);
  if(params.has('career')){
    runPlanner(params);
    return;
  }
  askNext();

  function analyzeAndSuggest(){
    const careers = [
      {name:'Desenvolvedor Web', interests:['criar produtos','resolver problemas','entender sistemas'], keywords:['web','html','css','javascript'], field:'código', advantages:['alta demanda','facil acesso a recursos'], challenges:['muita atualização constante','concorrência alta'], market:'muito alta'},
      {name:'Cientista de Dados', interests:['entender sistemas','resolver problemas'], keywords:['dados','python','estatística'], field:'dados', advantages:['alto salário','trabalha com insights'], challenges:['curva de aprendizagem em matemática','ferramentas complexas'], market:'alta'},
      {name:'Engenheiro de Infraestrutura', interests:['entender sistemas','resolver problemas'], keywords:['infra','rede','cloud'], field:'código', advantages:['estruturas robustas','essencial em grandes empresas'], challenges:['on-call 24/7','trabalha com sistemas críticos'], market:'boa'},
      {name:'Designer de UX', interests:['criar produtos'], keywords:['design','ui','ux'], field:'pessoas', advantages:['envolvimento criativo','foco no usuário'], challenges:['subjetividade nas avaliações','pode ser desvalorizado'], market:'boa'},
      {name:'Analista de Segurança', interests:['entender sistemas','resolver problemas'], keywords:['segurança','hacker','pentest'], field:'dados', advantages:['demanda crescente','salários competitivos'], challenges:['trabalho sob pressão','exige atualização constante'], market:'alta'}
    ];
    careers.forEach(c=>{
      let score=0;
      const a1=answers[0].toLowerCase();
      c.interests.forEach(i=>{ if(a1.includes(i)) score+=5; });
      const a2=answers[1].toLowerCase();
      c.keywords.forEach(k=>{ if(a2.includes(k)) score+=3; });
      const a4=answers[3].toLowerCase();
      if(a4.includes(c.field)) score+=4;
      const h=parseInt(answers[2]);
      if(!isNaN(h)){
        if(h>=20) score+=5;
        else if(h>=10) score+=3;
        else score+=1;
      }
      c.score=score;
    });
    careers.sort((a,b)=>b.score-a.score);
    const top3=careers.slice(0,3);
    let text="Com base no seu perfil, identifiquei 3 carreiras muito promissoras:\n";
    top3.forEach((c,i)=>{
      const medal=['🥇 1º LUGAR','🥈 2º LUGAR','🥉 3º LUGAR'][i];
      text+=`\n${medal}: ${c.name} - ${c.score}/20\n\n💡 POR QUE COMBINA COM VOCÊ:\n- Afinidade com seus interesses e disponibilidade.\n\n⚖️ O QUE ESPERAR:\n\nVANTAGENS:\n- ${c.advantages.join('\n- ')}\n\nDESAFIOS:\n- ${c.challenges.join('\n- ')}\n\n📈 MERCADO:\n${c.market} (varia por região/experiência)\n\n-------------------------------------------\n`;
    });
    text+="\nQual dessas carreiras te chamou mais atenção?";
    appendMessage(text,'bot');
    form.dataset.phase='choice';
  }

  function handleChoice(choice){
    const chosen = choice.trim().toLowerCase();
    const careersMap = { 'desenvolvedor web': 'Desenvolvedor Web', 'cientista de dados':'Cientista de Dados','engenheiro de infraestrutura':'Engenheiro de Infraestrutura','designer de ux':'Designer de UX','analista de segurança':'Analista de Segurança' };
    const careerName = careersMap[chosen] || choice;
    appendMessage(`Excelente escolha! Vou te passar para meu colega especialista em ${careerName}. Ele vai montar todo o plano de estudos personalizado para você!`,'bot');
    const params = new URLSearchParams({
      career: careerName,
      hours: answers[2],
      experience: answers[1],
      objective: answers[4],
      preference: answers[3],
      interests: answers[5]
    });
    setTimeout(()=>{ window.location.href='../nova/index.html?'+params.toString(); }, 3000);
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
    planObj.career=career; planObj.hours=hours; planObj.text=planText;
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
      w.document.write('<pre>'+planText.replace(/</g,'&lt;')+'</pre>');
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
})();

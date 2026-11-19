import {useEffect,useState} from 'react';
export const languageOptions = [
  ["pt", "Português"],
  ["en", "English"],
  ["fr", "Français"],
  ["es", "Español"],
  ["zh", "中文（普通话）"],
  ["hi", "हिन्दी"],
];

export const uiText = {
  pt: { home:"Início", workouts:"Treinos", nutrition:"Alimentação", contents:"Conteúdos", progress:"Progresso", profile:"Perfil", modalities:"Modalidades", calendar:"Calendário", challenges:"Desafios", assistant:"Assistente JL", coach:"Meu coach", plans:"Planos", notifications:"Notificações", guided:"Treino guiado", list:"Lista completa", start:"Começar treino guiado", series:"séries", reps:"repetições", complete:"Concluir série", next:"Próximo exercício", exit:"Sair do modo guiado", language:"Idioma", ready:"Pronto" },
  en: { home:"Home", workouts:"Workouts", nutrition:"Nutrition", contents:"Content", progress:"Progress", profile:"Profile", modalities:"Training modes", calendar:"Calendar", challenges:"Challenges", assistant:"JL Assistant", coach:"My coach", plans:"Plans", notifications:"Notifications", guided:"Guided workout", list:"Full list", start:"Start guided workout", series:"sets", reps:"repetitions", complete:"Complete set", next:"Next exercise", exit:"Exit guided mode", language:"Language", ready:"Ready" },
  fr: { home:"Accueil", workouts:"Entraînements", nutrition:"Nutrition", contents:"Contenus", progress:"Progression", profile:"Profil", modalities:"Modes d’entraînement", calendar:"Calendrier", challenges:"Défis", assistant:"Assistant JL", coach:"Mon coach", plans:"Forfaits", notifications:"Notifications", guided:"Entraînement guidé", list:"Liste complète", start:"Commencer l’entraînement guidé", series:"séries", reps:"répétitions", complete:"Terminer la série", next:"Exercice suivant", exit:"Quitter le mode guidé", language:"Langue", ready:"Prêt" },
  es: { home:"Inicio", workouts:"Entrenamientos", nutrition:"Alimentación", contents:"Contenido", progress:"Progreso", profile:"Perfil", modalities:"Modalidades", calendar:"Calendario", challenges:"Desafíos", assistant:"Asistente JL", coach:"Mi entrenador", plans:"Planes", notifications:"Notificaciones", guided:"Entrenamiento guiado", list:"Lista completa", start:"Iniciar entrenamiento guiado", series:"series", reps:"repeticiones", complete:"Completar serie", next:"Siguiente ejercicio", exit:"Salir del modo guiado", language:"Idioma", ready:"Listo" },
  zh: { home:"首页", workouts:"训练", nutrition:"营养", contents:"内容", progress:"进度", profile:"个人资料", modalities:"训练模式", calendar:"日历", challenges:"挑战", assistant:"JL 助手", coach:"我的教练", plans:"计划", notifications:"通知", guided:"指导训练", list:"完整列表", start:"开始指导训练", series:"组", reps:"次", complete:"完成一组", next:"下一个动作", exit:"退出指导模式", language:"语言", ready:"准备好了" },
  hi: { home:"होम", workouts:"वर्कआउट", nutrition:"पोषण", contents:"सामग्री", progress:"प्रगति", profile:"प्रोफ़ाइल", modalities:"ट्रेनिंग मोड", calendar:"कैलेंडर", challenges:"चुनौतियाँ", assistant:"JL सहायक", coach:"मेरे कोच", plans:"योजनाएँ", notifications:"सूचनाएँ", guided:"निर्देशित वर्कआउट", list:"पूरी सूची", start:"निर्देशित वर्कआउट शुरू करें", series:"सेट", reps:"दोहराव", complete:"सेट पूरा करें", next:"अगला व्यायाम", exit:"निर्देशित मोड से बाहर निकलें", language:"भाषा", ready:"तैयार" },
};

export const authText = {
  pt:{welcome:"Bem-vindo de volta",start:"Comece sua jornada",forgot:"Recuperar acesso",reset:"Definir nova senha",intro:"Entre e construa sua consistência.",name:"Nome completo",email:"Email",password:"Senha",confirm:"Confirmar senha",continue:"Continuar",back:"Voltar",chooseLanguage:"Escolha o idioma",languageHint:"Você poderá alterar isso depois no Perfil.",terms:"Li os termos e autorizo o armazenamento privado dos dados de treino que registrar.",step1:"1 · Dados",step2:"2 · Seu ponto de partida",registerNotice:"Confira seu email para confirmar o cadastro. Sua conta começa no plano grátis."},
  en:{welcome:"Welcome back",start:"Start your journey",forgot:"Recover access",reset:"Set a new password",intro:"Sign in and build consistency.",name:"Full name",email:"Email",password:"Password",confirm:"Confirm password",continue:"Continue",back:"Back",chooseLanguage:"Choose your language",languageHint:"You can change this later in Profile.",terms:"I agree to the terms and authorize private storage of the training data I record.",step1:"1 · Details",step2:"2 · Your starting point",registerNotice:"Check your email to confirm your registration. Your account starts on the free plan."},
  fr:{welcome:"Bon retour",start:"Commencez votre parcours",forgot:"Récupérer l’accès",reset:"Définir un nouveau mot de passe",intro:"Connectez-vous et créez votre régularité.",name:"Nom complet",email:"E-mail",password:"Mot de passe",confirm:"Confirmer le mot de passe",continue:"Continuer",back:"Retour",chooseLanguage:"Choisissez la langue",languageHint:"Vous pourrez la modifier plus tard dans le Profil.",terms:"J’accepte les conditions et autorise le stockage privé de mes données d’entraînement.",step1:"1 · Informations",step2:"2 · Votre point de départ",registerNotice:"Consultez votre e-mail pour confirmer votre inscription. Votre compte commence avec l’offre gratuite."},
  es:{welcome:"Bienvenido de nuevo",start:"Comienza tu camino",forgot:"Recuperar acceso",reset:"Crear una nueva contraseña",intro:"Entra y construye tu constancia.",name:"Nombre completo",email:"Correo electrónico",password:"Contraseña",confirm:"Confirmar contraseña",continue:"Continuar",back:"Volver",chooseLanguage:"Elige el idioma",languageHint:"Podrás cambiarlo después en Perfil.",terms:"Acepto las condiciones y autorizo el almacenamiento privado de mis datos de entrenamiento.",step1:"1 · Datos",step2:"2 · Tu punto de partida",registerNotice:"Revisa tu correo para confirmar el registro. Tu cuenta comienza con el plan gratuito."},
  zh:{welcome:"欢迎回来",start:"开始你的训练旅程",forgot:"找回账户",reset:"设置新密码",intro:"登录并建立稳定的训练习惯。",name:"姓名",email:"电子邮箱",password:"密码",confirm:"确认密码",continue:"继续",back:"返回",chooseLanguage:"选择语言",languageHint:"之后可以在个人资料中更改。",terms:"我同意条款，并授权私密保存我记录的训练数据。",step1:"1 · 基本信息",step2:"2 · 你的起点",registerNotice:"请查看邮箱并确认注册。你的账户将从免费方案开始。"},
  hi:{welcome:"वापसी पर स्वागत है",start:"अपनी यात्रा शुरू करें",forgot:"खाते तक पहुँच वापस पाएँ",reset:"नया पासवर्ड सेट करें",intro:"साइन इन करें और नियमितता बनाएँ।",name:"पूरा नाम",email:"ईमेल",password:"पासवर्ड",confirm:"पासवर्ड की पुष्टि करें",continue:"जारी रखें",back:"वापस",chooseLanguage:"भाषा चुनें",languageHint:"आप इसे बाद में प्रोफ़ाइल में बदल सकते हैं।",terms:"मैं शर्तों से सहमत हूँ और अपने दर्ज किए गए प्रशिक्षण डेटा के निजी संग्रह की अनुमति देता/देती हूँ।",step1:"1 · विवरण",step2:"2 · आपकी शुरुआती स्थिति",registerNotice:"पंजीकरण की पुष्टि के लिए अपना ईमेल देखें। आपका खाता मुफ़्त योजना से शुरू होगा।"}
};


Object.assign(authText.pt,{loginButton:"Entrar",registerButton:"Criar conta grátis",sendLink:"Enviar link",savePassword:"Salvar senha",wait:"Aguarde…",switchToRegister:"Criar conta grátis",switchToLogin:"Voltar ao login",forgotPassword:"Esqueci minha senha",preview:"Explorar prévia sem cadastro",termsTitle:"Termos e privacidade"});
Object.assign(authText.en,{loginButton:"Sign in",registerButton:"Create free account",sendLink:"Send link",savePassword:"Save password",wait:"Please wait…",switchToRegister:"Create free account",switchToLogin:"Back to sign in",forgotPassword:"Forgot my password",preview:"Explore preview without signing up",termsTitle:"Terms and privacy"});
Object.assign(authText.fr,{loginButton:"Se connecter",registerButton:"Créer un compte gratuit",sendLink:"Envoyer le lien",savePassword:"Enregistrer le mot de passe",wait:"Veuillez patienter…",switchToRegister:"Créer un compte gratuit",switchToLogin:"Retour à la connexion",forgotPassword:"Mot de passe oublié",preview:"Explorer sans inscription",termsTitle:"Conditions et confidentialité"});
Object.assign(authText.es,{loginButton:"Iniciar sesión",registerButton:"Crear cuenta gratis",sendLink:"Enviar enlace",savePassword:"Guardar contraseña",wait:"Espera…",switchToRegister:"Crear cuenta gratis",switchToLogin:"Volver al inicio de sesión",forgotPassword:"Olvidé mi contraseña",preview:"Explorar vista previa sin registrarse",termsTitle:"Términos y privacidad"});
Object.assign(authText.zh,{loginButton:"登录",registerButton:"创建免费账户",sendLink:"发送链接",savePassword:"保存密码",wait:"请稍候…",switchToRegister:"创建免费账户",switchToLogin:"返回登录",forgotPassword:"忘记密码",preview:"免注册体验预览",termsTitle:"条款与隐私"});
Object.assign(authText.hi,{loginButton:"साइन इन करें",registerButton:"मुफ़्त खाता बनाएँ",sendLink:"लिंक भेजें",savePassword:"पासवर्ड सहेजें",wait:"कृपया प्रतीक्षा करें…",switchToRegister:"मुफ़्त खाता बनाएँ",switchToLogin:"साइन इन पर वापस जाएँ",forgotPassword:"पासवर्ड भूल गए",preview:"बिना पंजीकरण पूर्वावलोकन देखें",termsTitle:"शर्तें और गोपनीयता"});

export const onboardingText = {
  pt:{header:"Vamos preparar o seu plano",intro:"Uma pergunta por vez. Pode voltar, alterar respostas e deixar os campos opcionais em branco.",basics:"Seus dados básicos",basicsDesc:"Precisamos deles para calcular estimativas ajustadas à sua idade e medidas.",birth:"Data de nascimento",sex:"Sexo para estimativa energética",preferNot:"Prefiro não informar",female:"Feminino",male:"Masculino",weight:"Peso (kg)",height:"Altura (cm)",ageCalculated:"Idade calculada automaticamente",goal:"O que quer alcançar?",goalDesc:"Escolha seu objetivo e a modalidade que prefere praticar.",mainGoal:"Objetivo principal",lose:"Emagrecimento",loseDesc:"Redução gradual de peso e hábitos sustentáveis.",gain:"Ganho de massa",gainDesc:"Aumentar força e massa muscular gradualmente.",cut:"Cutting / definição",cutDesc:"Preservar força e reduzir gordura corporal.",conditioning:"Condicionamento",conditioningDesc:"Melhorar resistência, mobilidade e energia.",maintenance:"Manutenção",maintenanceDesc:"Manter consistência e melhorar a capacidade física.",modality:"Modalidade",bodybuilding:"Musculação",calisthenics:"Calistenia",routine:"Sua rotina de treino",routineDesc:"Vamos adaptar o plano ao lugar, aos dias e ao tempo que você tem.",where:"Onde vai treinar?",gym:"Academia",home:"Em casa",equipment:"Com equipamentos",experience:"Experiência",beginner:"Estou começando",intermediate:"Já treino",advanced:"Avançada",days:"Dias por semana",duration:"Duração (minutos)",time:"Horário habitual",activity:"Atividade diária",sedentary:"Pouco ativo",light:"Leve",moderate:"Moderada",active:"Muito ativo",veryActive:"Extremamente ativo",intensity:"Intensidade preferida",easy:"Leve",hard:"Alta",nutrition:"Sua alimentação",nutritionDesc:"Conte-nos sobre alergias, orçamento e preferência de cozinha.",budget:"Orçamento alimentar",economical:"Económico",flexible:"Flexível",allergies:"Alergias ou intolerâncias",avoid:"Alimentos que prefere evitar",cuisine:"Que tipo de cozinha prefere?",mozambican:"Cozinha moçambicana",mozambicanDesc:"Xima, matapa, caril, feijão e pratos tradicionais.",international:"Cozinha internacional",internationalDesc:"Pratos simples e conhecidos de diferentes países.",mixed:"Misturar as duas cozinhas",mixedDesc:"Alternar pratos moçambicanos e internacionais.",foods:"Alimentos do seu dia a dia",foodsDesc:"Opcional: marque o que costuma encontrar para personalizar as refeições.",available:"O que costuma ter em casa?",preferences:"Pratos ou preferências (opcional)",optional:"Opcional",blank:"Pode deixar tudo em branco. O plano pode ser alterado no Perfil.",photos:"Fotos para acompanhar sua evolução",photosDesc:"Adicione suas fotos iniciais antes de começar os 30 dias. Ambas são opcionais.",profilePhoto:"Foto de perfil",bodyPhoto:"Foto do físico · Dia 0",day30:"Foto do físico · Dia 30",addPhoto:"Adicionar foto",upload:"Fazer upload",locked:"Disponível após concluir os 30 dias",photosProgress:"As fotos iniciais aparecerão na área Progresso.",photoPrivacy:"A foto do físico fica privada. A foto de perfil pode aparecer na comunidade.",skip:"Pular por agora",step:"Passo",of:"de",back:"Voltar",continue:"Continuar",create:"Criar o meu plano",saving:"A guardar…",ageError:"Informe uma data de nascimento válida.",weightError:"Informe um peso entre 25 e 300 kg.",heightError:"Informe uma altura entre 120 e 230 cm.",goalError:"Escolha um objetivo e uma modalidade.",daysError:"Escolha entre 2 e 6 dias por semana.",durationError:"Escolha uma duração entre 10 e 180 minutos.",saveError:"Não foi possível guardar os dados. Verifique a ligação e tente novamente."},
  en:{header:"Let's prepare your plan",intro:"One question at a time. You can go back, change answers, and leave optional fields blank.",basics:"Your basic details",basicsDesc:"We use these details to estimate needs based on your age and measurements.",birth:"Date of birth",sex:"Sex used for the energy estimate",preferNot:"Prefer not to say",female:"Female",male:"Male",weight:"Weight (kg)",height:"Height (cm)",ageCalculated:"Age calculated automatically",goal:"What do you want to achieve?",goalDesc:"Choose your main goal and preferred training mode.",mainGoal:"Main goal",lose:"Fat loss",loseDesc:"Gradual weight loss and sustainable habits.",gain:"Muscle gain",gainDesc:"Build strength and muscle gradually.",cut:"Cutting / definition",cutDesc:"Preserve strength while reducing body fat.",conditioning:"Conditioning",conditioningDesc:"Improve endurance, mobility, and energy.",maintenance:"Maintenance",maintenanceDesc:"Maintain consistency and improve fitness.",modality:"Training mode",bodybuilding:"Strength training",calisthenics:"Calisthenics",routine:"Your training routine",routineDesc:"We will adapt the plan to your location, schedule, and available time.",where:"Where will you train?",gym:"Gym",home:"At home",equipment:"With equipment",experience:"Experience",beginner:"I'm starting",intermediate:"I already train",advanced:"Advanced",days:"Days per week",duration:"Duration (minutes)",time:"Usual time",activity:"Daily activity",sedentary:"Sedentary",light:"Light",moderate:"Moderate",active:"Very active",veryActive:"Extremely active",intensity:"Preferred intensity",easy:"Light",hard:"High",nutrition:"Your food preferences",nutritionDesc:"Tell us about allergies, budget, and preferred cuisine.",budget:"Food budget",economical:"Budget-friendly",flexible:"Flexible",allergies:"Allergies or intolerances",avoid:"Foods you prefer to avoid",cuisine:"Which cuisine do you prefer?",mozambican:"Mozambican cuisine",mozambicanDesc:"Xima, matapa, curries, beans, and traditional dishes.",international:"International cuisine",internationalDesc:"Simple, familiar meals from different countries.",mixed:"A mix of both cuisines",mixedDesc:"Alternate Mozambican and international meals.",foods:"Everyday foods",foodsDesc:"Optional: select foods you usually have available.",available:"What do you usually have at home?",preferences:"Dishes or preferences (optional)",optional:"Optional",blank:"You can leave these blank. You can change the plan in Profile.",photos:"Photos to track your progress",photosDesc:"Add your starting photos before the 30-day plan begins. Both are optional.",profilePhoto:"Profile photo",bodyPhoto:"Physique photo · Day 0",day30:"Physique photo · Day 30",addPhoto:"Add photo",upload:"Upload",locked:"Available after completing the 30 days",photosProgress:"Your starting photos will appear in Progress.",photoPrivacy:"Your physique photo stays private. Your profile photo may appear in the community.",skip:"Skip for now",step:"Step",of:"of",back:"Back",continue:"Continue",create:"Create my plan",saving:"Saving…",ageError:"Enter a valid date of birth.",weightError:"Enter a weight between 25 and 300 kg.",heightError:"Enter a height between 120 and 230 cm.",goalError:"Choose a goal and training mode.",daysError:"Choose between 2 and 6 days per week.",durationError:"Choose a duration between 10 and 180 minutes.",saveError:"We couldn't save your details. Check your connection and try again."},
  fr:{header:"Préparons votre programme",intro:"Une question à la fois. Vous pouvez revenir, modifier vos réponses et laisser les champs facultatifs vides.",basics:"Vos informations de base",basicsDesc:"Elles servent à estimer vos besoins selon votre âge et vos mesures.",birth:"Date de naissance",sex:"Sexe utilisé pour l’estimation énergétique",preferNot:"Je préfère ne pas répondre",female:"Femme",male:"Homme",weight:"Poids (kg)",height:"Taille (cm)",ageCalculated:"Âge calculé automatiquement",goal:"Quel est votre objectif ?",goalDesc:"Choisissez votre objectif principal et votre mode d’entraînement.",mainGoal:"Objectif principal",lose:"Perte de graisse",loseDesc:"Perte de poids progressive et habitudes durables.",gain:"Prise de muscle",gainDesc:"Développer progressivement la force et la masse musculaire.",cut:"Sèche / définition",cutDesc:"Préserver la force tout en réduisant la masse grasse.",conditioning:"Condition physique",conditioningDesc:"Améliorer l’endurance, la mobilité et l’énergie.",maintenance:"Maintien",maintenanceDesc:"Garder une routine régulière et améliorer la forme.",modality:"Mode d’entraînement",bodybuilding:"Musculation",calisthenics:"Callisthénie",routine:"Votre routine d’entraînement",routineDesc:"Nous adapterons le programme au lieu, aux jours et au temps disponible.",where:"Où allez-vous vous entraîner ?",gym:"Salle de sport",home:"À la maison",equipment:"Avec équipement",experience:"Expérience",beginner:"Je débute",intermediate:"Je m’entraîne déjà",advanced:"Avancé",days:"Jours par semaine",duration:"Durée (minutes)",time:"Horaire habituel",activity:"Activité quotidienne",sedentary:"Sédentaire",light:"Légère",moderate:"Modérée",active:"Très active",veryActive:"Extrêmement active",intensity:"Intensité préférée",easy:"Légère",hard:"Élevée",nutrition:"Votre alimentation",nutritionDesc:"Indiquez les allergies, le budget et la cuisine préférée.",budget:"Budget alimentaire",economical:"Économique",flexible:"Flexible",allergies:"Allergies ou intolérances",avoid:"Aliments à éviter",cuisine:"Quelle cuisine préférez-vous ?",mozambican:"Cuisine mozambicaine",mozambicanDesc:"Xima, matapa, currys, haricots et plats traditionnels.",international:"Cuisine internationale",internationalDesc:"Des repas simples et connus de différents pays.",mixed:"Mélanger les deux cuisines",mixedDesc:"Alterner les plats mozambicains et internationaux.",foods:"Aliments du quotidien",foodsDesc:"Facultatif : sélectionnez les aliments que vous avez souvent.",available:"Que trouvez-vous habituellement chez vous ?",preferences:"Plats ou préférences (facultatif)",optional:"Facultatif",blank:"Vous pouvez laisser ces champs vides et modifier le programme dans Profil.",photos:"Photos pour suivre votre évolution",photosDesc:"Ajoutez vos photos de départ avant les 30 jours. Les deux sont facultatives.",profilePhoto:"Photo de profil",bodyPhoto:"Photo du physique · Jour 0",day30:"Photo du physique · Jour 30",addPhoto:"Ajouter une photo",upload:"Importer",locked:"Disponible après les 30 jours",photosProgress:"Vos photos de départ apparaîtront dans Progression.",photoPrivacy:"La photo du physique reste privée. La photo de profil peut apparaître dans la communauté.",skip:"Ignorer pour le moment",step:"Étape",of:"sur",back:"Retour",continue:"Continuer",create:"Créer mon programme",saving:"Enregistrement…",ageError:"Saisissez une date de naissance valide.",weightError:"Saisissez un poids entre 25 et 300 kg.",heightError:"Saisissez une taille entre 120 et 230 cm.",goalError:"Choisissez un objectif et un mode d’entraînement.",daysError:"Choisissez entre 2 et 6 jours par semaine.",durationError:"Choisissez une durée entre 10 et 180 minutes.",saveError:"Impossible d’enregistrer. Vérifiez votre connexion et réessayez."},
  es:{header:"Preparemos tu plan",intro:"Una pregunta a la vez. Puedes volver, cambiar respuestas y dejar vacíos los campos opcionales.",basics:"Tus datos básicos",basicsDesc:"Los usamos para estimar tus necesidades según tu edad y medidas.",birth:"Fecha de nacimiento",sex:"Sexo usado para estimar la energía",preferNot:"Prefiero no decirlo",female:"Femenino",male:"Masculino",weight:"Peso (kg)",height:"Altura (cm)",ageCalculated:"Edad calculada automáticamente",goal:"¿Qué quieres conseguir?",goalDesc:"Elige tu objetivo principal y tu modalidad de entrenamiento.",mainGoal:"Objetivo principal",lose:"Perder grasa",loseDesc:"Pérdida gradual de peso y hábitos sostenibles.",gain:"Ganar masa muscular",gainDesc:"Aumentar fuerza y músculo gradualmente.",cut:"Cutting / definición",cutDesc:"Conservar la fuerza mientras reduces grasa corporal.",conditioning:"Acondicionamiento",conditioningDesc:"Mejorar resistencia, movilidad y energía.",maintenance:"Mantenimiento",maintenanceDesc:"Mantener la constancia y mejorar la condición física.",modality:"Modalidad",bodybuilding:"Musculación",calisthenics:"Calistenia",routine:"Tu rutina de entrenamiento",routineDesc:"Adaptaremos el plan al lugar, los días y el tiempo disponible.",where:"¿Dónde vas a entrenar?",gym:"Gimnasio",home:"En casa",equipment:"Con equipo",experience:"Experiencia",beginner:"Estoy empezando",intermediate:"Ya entreno",advanced:"Avanzado",days:"Días por semana",duration:"Duración (minutos)",time:"Horario habitual",activity:"Actividad diaria",sedentary:"Sedentaria",light:"Ligera",moderate:"Moderada",active:"Muy activa",veryActive:"Extremadamente activa",intensity:"Intensidad preferida",easy:"Ligera",hard:"Alta",nutrition:"Tu alimentación",nutritionDesc:"Cuéntanos sobre alergias, presupuesto y cocina preferida.",budget:"Presupuesto de comida",economical:"Económico",flexible:"Flexible",allergies:"Alergias o intolerancias",avoid:"Alimentos que prefieres evitar",cuisine:"¿Qué tipo de cocina prefieres?",mozambican:"Cocina mozambiqueña",mozambicanDesc:"Xima, matapa, curris, frijoles y platos tradicionales.",international:"Cocina internacional",internationalDesc:"Comidas sencillas y conocidas de distintos países.",mixed:"Mezclar ambas cocinas",mixedDesc:"Alternar platos mozambiqueños e internacionales.",foods:"Alimentos de tu día a día",foodsDesc:"Opcional: marca los alimentos que sueles tener disponibles.",available:"¿Qué sueles tener en casa?",preferences:"Platos o preferencias (opcional)",optional:"Opcional",blank:"Puedes dejarlo en blanco y cambiar el plan en Perfil.",photos:"Fotos para seguir tu progreso",photosDesc:"Añade tus fotos iniciales antes de comenzar los 30 días. Ambas son opcionales.",profilePhoto:"Foto de perfil",bodyPhoto:"Foto del físico · Día 0",day30:"Foto del físico · Día 30",addPhoto:"Añadir foto",upload:"Subir",locked:"Disponible al completar los 30 días",photosProgress:"Tus fotos iniciales aparecerán en Progreso.",photoPrivacy:"La foto del físico es privada. La foto de perfil puede aparecer en la comunidad.",skip:"Omitir por ahora",step:"Paso",of:"de",back:"Volver",continue:"Continuar",create:"Crear mi plan",saving:"Guardando…",ageError:"Introduce una fecha de nacimiento válida.",weightError:"Introduce un peso entre 25 y 300 kg.",heightError:"Introduce una altura entre 120 y 230 cm.",goalError:"Elige un objetivo y una modalidad.",daysError:"Elige entre 2 y 6 días por semana.",durationError:"Elige una duración entre 10 y 180 minutos.",saveError:"No se pudieron guardar los datos. Comprueba la conexión e inténtalo de nuevo."},
  zh:{header:"为你制定训练计划",intro:"一次回答一个问题。你可以返回修改答案，选填项目也可以留空。",basics:"基本信息",basicsDesc:"这些信息用于根据年龄和身体数据估算需求。",birth:"出生日期",sex:"用于能量估算的性别",preferNot:"不愿透露",female:"女性",male:"男性",weight:"体重（kg）",height:"身高（cm）",ageCalculated:"年龄已自动计算",goal:"你的目标是什么？",goalDesc:"选择主要目标和训练方式。",mainGoal:"主要目标",lose:"减脂",loseDesc:"循序渐进地减重并建立可持续习惯。",gain:"增加肌肉",gainDesc:"逐步提高力量和肌肉量。",cut:"减脂塑形",cutDesc:"减少体脂，同时尽量保持力量。",conditioning:"体能提升",conditioningDesc:"提高耐力、灵活性和精力。",maintenance:"维持体重",maintenanceDesc:"保持规律并改善体能。",modality:"训练方式",bodybuilding:"力量训练",calisthenics:"徒手健身",routine:"训练安排",routineDesc:"根据训练地点、每周天数和可用时间调整计划。",where:"你在哪里训练？",gym:"健身房",home:"在家",equipment:"使用器械",experience:"训练经验",beginner:"刚开始",intermediate:"已经训练",advanced:"进阶",days:"每周训练天数",duration:"时长（分钟）",time:"通常训练时间",activity:"日常活动量",sedentary:"久坐",light:"轻度",moderate:"中等",active:"高",veryActive:"非常高",intensity:"偏好的强度",easy:"轻度",hard:"高强度",nutrition:"饮食偏好",nutritionDesc:"请填写过敏情况、预算和偏好的菜系。",budget:"饮食预算",economical:"经济",flexible:"灵活",allergies:"过敏或不耐受",avoid:"希望避免的食物",cuisine:"你偏好哪种菜系？",mozambican:"莫桑比克菜",mozambicanDesc:"Xima、Matapa、咖喱、豆类和传统菜肴。",international:"国际菜系",internationalDesc:"来自不同国家、简单易做的常见餐食。",mixed:"混合两种菜系",mixedDesc:"交替安排莫桑比克和国际菜肴。",foods:"日常食材",foodsDesc:"选填：勾选你通常能买到的食材。",available:"你家里通常有哪些食材？",preferences:"菜肴或偏好（选填）",optional:"选填",blank:"可以留空，之后也能在个人资料中修改计划。",photos:"记录进度的照片",photosDesc:"在30天计划开始前添加起始照片。两张照片均为选填。",profilePhoto:"头像",bodyPhoto:"身体照片 · 第0天",day30:"身体照片 · 第30天",addPhoto:"添加照片",upload:"上传",locked:"完成30天后开放",photosProgress:"起始照片会显示在进度页面。",photoPrivacy:"身体照片保持私密。头像可能显示在社区中。",skip:"暂时跳过",step:"步骤",of:"共",back:"返回",continue:"继续",create:"创建我的计划",saving:"正在保存…",ageError:"请输入有效的出生日期。",weightError:"请输入25至300公斤之间的体重。",heightError:"请输入120至230厘米之间的身高。",goalError:"请选择目标和训练方式。",daysError:"请选择每周2至6天。",durationError:"请选择10至180分钟的时长。",saveError:"保存失败。请检查网络连接后重试。"},
  hi:{header:"आपकी योजना तैयार करें",intro:"एक बार में एक प्रश्न। आप वापस जाकर उत्तर बदल सकते हैं और वैकल्पिक जानकारी खाली छोड़ सकते हैं।",basics:"आपकी बुनियादी जानकारी",basicsDesc:"इनसे उम्र और शरीर के माप के अनुसार अनुमान तैयार किए जाते हैं।",birth:"जन्म तिथि",sex:"ऊर्जा अनुमान के लिए लिंग",preferNot:"बताना नहीं चाहते",female:"महिला",male:"पुरुष",weight:"वज़न (kg)",height:"लंबाई (cm)",ageCalculated:"उम्र अपने आप गणना की गई",goal:"आपका लक्ष्य क्या है?",goalDesc:"मुख्य लक्ष्य और पसंदीदा प्रशिक्षण तरीका चुनें।",mainGoal:"मुख्य लक्ष्य",lose:"वसा घटाना",loseDesc:"धीरे-धीरे वज़न घटाना और टिकाऊ आदतें बनाना।",gain:"मांसपेशियाँ बढ़ाना",gainDesc:"धीरे-धीरे ताकत और मांसपेशियाँ बढ़ाना।",cut:"कटिंग / परिभाषा",cutDesc:"शरीर की चर्बी घटाते हुए ताकत बनाए रखना।",conditioning:"फिटनेस",conditioningDesc:"सहनशक्ति, गतिशीलता और ऊर्जा बेहतर करना।",maintenance:"वज़न बनाए रखना",maintenanceDesc:"नियमितता बनाए रखना और फिटनेस सुधारना।",modality:"प्रशिक्षण तरीका",bodybuilding:"वेट ट्रेनिंग",calisthenics:"कैलिस्थेनिक्स",routine:"आपकी प्रशिक्षण दिनचर्या",routineDesc:"योजना स्थान, दिनों और उपलब्ध समय के अनुसार बनेगी।",where:"आप कहाँ प्रशिक्षण करेंगे?",gym:"जिम",home:"घर पर",equipment:"उपकरण के साथ",experience:"अनुभव",beginner:"मैं शुरू कर रहा/रही हूँ",intermediate:"मैं पहले से प्रशिक्षण करता/करती हूँ",advanced:"उन्नत",days:"प्रति सप्ताह दिन",duration:"अवधि (मिनट)",time:"सामान्य समय",activity:"दैनिक गतिविधि",sedentary:"कम सक्रिय",light:"हल्की",moderate:"मध्यम",active:"बहुत सक्रिय",veryActive:"अत्यधिक सक्रिय",intensity:"पसंदीदा तीव्रता",easy:"हल्की",hard:"उच्च",nutrition:"आपका भोजन",nutritionDesc:"एलर्जी, बजट और पसंदीदा भोजन शैली बताएँ।",budget:"भोजन बजट",economical:"कम बजट",flexible:"लचीला",allergies:"एलर्जी या असहिष्णुता",avoid:"जिन खाद्य पदार्थों से बचना चाहते हैं",cuisine:"आप किस प्रकार का भोजन पसंद करते हैं?",mozambican:"मोज़ाम्बिक का भोजन",mozambicanDesc:"Xima, Matapa, करी, बीन्स और पारंपरिक व्यंजन।",international:"अंतरराष्ट्रीय भोजन",internationalDesc:"अलग-अलग देशों के सरल और आम भोजन।",mixed:"दोनों का मिश्रण",mixedDesc:"मोज़ाम्बिक और अंतरराष्ट्रीय व्यंजनों को बारी-बारी शामिल करें।",foods:"रोज़मर्रा के खाद्य पदार्थ",foodsDesc:"वैकल्पिक: वे खाद्य पदार्थ चुनें जो आमतौर पर उपलब्ध होते हैं।",available:"आपके घर में आमतौर पर क्या उपलब्ध है?",preferences:"व्यंजन या पसंद (वैकल्पिक)",optional:"वैकल्पिक",blank:"इसे खाली छोड़ सकते हैं और बाद में प्रोफ़ाइल में योजना बदल सकते हैं।",photos:"प्रगति के लिए तस्वीरें",photosDesc:"30-दिन की योजना शुरू होने से पहले शुरुआती तस्वीरें जोड़ें। दोनों वैकल्पिक हैं।",profilePhoto:"प्रोफ़ाइल फ़ोटो",bodyPhoto:"शरीर की फ़ोटो · दिन 0",day30:"शरीर की फ़ोटो · दिन 30",addPhoto:"फ़ोटो जोड़ें",upload:"अपलोड करें",locked:"30 दिन पूरे होने के बाद उपलब्ध",photosProgress:"शुरुआती तस्वीरें प्रगति अनुभाग में दिखेंगी।",photoPrivacy:"शरीर की तस्वीर निजी रहती है। प्रोफ़ाइल फ़ोटो समुदाय में दिखाई दे सकती है।",skip:"अभी छोड़ें",step:"चरण",of:"में से",back:"वापस",continue:"जारी रखें",create:"मेरी योजना बनाएँ",saving:"सहेजा जा रहा है…",ageError:"मान्य जन्म तिथि दर्ज करें।",weightError:"25 से 300 किलोग्राम के बीच वज़न दर्ज करें।",heightError:"120 से 230 सेंटीमीटर के बीच लंबाई दर्ज करें।",goalError:"लक्ष्य और प्रशिक्षण तरीका चुनें।",daysError:"प्रति सप्ताह 2 से 6 दिन चुनें।",durationError:"10 से 180 मिनट की अवधि चुनें।",saveError:"जानकारी सहेजी नहीं जा सकी। कनेक्शन जाँचकर फिर प्रयास करें।"}
};

export function getLanguage() { return localStorage.getItem("jl-language") || "pt"; }
export function setLanguage(value) {
  const supported = languageOptions.some(([code]) => code === value) ? value : "pt";
  localStorage.setItem("jl-language", supported);
  window.dispatchEvent(new CustomEvent("jl-language-change", { detail: supported }));
}
export function useLanguage() {
  const [language, setCurrent] = useState(() => getLanguage());
  useEffect(() => {
    const onChange = (event) => setCurrent(event.detail || getLanguage());
    window.addEventListener("jl-language-change", onChange);
    return () => window.removeEventListener("jl-language-change", onChange);
  }, []);
  return [language, setLanguage, uiText[language] || uiText.pt];
}

Object.assign(onboardingText.pt,{targetWeight:"Peso objetivo (opcional)"});
Object.assign(onboardingText.en,{targetWeight:"Target weight (optional)"});
Object.assign(onboardingText.fr,{targetWeight:"Poids cible (facultatif)"});
Object.assign(onboardingText.es,{targetWeight:"Peso objetivo (opcional)"});
Object.assign(onboardingText.zh,{targetWeight:"目标体重（选填）"});
Object.assign(onboardingText.hi,{targetWeight:"लक्ष्य वज़न (वैकल्पिक)"});

const commonTranslations = {
  "SUA JORNADA EM NÚMEROS":{en:"YOUR JOURNEY IN NUMBERS",fr:"VOTRE PARCOURS EN CHIFFRES",es:"TU CAMINO EN CIFRAS",zh:"你的进度数据",hi:"आपकी प्रगति के आँकड़े"},
  "Minha evolução":{en:"My progress",fr:"Ma progression",es:"Mi progreso",zh:"我的进度",hi:"मेरी प्रगति"},
  "SEUS DADOS":{en:"YOUR DETAILS",fr:"VOS INFORMATIONS",es:"TUS DATOS",zh:"你的资料",hi:"आपकी जानकारी"},
  "Meu perfil":{en:"My profile",fr:"Mon profil",es:"Mi perfil",zh:"个人资料",hi:"मेरी प्रोफ़ाइल"},
  "CONSISTÊNCIA EM COMUNIDADE":{en:"CONSISTENCY IN COMMUNITY",fr:"LA RÉGULARITÉ EN COMMUNAUTÉ",es:"CONSTANCIA EN COMUNIDAD",zh:"社区中的坚持",hi:"समुदाय में निरंतरता"},
  "Desafios de hoje":{en:"Today's challenges",fr:"Défis du jour",es:"Desafíos de hoy",zh:"今日挑战",hi:"आज की चुनौतियाँ"},
  "INVISTA EM CONSISTÊNCIA":{en:"INVEST IN CONSISTENCY",fr:"MISER SUR LA RÉGULARITÉ",es:"INVIERTE EN CONSTANCIA",zh:"坚持就是投资",hi:"निरंतरता में निवेश करें"},
  "Seu próximo nível":{en:"Your next level",fr:"Votre prochain niveau",es:"Tu siguiente nivel",zh:"你的下一阶段",hi:"आपका अगला स्तर"},
  "APRENDA A CADA TREINO":{en:"LEARN WITH EVERY WORKOUT",fr:"APPRENDRE À CHAQUE SÉANCE",es:"APRENDE EN CADA ENTRENO",zh:"每次训练都学习",hi:"हर वर्कआउट से सीखें"},
  "Conteúdos":{en:"Content",fr:"Contenus",es:"Contenido",zh:"内容",hi:"सामग्री"},
  "ORGANIZE SUA ROTINA":{en:"ORGANIZE YOUR ROUTINE",fr:"ORGANISEZ VOTRE ROUTINE",es:"ORGANIZA TU RUTINA",zh:"安排你的日程",hi:"अपनी दिनचर्या व्यवस्थित करें"},
  "Agenda e mentorias":{en:"Calendar and coaching",fr:"Agenda et accompagnement",es:"Agenda y mentorías",zh:"日程与指导",hi:"कैलेंडर और कोचिंग"},
  "SEU PARCEIRO DE ROTINA":{en:"YOUR DAILY PARTNER",fr:"VOTRE PARTENAIRE QUOTIDIEN",es:"TU COMPAÑERO DIARIO",zh:"你的日常伙伴",hi:"आपका दैनिक साथी"},
  "Assistente JL":{en:"JL Assistant",fr:"Assistant JL",es:"Asistente JL",zh:"JL 助手",hi:"JL सहायक"},
  "LEO • ASSISTENTE GUIADO":{en:"LEO • GUIDED ASSISTANT",fr:"LEO • ASSISTANT GUIDÉ",es:"LEO • ASISTENTE GUIADO",zh:"LEO • 指导助手",hi:"LEO • मार्गदर्शक सहायक"},
  "Vamos conversar":{en:"Let's talk",fr:"Parlons",es:"Hablemos",zh:"开始对话",hi:"बात करें"},
  "Data":{en:"Date",fr:"Date",es:"Fecha",zh:"日期",hi:"तारीख"},
  "Peso (kg)":{en:"Weight (kg)",fr:"Poids (kg)",es:"Peso (kg)",zh:"体重（kg）",hi:"वज़न (kg)"},
  "Nome completo":{en:"Full name",fr:"Nom complet",es:"Nombre completo",zh:"姓名",hi:"पूरा नाम"},
  "Telefone":{en:"Phone",fr:"Téléphone",es:"Teléfono",zh:"电话",hi:"फ़ोन"},
  "Altura (cm)":{en:"Height (cm)",fr:"Taille (cm)",es:"Altura (cm)",zh:"身高（cm）",hi:"लंबाई (cm)"},
  "Peso atual (kg)":{en:"Current weight (kg)",fr:"Poids actuel (kg)",es:"Peso actual (kg)",zh:"当前体重（kg）",hi:"वर्तमान वज़न (kg)"},
  "Cidade":{en:"City",fr:"Ville",es:"Ciudad",zh:"城市",hi:"शहर"},
  "Horário do treino":{en:"Workout time",fr:"Heure d’entraînement",es:"Horario de entrenamiento",zh:"训练时间",hi:"वर्कआउट का समय"},
  "Data de nascimento":{en:"Date of birth",fr:"Date de naissance",es:"Fecha de nacimiento",zh:"出生日期",hi:"जन्म तिथि"},
  "Peso inicial (kg)":{en:"Starting weight (kg)",fr:"Poids initial (kg)",es:"Peso inicial (kg)",zh:"初始体重（kg）",hi:"शुरुआती वज़न (kg)"},
  "Duração do treino (min)":{en:"Workout duration (min)",fr:"Durée de l’entraînement (min)",es:"Duración del entrenamiento (min)",zh:"训练时长（分钟）",hi:"वर्कआउट अवधि (मिनट)"},
  "Frequência de treino (dias/semana)":{en:"Training frequency (days/week)",fr:"Fréquence d’entraînement (jours/semaine)",es:"Frecuencia de entrenamiento (días/semana)",zh:"训练频率（天/周）",hi:"प्रशिक्षण आवृत्ति (दिन/सप्ताह)"},
  "Pessoas para quem preparar o plano":{en:"People included in the meal plan",fr:"Personnes concernées par le programme alimentaire",es:"Personas incluidas en el plan de comidas",zh:"饮食计划适用人数",hi:"भोजन योजना में शामिल लोग"},
  "Alergias ou intolerâncias":{en:"Allergies or intolerances",fr:"Allergies ou intolérances",es:"Alergias o intolerancias",zh:"过敏或不耐受",hi:"एलर्जी या असहिष्णुता"},
  "Alimentos e pratos disponíveis":{en:"Available foods and dishes",fr:"Aliments et plats disponibles",es:"Alimentos y platos disponibles",zh:"可用食材和菜肴",hi:"उपलब्ध खाद्य पदार्थ और व्यंजन"},
  "Alimentos que não consome":{en:"Foods you avoid",fr:"Aliments que vous évitez",es:"Alimentos que evitas",zh:"避免食用的食物",hi:"जिन खाद्य पदार्थों से बचते हैं"},
  "Referência do pagamento":{en:"Payment reference",fr:"Référence de paiement",es:"Referencia de pago",zh:"付款参考号",hi:"भुगतान संदर्भ"},
  "Peso atual":{en:"Current weight",fr:"Poids actuel",es:"Peso actual",zh:"当前体重",hi:"वर्तमान वज़न"},
  "Treinos registados":{en:"Workouts logged",fr:"Entraînements enregistrés",es:"Entrenamientos registrados",zh:"已记录训练",hi:"दर्ज किए गए वर्कआउट"},
  "Treinos perdidos":{en:"Missed workouts",fr:"Entraînements manqués",es:"Entrenamientos perdidos",zh:"错过的训练",hi:"छूटे हुए वर्कआउट"},
  "Dias de alimentação perdidos":{en:"Missed nutrition days",fr:"Jours alimentaires manqués",es:"Días de alimentación perdidos",zh:"饮食记录缺失天数",hi:"छूटे हुए भोजन दिवस"},
  "Sequência":{en:"Streak",fr:"Série",es:"Racha",zh:"连续记录",hi:"लगातार दिन"},
  "Variação":{en:"Change",fr:"Variation",es:"Cambio",zh:"变化",hi:"बदलाव"},
  "Salvar perfil":{en:"Save profile",fr:"Enregistrer le profil",es:"Guardar perfil",zh:"保存资料",hi:"प्रोफ़ाइल सहेजें"},
  "Idioma do aplicativo":{en:"App language",fr:"Langue de l’application",es:"Idioma de la aplicación",zh:"应用语言",hi:"ऐप की भाषा"},
  "Tema do aplicativo":{en:"App theme",fr:"Thème de l’application",es:"Tema de la aplicación",zh:"应用主题",hi:"ऐप थीम"},
  "Preferência de cozinha":{en:"Cuisine preference",fr:"Cuisine préférée",es:"Preferencia de cocina",zh:"菜系偏好",hi:"भोजन शैली की पसंद"},
  "Cozinha moçambicana":{en:"Mozambican cuisine",fr:"Cuisine mozambicaine",es:"Cocina mozambiqueña",zh:"莫桑比克菜",hi:"मोज़ाम्बिक का भोजन"},
  "Cozinha internacional":{en:"International cuisine",fr:"Cuisine internationale",es:"Cocina internacional",zh:"国际菜系",hi:"अंतरराष्ट्रीय भोजन"},
  "Misturar as duas":{en:"Mix both",fr:"Mélanger les deux",es:"Mezclar ambas",zh:"混合两种菜系",hi:"दोनों का मिश्रण"},
  "Foto de perfil":{en:"Profile photo",fr:"Photo de profil",es:"Foto de perfil",zh:"头像",hi:"प्रोफ़ाइल फ़ोटो"},
  "Salvar":{en:"Save",fr:"Enregistrer",es:"Guardar",zh:"保存",hi:"सहेजें"},
  "Cancelar":{en:"Cancel",fr:"Annuler",es:"Cancelar",zh:"取消",hi:"रद्द करें"},
  "Continuar":{en:"Continue",fr:"Continuer",es:"Continuar",zh:"继续",hi:"जारी रखें"},
  "Voltar":{en:"Back",fr:"Retour",es:"Volver",zh:"返回",hi:"वापस"},
  "Ver planos":{en:"View plans",fr:"Voir les forfaits",es:"Ver planes",zh:"查看计划",hi:"योजनाएँ देखें"},
  "Complete idade/data de nascimento, peso e altura no Perfil para personalizar este plano.":{en:"Add your age/date of birth, weight and height in Profile to personalize this plan.",fr:"Ajoutez votre âge/date de naissance, votre poids et votre taille dans Profil pour personnaliser ce programme.",es:"Añade tu edad/fecha de nacimiento, peso y altura en Perfil para personalizar este plan.",zh:"请在个人资料中填写年龄/出生日期、体重和身高，以个性化此计划。",hi:"इस योजना को व्यक्तिगत बनाने के लिए प्रोफ़ाइल में उम्र/जन्म तिथि, वज़न और लंबाई जोड़ें।"},
  "Mostramos um plano recomendado provisório. Complete os seus dados no Perfil para ajustar calorias, água e porções.":{en:"This is a temporary recommended plan. Complete your Profile to adjust calories, water and portions.",fr:"Voici un programme provisoire recommandé. Complétez votre profil pour ajuster les calories, l’eau et les portions.",es:"Este es un plan provisional recomendado. Completa tu Perfil para ajustar calorías, agua y porciones.",zh:"这是临时推荐计划。请完善个人资料，以调整热量、水分和份量。",hi:"यह एक अस्थायी सुझाई गई योजना है। कैलोरी, पानी और मात्रा समायोजित करने के लिए प्रोफ़ाइल पूरी करें।"},
  "A estimativa inicial ficou abaixo de uma faixa conservadora. O aplicativo limita o défice automático e recomenda avaliação individual antes de reduzir mais as calorias.":{en:"The initial estimate fell below a conservative range. The app limits automatic calorie deficits and recommends an individual assessment before reducing calories further.",fr:"L’estimation initiale est inférieure à une plage prudente. L’application limite le déficit automatique et recommande une évaluation individuelle avant toute réduction supplémentaire.",es:"La estimación inicial quedó por debajo de un rango prudente. La aplicación limita el déficit automático y recomienda una evaluación individual antes de reducir más las calorías.",zh:"初始估算低于保守范围。应用会限制自动热量缺口，并建议在进一步减少热量前进行个体评估。",hi:"प्रारंभिक अनुमान सावधानीपूर्ण सीमा से कम है। ऐप अपने-आप कैलोरी घाटा सीमित करता है और आगे कैलोरी घटाने से पहले व्यक्तिगत मूल्यांकन की सलाह देता है।"},
  "Plano equilibrado para adolescentes, com refeições variadas e porções flexíveis para apoiar crescimento, escola, treino e recuperação. Sem metas calóricas, défice ou suplementos automáticos.":{en:"Balanced meals and flexible portions for teens to support growth, school, training and recovery. No automatic calorie targets, deficits or supplement recommendations.",fr:"Repas équilibrés et portions flexibles pour soutenir la croissance, l’école, l’entraînement et la récupération des adolescents. Aucun objectif calorique, déficit ou supplément automatique.",es:"Comidas equilibradas y porciones flexibles para apoyar el crecimiento, los estudios, el entrenamiento y la recuperación de adolescentes. Sin objetivos calóricos, déficit ni suplementos automáticos.",zh:"为青少年提供均衡餐食和灵活份量，支持成长、学习、训练和恢复。不自动设定热量目标、热量缺口或补剂建议。",hi:"किशोरों की वृद्धि, पढ़ाई, प्रशिक्षण और रिकवरी के लिए संतुलित भोजन और लचीली मात्रा। कोई स्वचालित कैलोरी लक्ष्य, घाटा या सप्लीमेंट सुझाव नहीं।"},
  "A partir dos 65 anos, a estimativa exige atenção individual. Em caso de doença renal, uso de medicação ou condição clínica, confirme metas de calorias e proteína com um profissional de saúde.":{en:"From age 65, estimates need individual review. If you have kidney disease, take medication or have a medical condition, confirm calorie and protein goals with a health professional.",fr:"À partir de 65 ans, les estimations nécessitent une évaluation individuelle. En cas de maladie rénale, de traitement ou de problème de santé, confirmez les objectifs caloriques et protéiques avec un professionnel.",es:"A partir de los 65 años, las estimaciones requieren una revisión individual. Si tienes enfermedad renal, tomas medicación o tienes una condición médica, confirma los objetivos con un profesional de salud.",zh:"65岁及以上需要个体化评估。如有肾脏疾病、正在服药或有其他健康状况，请与医疗专业人员确认热量和蛋白质目标。",hi:"65 वर्ष से अधिक उम्र में अनुमान की व्यक्तिगत समीक्षा ज़रूरी है। किडनी की बीमारी, दवा या अन्य स्वास्थ्य स्थिति होने पर कैलोरी और प्रोटीन लक्ष्य स्वास्थ्य विशेषज्ञ से तय करें।"},
  "Plano internacional com refeições simples e ingredientes comuns; as porções são ajustadas ao objetivo e à atividade.":{en:"International meal plan with simple, familiar ingredients; portions are adjusted to your goal and activity.",fr:"Programme international avec des repas simples et des ingrédients courants ; les portions sont adaptées à votre objectif et à votre activité.",es:"Plan internacional con comidas sencillas e ingredientes comunes; las porciones se ajustan a tu objetivo y actividad.",zh:"国际餐单采用简单常见食材，并根据目标和活动量调整份量。",hi:"सरल और आम सामग्री वाला अंतरराष्ट्रीय भोजन प्लान; मात्रा आपके लक्ष्य और गतिविधि के अनुसार है।"},
  "Plano com maior presença de pratos moçambicanos tradicionais, preservando opções locais.":{en:"Plan featuring more traditional Mozambican dishes while keeping local options.",fr:"Programme privilégiant les plats traditionnels mozambicains tout en conservant les options locales.",es:"Plan con más platos tradicionales mozambiqueños y opciones locales.",zh:"计划增加莫桑比克传统菜肴，同时保留本地食材选择。",hi:"इस योजना में स्थानीय विकल्प बनाए रखते हुए अधिक पारंपरिक मोज़ाम्बिक व्यंजन शामिल हैं।"},
  "Plano misto com pratos moçambicanos e internacionais, ajustados ao objetivo e à atividade.":{en:"Mixed plan with Mozambican and international dishes, adjusted to your goal and activity.",fr:"Programme mixte de plats mozambicains et internationaux, adapté à votre objectif et à votre activité.",es:"Plan mixto con platos mozambiqueños e internacionales, adaptado a tu objetivo y actividad.",zh:"混合莫桑比克和国际菜肴，并根据目标和活动量调整。",hi:"मोज़ाम्बिक और अंतरराष्ट्रीय व्यंजनों का मिश्रित प्लान, आपके लक्ष्य और गतिविधि के अनुसार।"},
  "Priorize feijão, ovos, aveia, arroz, hortaliças da época e peixe local; compare preços e use substituições.":{en:"Prioritize beans, eggs, oats, rice, seasonal vegetables and local fish; compare prices and use substitutions.",fr:"Privilégiez les haricots, les œufs, l’avoine, le riz, les légumes de saison et le poisson local ; comparez les prix et remplacez selon disponibilité.",es:"Prioriza frijoles, huevos, avena, arroz, verduras de temporada y pescado local; compara precios y usa sustituciones.",zh:"优先选择豆类、鸡蛋、燕麦、米饭、当季蔬菜和本地鱼类；比较价格并灵活替换。",hi:"बीन्स, अंडे, ओट्स, चावल, मौसमी सब्ज़ियाँ और स्थानीय मछली को प्राथमिकता दें; कीमतों की तुलना करें और विकल्प अपनाएँ。"},
  "Combine alimentos locais e internacionais conforme disponibilidade e orçamento.":{en:"Combine local and international foods according to availability and budget.",fr:"Associez des aliments locaux et internationaux selon leur disponibilité et votre budget.",es:"Combina alimentos locales e internacionales según la disponibilidad y el presupuesto.",zh:"根据供应情况和预算搭配本地与国际食材。",hi:"उपलब्धता और बजट के अनुसार स्थानीय और अंतरराष्ट्रीय खाद्य पदार्थ मिलाएँ。"},

};
const recipeNameTranslations = {
  R01:{en:"Creamy banana oatmeal",fr:"Porridge crémeux à la banane",es:"Avena cremosa con banana",zh:"香蕉奶香燕麦粥",hi:"केले वाला क्रीमी ओटमील"},
  R02:{en:"Scrambled eggs with whole-grain toast",fr:"Œufs brouillés et pain complet",es:"Huevos revueltos con pan integral",zh:"炒鸡蛋配全麦面包",hi:"होल-ग्रेन टोस्ट के साथ भुर्जी"},
  R03:{en:"Cornmeal porridge with milk and papaya",fr:"Bouillie de maïs au lait et papaye",es:"Gachas de maíz con leche y papaya",zh:"牛奶玉米粥配木瓜",hi:"दूध और पपीते के साथ मक्के का दलिया"},
  R04:{en:"Yogurt with oats and pineapple",fr:"Yaourt à l’avoine et à l’ananas",es:"Yogur con avena y piña",zh:"酸奶燕麦菠萝杯",hi:"ओट्स और अनानास के साथ दही"},
  R05:{en:"Banana and oat pancakes",fr:"Pancakes à la banane et à l’avoine",es:"Tortitas de banana y avena",zh:"香蕉燕麦煎饼",hi:"केला और ओट्स पैनकेक"},
  R06:{en:"Whole-grain bread with fresh cheese",fr:"Pain complet au fromage frais",es:"Pan integral con queso fresco",zh:"全麦面包配鲜奶酪",hi:"ताज़े चीज़ के साथ होल-ग्रेन ब्रेड"},
  R07:{en:"Sweet potato and boiled eggs",fr:"Patate douce et œufs durs",es:"Batata dulce y huevos cocidos",zh:"红薯配水煮蛋",hi:"शकरकंद और उबले अंडे"},
  R08:{en:"Plain yogurt with mango",fr:"Yaourt nature à la mangue",es:"Yogur natural con mango",zh:"原味酸奶配芒果",hi:"आम के साथ सादा दही"},
  R09:{en:"Grilled chicken, rice and salad",fr:"Poulet grillé, riz et salade",es:"Pollo a la plancha, arroz y ensalada",zh:"烤鸡肉、米饭和沙拉",hi:"ग्रिल्ड चिकन, चावल और सलाद"},
  R10:{en:"Baked horse mackerel with xima and tomato",fr:"Chinchard au four avec xima et tomate",es:"Jurel al horno con xima y tomate",zh:"烤竹荚鱼配西马和番茄",hi:"ज़िमा और टमाटर के साथ बेक्ड हॉर्स मैकेरल"},
  R11:{en:"Lean beef stew with cassava",fr:"Ragoût de bœuf maigre au manioc",es:"Estofado de ternera magra con yuca",zh:"瘦牛肉炖木薯",hi:"कसावा के साथ लीन बीफ़ स्टू"},
  R12:{en:"Beans, rice and egg",fr:"Haricots, riz et œuf",es:"Frijoles con arroz y huevo",zh:"豆子、米饭和鸡蛋",hi:"बीन्स, चावल और अंडा"},
  R13:{en:"Spaghetti with shredded chicken",fr:"Spaghetti au poulet effiloché",es:"Espaguetis con pollo desmenuzado",zh:"鸡丝意大利面",hi:"कटा हुआ चिकन स्पेगेटी"},
  R14:{en:"Grilled fish with sweet potato",fr:"Poisson grillé et patate douce",es:"Pescado a la plancha con batata",zh:"烤鱼配红薯",hi:"शकरकंद के साथ ग्रिल्ड मछली"},
  R15:{en:"Homemade burger with roasted potatoes",fr:"Burger maison et pommes de terre rôties",es:"Hamburguesa casera con patatas asadas",zh:"自制汉堡配烤土豆",hi:"भुने आलू के साथ घर का बना बर्गर"},
  R16:{en:"Lean goat with rice and greens",fr:"Chèvre maigre, riz et chou",es:"Cabrito magro con arroz y col",zh:"瘦山羊肉配米饭和青菜",hi:"चावल और हरी सब्ज़ियों के साथ लीन बकरी का मांस"},
  R17:{en:"Matapa with fish and xima",fr:"Matapa au poisson et xima",es:"Matapa con pescado y xima",zh:"莫桑比克马塔帕配鱼和西马",hi:"मछली और ज़िमा के साथ मटापा"},
  R18:{en:"Mucapata with fish",fr:"Mucapata au poisson",es:"Mucapata con pescado",zh:"穆卡帕塔配鱼",hi:"मछली के साथ मुकापाटा"},
  R19:{en:"Chicken curry with rice",fr:"Curry de poulet et riz",es:"Curry de pollo con arroz",zh:"鸡肉咖喱配米饭",hi:"चावल के साथ चिकन करी"},
  R20:{en:"Tuna, potato and egg salad",fr:"Salade de thon, pommes de terre et œuf",es:"Ensalada de atún, patata y huevo",zh:"金枪鱼土豆鸡蛋沙拉",hi:"टूना, आलू और अंडे का सलाद"},
  R21:{en:"Bean, pumpkin and chicken soup",fr:"Soupe de haricots, potiron et poulet",es:"Sopa de frijoles, calabaza y pollo",zh:"豆子南瓜鸡肉汤",hi:"बीन्स, कद्दू और चिकन का सूप"},
  R22:{en:"Cheese and greens omelet",fr:"Omelette au fromage et aux légumes verts",es:"Tortilla de queso y verduras",zh:"奶酪蔬菜煎蛋饼",hi:"चीज़ और हरी सब्ज़ियों का ऑमलेट"},
  R23:{en:"Tuna and tomato sandwich",fr:"Sandwich au thon et à la tomate",es:"Sándwich de atún y tomate",zh:"金枪鱼番茄三明治",hi:"टूना और टमाटर सैंडविच"},
  R24:{en:"Banana with peanuts and milk",fr:"Banane, arachides et lait",es:"Banana con cacahuetes y leche",zh:"香蕉、花生和牛奶",hi:"मूंगफली और दूध के साथ केला"},
  R25:{en:"Orange and fresh cheese",fr:"Orange et fromage frais",es:"Naranja y queso fresco",zh:"橙子配鲜奶酪",hi:"संतरा और ताज़ा चीज़"},
  R26:{en:"Papaya with yogurt",fr:"Papaye au yaourt",es:"Papaya con yogur",zh:"木瓜酸奶",hi:"दही के साथ पपीता"},
  R27:{en:"Boiled egg and bread",fr:"Œuf dur et pain",es:"Huevo cocido y pan",zh:"水煮蛋配面包",hi:"उबला अंडा और ब्रेड"},
  R28:{en:"Milk, banana and oat smoothie",fr:"Smoothie au lait, banane et avoine",es:"Batido de leche, banana y avena",zh:"牛奶香蕉燕麦奶昔",hi:"दूध, केला और ओट्स स्मूदी"},
  R29:{en:"Chicken and avocado salad",fr:"Salade de poulet et avocat",es:"Ensalada de pollo y aguacate",zh:"鸡肉牛油果沙拉",hi:"चिकन और एवोकाडो सलाद"},
  R30:{en:"Boiled fish with cassava and vegetables",fr:"Poisson bouilli, manioc et légumes",es:"Pescado cocido con yuca y verduras",zh:"水煮鱼配木薯和蔬菜",hi:"कसावा और सब्ज़ियों के साथ उबली मछली"},
  I01:{en:"Overnight oats with banana and yogurt",fr:"Overnight oats à la banane et au yaourt",es:"Avena reposada con banana y yogur",zh:"隔夜香蕉酸奶燕麦",hi:"केला और दही के साथ ओवरनाइट ओट्स"},
  I02:{en:"Chicken burrito bowl",fr:"Bowl façon burrito au poulet",es:"Bowl de pollo estilo burrito",zh:"鸡肉墨西哥卷碗",hi:"चिकन बुरिटो बाउल"},
  I03:{en:"Lean beef and bean chili",fr:"Chili de bœuf maigre et haricots",es:"Chili de carne magra y frijoles",zh:"瘦牛肉豆子辣炖",hi:"लीन बीफ़ और बीन्स चिली"},
  I04:{en:"Baked potato stuffed with tuna",fr:"Pomme de terre au four farcie au thon",es:"Patata asada rellena de atún",zh:"金枪鱼馅烤土豆",hi:"टूना से भरा बेक्ड आलू"},
  I05:{en:"Whole-wheat chicken wrap",fr:"Wrap complet au poulet",es:"Wrap integral de pollo",zh:"全麦鸡肉卷",hi:"होल-व्हीट चिकन रैप"},
  I06:{en:"Brazilian rice, beans and chicken plate",fr:"Assiette brésilienne de riz, haricots et poulet",es:"Plato brasileño de arroz, frijoles y pollo",zh:"巴西风味米饭、豆子和鸡肉",hi:"ब्राज़ीलियन चावल, बीन्स और चिकन प्लेट"},
  I07:{en:"Protein banana and oat pancakes",fr:"Pancakes protéinés à la banane et à l’avoine",es:"Tortitas proteicas de banana y avena",zh:"高蛋白香蕉燕麦煎饼",hi:"प्रोटीन केला और ओट्स पैनकेक"},
  I08:{en:"Whole-wheat chicken pasta",fr:"Pâtes complètes au poulet",es:"Pasta integral con pollo",zh:"全麦鸡肉意面",hi:"होल-व्हीट चिकन पास्ता"},
  I09:{en:"Chicken and sweet potato bowl",fr:"Bowl de poulet et patate douce",es:"Bowl de pollo y batata",zh:"鸡肉红薯碗",hi:"चिकन और शकरकंद बाउल"},
  I10:{en:"Yogurt, mango and oat bowl",fr:"Bol de yaourt, mangue et avoine",es:"Bol de yogur, mango y avena",zh:"酸奶芒果燕麦碗",hi:"दही, आम और ओट्स बाउल"},
  I11:{en:"Tuna pasta salad",fr:"Salade de pâtes au thon",es:"Ensalada de pasta con atún",zh:"金枪鱼意面沙拉",hi:"टूना पास्ता सलाद"},
  M01:{en:"Grilled horse mackerel with xima and salad",fr:"Chinchard grillé avec xima et salade",es:"Jurel a la plancha con xima y ensalada",zh:"烤竹荚鱼配西马和沙拉",hi:"ज़िमा और सलाद के साथ ग्रिल्ड हॉर्स मैकेरल"},
  M02:{en:"Mozambican-style chicken curry with rice",fr:"Curry de poulet façon mozambicaine avec riz",es:"Curry de pollo al estilo mozambiqueño con arroz",zh:"莫桑比克风味鸡肉咖喱饭",hi:"मोज़ाम्बिक शैली चिकन करी और चावल"},
  M03:{en:"Matapa with fish and xima",fr:"Matapa au poisson et xima",es:"Matapa con pescado y xima",zh:"马塔帕配鱼和西马",hi:"मछली और ज़िमा के साथ मटापा"},
  M04:{en:"Mucapata with fish",fr:"Mucapata au poisson",es:"Mucapata con pescado",zh:"穆卡帕塔配鱼",hi:"मछली के साथ मुकापाटा"},
  M05:{en:"Fish with cassava and vegetables",fr:"Poisson au manioc et légumes",es:"Pescado con yuca y verduras",zh:"鱼配木薯和蔬菜",hi:"कसावा और सब्ज़ियों के साथ मछली"}
};
const foodNameTranslations = {
  "Aveia":{en:"Oats",fr:"Avoine",es:"Avena",zh:"燕麦",hi:"जई"},
  "Banana":{en:"Banana",fr:"Banane",es:"Banana",zh:"香蕉",hi:"केला"},
  "Leite":{en:"Milk",fr:"Lait",es:"Leche",zh:"牛奶",hi:"दूध"},
  "Canela":{en:"Cinnamon",fr:"Cannelle",es:"Canela",zh:"肉桂",hi:"दालचीनी"},
  "Ovos":{en:"Eggs",fr:"Œufs",es:"Huevos",zh:"鸡蛋",hi:"अंडे"},
  "Ovo":{en:"Egg",fr:"Œuf",es:"Huevo",zh:"鸡蛋",hi:"अंडा"},
  "Pão integral":{en:"Whole-grain bread",fr:"Pain complet",es:"Pan integral",zh:"全麦面包",hi:"होल-ग्रेन ब्रेड"},
  "Tomate":{en:"Tomato",fr:"Tomate",es:"Tomate",zh:"番茄",hi:"टमाटर"},
  "Farinha de milho":{en:"Cornmeal",fr:"Farine de maïs",es:"Harina de maíz",zh:"玉米粉",hi:"मक्के का आटा"},
  "Papaia":{en:"Papaya",fr:"Papaye",es:"Papaya",zh:"木瓜",hi:"पपीता"},
  "Iogurte natural":{en:"Plain yogurt",fr:"Yaourt nature",es:"Yogur natural",zh:"原味酸奶",hi:"सादा दही"},
  "Ananás":{en:"Pineapple",fr:"Ananas",es:"Piña",zh:"菠萝",hi:"अनानास"},
  "Batata-doce":{en:"Sweet potato",fr:"Patate douce",es:"Batata",zh:"红薯",hi:"शकरकंद"},
  "Amendoim":{en:"Peanuts",fr:"Arachides",es:"Cacahuetes",zh:"花生",hi:"मूंगफली"},
  "Frango grelhado":{en:"Grilled chicken",fr:"Poulet grillé",es:"Pollo a la plancha",zh:"烤鸡肉",hi:"ग्रिल्ड चिकन"},
  "Frango":{en:"Chicken",fr:"Poulet",es:"Pollo",zh:"鸡肉",hi:"चिकन"},
  "Arroz":{en:"Rice",fr:"Riz",es:"Arroz",zh:"米饭",hi:"चावल"},
  "Alface":{en:"Lettuce",fr:"Laitue",es:"Lechuga",zh:"生菜",hi:"सलाद पत्ता"},
  "Cenoura":{en:"Carrot",fr:"Carotte",es:"Zanahoria",zh:"胡萝卜",hi:"गाजर"},
  "Azeite":{en:"Olive oil",fr:"Huile d’olive",es:"Aceite de oliva",zh:"橄榄油",hi:"जैतून का तेल"},
  "Carapau":{en:"Horse mackerel",fr:"Chinchard",es:"Jurel",zh:"竹荚鱼",hi:"हॉर्स मैकेरल"},
  "Cebola":{en:"Onion",fr:"Oignon",es:"Cebolla",zh:"洋葱",hi:"प्याज़"},
  "Carne magra":{en:"Lean beef",fr:"Bœuf maigre",es:"Carne magra",zh:"瘦牛肉",hi:"लीन बीफ़"},
  "Mandioca":{en:"Cassava",fr:"Manioc",es:"Yuca",zh:"木薯",hi:"कसावा"},
  "Couve":{en:"Collard greens",fr:"Chou vert",es:"Col verde",zh:"羽衣甘蓝",hi:"हरी पत्तेदार सब्ज़ी"},
  "Feijão cozido":{en:"Cooked beans",fr:"Haricots cuits",es:"Frijoles cocidos",zh:"熟豆子",hi:"पकी हुई बीन्स"},
  "Feijão":{en:"Beans",fr:"Haricots",es:"Frijoles",zh:"豆子",hi:"बीन्स"},
  "Esparguete":{en:"Spaghetti",fr:"Spaghetti",es:"Espaguetis",zh:"意大利面",hi:"स्पेगेटी"},
  "Peixe grelhado":{en:"Grilled fish",fr:"Poisson grillé",es:"Pescado a la plancha",zh:"烤鱼",hi:"ग्रिल्ड मछली"},
  "Peixe":{en:"Fish",fr:"Poisson",es:"Pescado",zh:"鱼",hi:"मछली"},
  "Tilápia":{en:"Tilapia",fr:"Tilapia",es:"Tilapia",zh:"罗非鱼",hi:"तिलापिया"},
  "Matapa":{en:"Matapa greens",fr:"Feuilles de matapa",es:"Hojas de matapa",zh:"马塔帕叶",hi:"मटापा पत्तियाँ"},
  "Mucapata":{en:"Mucapata",fr:"Mucapata",es:"Mucapata",zh:"穆卡帕塔",hi:"मुकापाटा"},
  "Atum":{en:"Tuna",fr:"Thon",es:"Atún",zh:"金枪鱼",hi:"टूना"},
  "Batata":{en:"Potato",fr:"Pomme de terre",es:"Patata",zh:"土豆",hi:"आलू"},
  "Pepino":{en:"Cucumber",fr:"Concombre",es:"Pepino",zh:"黄瓜",hi:"खीरा"},
  "Abóbora":{en:"Pumpkin",fr:"Courge",es:"Calabaza",zh:"南瓜",hi:"कद्दू"},
  "Queijo fresco":{en:"Fresh cheese",fr:"Fromage frais",es:"Queso fresco",zh:"鲜奶酪",hi:"ताज़ा चीज़"},
  "Laranja":{en:"Orange",fr:"Orange",es:"Naranja",zh:"橙子",hi:"संतरा"},
  "Manga":{en:"Mango",fr:"Mangue",es:"Mango",zh:"芒果",hi:"आम"},
  "Abacate":{en:"Avocado",fr:"Avocat",es:"Aguacate",zh:"牛油果",hi:"एवोकाडो"},
  "Xima":{en:"Xima (maize porridge)",fr:"Xima (bouillie de maïs)",es:"Xima (gachas de maíz)",zh:"西马（玉米糊）",hi:"ज़िमा (मक्के का दलिया)"},
  "Couve e tomate":{en:"Greens and tomato",fr:"Légumes verts et tomate",es:"Verduras y tomate",zh:"青菜和番茄",hi:"हरी सब्ज़ियाँ और टमाटर"}
};
Object.assign(foodNameTranslations, {
  "Arroz cozido":{en:"Cooked rice",fr:"Riz cuit",es:"Arroz cocido",zh:"熟米饭",hi:"पके हुए चावल"},
  "Batata cozida":{en:"Boiled potato",fr:"Pomme de terre cuite",es:"Patata cocida",zh:"煮土豆",hi:"उबला आलू"},
  "Mandioca cozida":{en:"Cooked cassava",fr:"Manioc cuit",es:"Yuca cocida",zh:"熟木薯",hi:"पका कसावा"},
  "Massa integral":{en:"Whole-wheat pasta",fr:"Pâtes complètes",es:"Pasta integral",zh:"全麦意面",hi:"होल-व्हीट पास्ता"},
  "Feijão-nhemba":{en:"Cowpeas",fr:"Niébé",es:"Caupí",zh:"豇豆",hi:"लोबिया"},
  "Maçã":{en:"Apple",fr:"Pomme",es:"Manzana",zh:"苹果",hi:"सेब"},
  "Morangos":{en:"Strawberries",fr:"Fraises",es:"Fresas",zh:"草莓",hi:"स्ट्रॉबेरी"},
  "Frango à zambeziana":{en:"Zambezia-style chicken",fr:"Poulet à la zambézienne",es:"Pollo al estilo zambeziano",zh:"赞比西亚风味鸡肉",hi:"ज़ाम्बेज़िया शैली चिकन"},
  "Sardinha":{en:"Sardines",fr:"Sardines",es:"Sardinas",zh:"沙丁鱼",hi:"सार्डिन"},
  "Caril de peixe":{en:"Fish curry",fr:"Curry de poisson",es:"Curry de pescado",zh:"鱼咖喱",hi:"मछली करी"},
  "Caril de amendoim":{en:"Peanut curry",fr:"Curry aux arachides",es:"Curry de cacahuete",zh:"花生咖喱",hi:"मूंगफली करी"},
  "Esparguete com atum e tomate":{en:"Spaghetti with tuna and tomato",fr:"Spaghetti au thon et à la tomate",es:"Espaguetis con atún y tomate",zh:"金枪鱼番茄意大利面",hi:"टूना और टमाटर स्पेगेटी"},
  "Cozido caseiro de ovo, couve e frango":{en:"Homestyle egg, greens and chicken stew",fr:"Ragoût maison aux œufs, légumes verts et poulet",es:"Guiso casero de huevo, verduras y pollo",zh:"家常鸡蛋青菜炖鸡",hi:"घर का बना अंडा, हरी सब्ज़ी और चिकन स्टू"},
  "Frango com molho de amendoim":{en:"Chicken in peanut sauce",fr:"Poulet à la sauce d’arachide",es:"Pollo en salsa de cacahuete",zh:"花生酱鸡肉",hi:"मूंगफली की चटनी में चिकन"},
  "Salada cozida de ovo, couve, frango, batata e cenoura":{en:"Boiled egg, greens, chicken, potato and carrot salad",fr:"Salade d’œuf, chou, poulet, pomme de terre et carotte",es:"Ensalada de huevo, col, pollo, patata y zanahoria",zh:"鸡蛋、青菜、鸡肉、土豆和胡萝卜沙拉",hi:"उबले अंडे, हरी सब्ज़ी, चिकन, आलू और गाजर का सलाद"},
  "Carapau grelhado":{en:"Grilled horse mackerel",fr:"Chinchard grillé",es:"Jurel a la plancha",zh:"烤竹荚鱼",hi:"ग्रिल्ड हॉर्स मैकेरल"},
  "Lentilhas cozidas":{en:"Cooked lentils",fr:"Lentilles cuites",es:"Lentejas cocidas",zh:"熟扁豆",hi:"पकी हुई दाल"},
  "Papa de milho":{en:"Cornmeal porridge",fr:"Bouillie de maïs",es:"Gachas de maíz",zh:"玉米粥",hi:"मक्के का दलिया"},
  "Melancia":{en:"Watermelon",fr:"Pastèque",es:"Sandía",zh:"西瓜",hi:"तरबूज़"},
  "Goiaba":{en:"Guava",fr:"Goyave",es:"Guayaba",zh:"番石榴",hi:"अमरूद"},
  "Alface e pepino":{en:"Lettuce and cucumber",fr:"Laitue et concombre",es:"Lechuga y pepino",zh:"生菜和黄瓜",hi:"सलाद पत्ता और खीरा"},
  "Quiabo":{en:"Okra",fr:"Gombo",es:"Quimbombó",zh:"秋葵",hi:"भिंडी"}
});
const mealLabelTranslations = {
  "Pequeno-almoço":{en:"Breakfast",fr:"Petit-déjeuner",es:"Desayuno",zh:"早餐",hi:"नाश्ता"},
  "Lanche da manhã":{en:"Morning snack",fr:"Collation du matin",es:"Tentempié de la mañana",zh:"上午加餐",hi:"सुबह का नाश्ता"},
  "Almoço":{en:"Lunch",fr:"Déjeuner",es:"Almuerzo",zh:"午餐",hi:"दोपहर का भोजन"},
  "Lanche / pré-treino":{en:"Snack / pre-workout",fr:"Collation / avant l’entraînement",es:"Merienda / preentreno",zh:"加餐 / 训练前",hi:"स्नैक / वर्कआउट से पहले"},
  "Jantar / pós-treino":{en:"Dinner / post-workout",fr:"Dîner / après l’entraînement",es:"Cena / postentreno",zh:"晚餐 / 训练后",hi:"रात का खाना / वर्कआउट के बाद"}
};
export function translateRecipeName(id, fallback, language) {
  return language === "pt" ? fallback : recipeNameTranslations[id]?.[language] || fallback;
}
export function translateFoodName(name, language) {
  return language === "pt" ? name : foodNameTranslations[name]?.[language] || name;
}
export function translateIngredientString(value, language) {
  if (language === "pt" || !value) return value;
  let result = String(value);
  for (const key of Object.keys(foodNameTranslations).sort((a,b)=>b.length-a.length)) {
    const translated = foodNameTranslations[key]?.[language];
    if (translated) result = result.replace(new RegExp(key, "gi"), translated);
  }
  return result;
}
export function translateMealLabel(value, language) {
  return language === "pt" ? value : mealLabelTranslations[value]?.[language] || value;
}
export function translateRecipePreparation(value, language) {
  if (language === "pt" || !value) return value;
  return ({
    en:"Prepare the ingredients in the quantities shown. Cook meat, fish and eggs thoroughly; prepare the grains and vegetables, then serve the planned portion.",
    fr:"Préparez les ingrédients selon les quantités indiquées. Faites bien cuire la viande, le poisson et les œufs, préparez les féculents et les légumes, puis servez la portion prévue.",
    es:"Prepara los ingredientes en las cantidades indicadas. Cocina bien la carne, el pescado y los huevos; prepara los cereales y las verduras y sirve la porción prevista.",
    zh:"按所列分量准备食材。将肉类、鱼和鸡蛋彻底煮熟，准备主食和蔬菜，再按计划份量食用。",
    hi:"दी गई मात्रा के अनुसार सामग्री तैयार करें। मांस, मछली और अंडे अच्छी तरह पकाएँ; अनाज और सब्ज़ियाँ तैयार करें और निर्धारित मात्रा परोसें。"
  })[language] || value;
}
export function translateRecipePurpose(value, language) {
  if (language === "pt" || !value) return value;
  return ({
    en:"Balanced meal planned to support your selected goal and daily nutrition targets.",
    fr:"Repas équilibré conçu pour soutenir votre objectif et vos besoins nutritionnels quotidiens.",
    es:"Comida equilibrada para apoyar tu objetivo y tus necesidades nutricionales diarias.",
    zh:"均衡餐食，旨在支持你选择的目标和每日营养需求。",
    hi:"आपके चुने हुए लक्ष्य और दैनिक पोषण आवश्यकताओं के लिए संतुलित भोजन।"
  })[language] || value;
}
export function translateRecipeAdjustment(value, language) {
  if (language === "pt" || !value) return value;
  return ({
    en:"Adjust the serving to your daily plan. Prefer simple preparation and avoid adding excess oil, salt or sugar.",
    fr:"Adaptez la portion à votre programme quotidien. Privilégiez une préparation simple et évitez l’excès d’huile, de sel ou de sucre.",
    es:"Ajusta la porción a tu plan diario. Prefiere preparaciones sencillas y evita añadir demasiado aceite, sal o azúcar.",
    zh:"根据每日计划调整份量。尽量采用简单烹饪方式，避免添加过多油、盐或糖。",
    hi:"अपनी दैनिक योजना के अनुसार मात्रा समायोजित करें। सरल पकाने का तरीका अपनाएँ और अतिरिक्त तेल, नमक या चीनी से बचें।"
  })[language] || value;
}

Object.assign(commonTranslations, {
  "Meus treinos":{en:"My workouts",fr:"Mes entraînements",es:"Mis entrenamientos",zh:"我的训练",hi:"मेरे वर्कआउट"},
  "PROGRAMA PERSONALIZADO":{en:"PERSONALIZED PROGRAM",fr:"PROGRAMME PERSONNALISÉ",es:"PROGRAMA PERSONALIZADO",zh:"个性化训练计划",hi:"व्यक्तिगत कार्यक्रम"},
  "30 dias de evolução":{en:"30 days of progress",fr:"30 jours de progression",es:"30 días de progreso",zh:"30天进步计划",hi:"प्रगति के 30 दिन"},
  "Escolha o dia":{en:"Choose the day",fr:"Choisissez le jour",es:"Elige el día",zh:"选择日期",hi:"दिन चुनें"},
  "Treino perdido":{en:"Missed workout",fr:"Entraînement manqué",es:"Entrenamiento perdido",zh:"错过的训练",hi:"छूटा हुआ वर्कआउट"},
  "Treino concluído":{en:"Workout completed",fr:"Entraînement terminé",es:"Entrenamiento completado",zh:"训练已完成",hi:"वर्कआउट पूरा हुआ"},
  "Dia por cumprir":{en:"Pending day",fr:"Jour à effectuer",es:"Día pendiente",zh:"待完成日期",hi:"बाकी दिन"},
  "Perdido":{en:"Missed",fr:"Manqué",es:"Perdido",zh:"错过",hi:"छूटा"},
  "Dificuldade":{en:"Difficulty",fr:"Difficulté",es:"Dificultad",zh:"难度",hi:"कठिनाई"},
  "MOVIMENTOS DO DIA":{en:"TODAY'S MOVEMENTS",fr:"MOUVEMENTS DU JOUR",es:"MOVIMIENTOS DEL DÍA",zh:"今日动作",hi:"आज के व्यायाम"},
  "Movimentos reais":{en:"Real movements",fr:"Mouvements réels",es:"Movimientos reales",zh:"真实动作",hi:"वास्तविक गतिविधियाँ"},
  "Progressão do dia:":{en:"Today's progression:",fr:"Progression du jour :",es:"Progresión del día:",zh:"今日进阶：",hi:"आज की प्रगति:"},
  "Meta técnica:":{en:"Technique goal:",fr:"Objectif technique :",es:"Objetivo técnico:",zh:"技术目标：",hi:"तकनीक का लक्ष्य:"},
  "Sem equipamento":{en:"No equipment",fr:"Sans équipement",es:"Sin equipo",zh:"无需器械",hi:"बिना उपकरण"},
  "Com equipamento":{en:"With equipment",fr:"Avec équipement",es:"Con equipo",zh:"使用器械",hi:"उपकरण के साथ"},
  "Todos os equipamentos":{en:"All equipment",fr:"Tous les équipements",es:"Todo el equipo",zh:"所有器械",hi:"सभी उपकरण"},
  "Peito":{en:"Chest",fr:"Pectoraux",es:"Pecho",zh:"胸部",hi:"छाती"},
  "Costas":{en:"Back",fr:"Dos",es:"Espalda",zh:"背部",hi:"पीठ"},
  "Ombros":{en:"Shoulders",fr:"Épaules",es:"Hombros",zh:"肩部",hi:"कंधे"},
  "Bíceps":{en:"Biceps",fr:"Biceps",es:"Bíceps",zh:"肱二头肌",hi:"बाइसेप्स"},
  "Tríceps":{en:"Triceps",fr:"Triceps",es:"Tríceps",zh:"肱三头肌",hi:"ट्राइसेप्स"},
  "Abdominais":{en:"Abs",fr:"Abdominaux",es:"Abdominales",zh:"腹肌",hi:"पेट"},
  "Pernas":{en:"Legs",fr:"Jambes",es:"Piernas",zh:"腿部",hi:"पैर"},
  "Glúteos":{en:"Glutes",fr:"Fessiers",es:"Glúteos",zh:"臀部",hi:"ग्लूट्स"},
  "Cardio":{en:"Cardio",fr:"Cardio",es:"Cardio",zh:"有氧",hi:"कार्डियो"},
  "Mobilidade":{en:"Mobility",fr:"Mobilité",es:"Movilidad",zh:"灵活性",hi:"गतिशीलता"},
  "Iniciante":{en:"Beginner",fr:"Débutant",es:"Principiante",zh:"初级",hi:"शुरुआती"},
  "Intermediário":{en:"Intermediate",fr:"Intermédiaire",es:"Intermedio",zh:"中级",hi:"मध्यम"},
  "Avançado":{en:"Advanced",fr:"Avancé",es:"Avanzado",zh:"高级",hi:"उन्नत"}
});
Object.assign(commonTranslations, {
  "Verde: treino registado. Vermelho: dia terminado sem treino guardado.":{en:"Green: workout logged. Red: day ended without a saved workout.",fr:"Vert : entraînement enregistré. Rouge : journée terminée sans entraînement sauvegardé.",es:"Verde: entrenamiento registrado. Rojo: día terminado sin entrenamiento guardado.",zh:"绿色：已记录训练。红色：当天结束但未保存训练。",hi:"हरा: वर्कआउट दर्ज। लाल: दिन बिना सेव किए गए वर्कआउट के समाप्त।"},
  "Leve":{en:"Light",fr:"Légère",es:"Ligera",zh:"轻度",hi:"हल्की"},
  "Moderada":{en:"Moderate",fr:"Modérée",es:"Moderada",zh:"中等",hi:"मध्यम"},
  "Alta":{en:"High",fr:"Élevée",es:"Alta",zh:"高",hi:"उच्च"},
  "Treino guiado":{en:"Guided workout",fr:"Entraînement guidé",es:"Entrenamiento guiado",zh:"指导训练",hi:"निर्देशित वर्कआउट"},
  "Abdômen":{en:"Core",fr:"Abdominaux",es:"Abdomen",zh:"核心",hi:"कोर"},
  "SEU PROGRAMA":{en:"YOUR PROGRAM",fr:"VOTRE PROGRAMME",es:"TU PROGRAMA",zh:"你的计划",hi:"आपका कार्यक्रम"}
});
Object.assign(commonTranslations, {
  "Altere os textos principais, navegação e instruções do treino guiado.":{en:"Change the main text, navigation and guided-workout instructions.",fr:"Modifiez les textes principaux, la navigation et les instructions de l’entraînement guidé.",es:"Cambia los textos principales, la navegación y las instrucciones del entrenamiento guiado.",zh:"更改主要文本、导航和指导训练说明。",hi:"मुख्य टेक्स्ट, नेविगेशन और निर्देशित वर्कआउट निर्देश बदलें।"},
  "Personalização visual":{en:"Visual customization",fr:"Personnalisation visuelle",es:"Personalización visual",zh:"外观自定义",hi:"दृश्य अनुकूलन"},
  "APARÊNCIA":{en:"APPEARANCE",fr:"APPARENCE",es:"APARIENCIA",zh:"外观",hi:"दिखावट"},
  "Dark":{en:"Dark",fr:"Sombre",es:"Oscuro",zh:"深色",hi:"डार्क"},
  "Forest":{en:"Forest",fr:"Forêt",es:"Bosque",zh:"森林",hi:"फ़ॉरेस्ट"},
  "Sprint Energy":{en:"Sprint Energy",fr:"Sprint Energy",es:"Sprint Energy",zh:"冲刺能量",hi:"स्प्रिंट एनर्जी"},
  "Ocean Light":{en:"Ocean Light",fr:"Lumière Océan",es:"Luz del océano",zh:"海洋浅色",hi:"ओशन लाइट"},
  "Grafite · lima elétrica":{en:"Graphite · electric lime",fr:"Graphite · citron vert électrique",es:"Grafito · lima eléctrica",zh:"石墨灰 · 荧光青柠",hi:"ग्रेफाइट · इलेक्ट्रिक लाइम"},
  "Branco · azul · violeta":{en:"White · blue · violet",fr:"Blanc · bleu · violet",es:"Blanco · azul · violeta",zh:"白色 · 蓝色 · 紫色",hi:"सफ़ेद · नीला · बैंगनी"}
});
export function translateUiText(value, language) {
  if (typeof value !== "string" || !language || language === "pt") return value;
  return commonTranslations[value.trim()]?.[language] || value;
}

const ptRules=[[/\bjust beyond\b/gi,'um pouco além de'],[/\bpalms?\b/gi,'palmas'],[/\bfacing down\b/gi,'voltadas para baixo'],[/\bfacing\b/gi,'voltadas para'],[/\baway\b/gi,'para longe'],[/\bkeeping\b/gi,'mantendo'],[/\btrunk\b/gi,'tronco'],[/\bbraced\b/gi,'ativado'],[/\bwrists?\b/gi,'punhos'],[/\bstacked\b/gi,'alinhados'],[/\bnatural\b/gi,'natural'],[/\binitial height\b/gi,'altura inicial'],[/\bunder control\b/gi,'com controle'],[/\bpressing again\b/gi,'empurrar novamente'],[/\bbarbell\b/gi,'barra'],[/\bbench\b/gi,'banco'],[/\baway from\b/gi,'para longe de'],[/\byour hands\b/gi,'as mãos'],[/\byour feet\b/gi,'os pés'],[/\byour body\b/gi,'o corpo'],[/\byour back\b/gi,'as costas'],[/\bhands on the floor\b/gi,'as mãos no chão'],[/\bwith your feet shoulder width apart\b/gi,'com os pés afastados na largura dos ombros'],[/\byour back straight\b/gi,'as costas retas'],[/\byour body slowly\b/gi,'o corpo devagar'],[/\bto the starting position\b/gi,'à posição inicial'],[/\bBegin by placing your hands\b/gi,'Comece colocando as mãos'],
 [/^Step:\d+\s*/i,''],[/^Begin by /i,'Comece '],[/^Begin in /i,'Comece em '],[/^Stand and /i,'Fique em pé e '],[/^Settle onto /i,'Posicione-se em '],[/^Take a seat on /i,'Sente-se em '],[/^Face the /i,'Fique de frente para '],[/^Place your /i,'Coloque suas '],[/^Keep /i,'Mantenha '],[/^Bend /i,'Dobre '],[/^Lower /i,'Desça '],[/^Raise /i,'Eleve '],[/^Press /i,'Empurre '],[/^Hold /i,'Mantenha '],[/^Return /i,'Retorne '],[/^Reach /i,'Estenda '],[/^Brace /i,'Ative '],[/^Extend /i,'Estenda '],[/^Shift /i,'Desloque '],[/^Move /i,'Mova '],[/^Pull /i,'Puxe '],[/\bplacing\b/gi,'colocando'],[/\bapart\b/gi,'afastados'],[/\bposition\b/gi,'posição'],[/\bstarting position\b/gi,'posição inicial'],[/\bstraight\b/gi,'reto'],[/\blower\b/gi,'desça'],[/\breturn\b/gi,'retorne'],[/\brepeat\b/gi,'repita'],[/\bplacing your hands\b/gi,'colocando as mãos'],
 [/\bwith your feet\b/gi,'com os pés'],[/\bshoulder width\b/gi,'afastados na largura dos ombros'],[/\bon\b/gi,'no'],[/\band\b/gi,'e'],[/\bthe\b/gi,'o'],[/\bwithout\b/gi,'sem'],[/\bwhile\b/gi,'enquanto'],[/\bslowly\b/gi,'devagar'],[/\bcontrolled\b/gi,'controlado'],[/\bcontrol\b/gi,'controle'],[/\bground\b/gi,'chão'],[/\bfloor\b/gi,'chão'],[/\bbench\b/gi,'banco'],[/\bweight\b/gi,'carga'],[/\bbody\b/gi,'corpo'],[/\bhands\b/gi,'mãos'],[/\bhand\b/gi,'mão'],[/\bfeet\b/gi,'pés'],[/\bfoot\b/gi,'pé'],[/\bshoulders\b/gi,'ombros'],[/\bshoulder\b/gi,'ombro'],[/\bhips\b/gi,'quadris'],[/\bhip\b/gi,'quadril'],[/\bankles\b/gi,'tornozelos'],[/\barms\b/gi,'braços'],[/\barm\b/gi,'braço'],[/\blegs\b/gi,'pernas'],[/\bleg\b/gi,'perna'],[/\bback\b/gi,'costas'],[/\bchest\b/gi,'peito'],[/\bhead\b/gi,'cabeça'],[/\bneck\b/gi,'pescoço'],[/\belbows\b/gi,'cotovelos'],[/\belbow\b/gi,'cotovelo'],[/\bknees\b/gi,'joelhos'],[/\bknee\b/gi,'joelho'],[/\bstraight\b/gi,'reto'],[/\bbent\b/gi,'dobrado'],[/\bwide\b/gi,'amplo'],[/\bclose\b/gi,'fechado'],[/\bleft\b/gi,'esquerdo'],[/\bright\b/gi,'direito'],[/\bforward\b/gi,'para frente'],[/\bbackward\b/gi,'para trás'],[/\bup\b/gi,'para cima'],[/\bdown\b/gi,'para baixo'],[/\bside\b/gi,'lado'],[/\bplace\b/gi,'coloque'],[/\bkeep\b/gi,'mantenha'],[/\bhold\b/gi,'segure'],[/\braise\b/gi,'eleve'],[/\blower\b/gi,'desça'],[/\bpress\b/gi,'empurre'],[/\breturn\b/gi,'retorne'],[/\bextend\b/gi,'estenda'],[/\bbend\b/gi,'dobre'],[/\brotate\b/gi,'gire'],[/\bslowly\b/gi,'devagar'],[/\bbreath(?:e)?\b/gi,'respire'],[/\binhale\b/gi,'inspire'],[/\bexhale\b/gi,'expire'],[/\brepeat\b/gi,'repita'],[/\bstarting\b/gi,'inicial'],[/\bstand\b/gi,'fique em pé'],[/\bsit\b/gi,'sente-se'],[/\blie\b/gi,'deite-se'],[/\bavoid\b/gi,'evite'],[/\bpain\b/gi,'dor'],[/\bmovement\b/gi,'movimento'],[/\bparallel\b/gi,'paralelo'],[/\btouch\b/gi,'toque'],[/\bpush\b/gi,'empurre'],[/\bpull\b/gi,'puxe'],[/\bgrip\b/gi,'pegada'],[/\bwidth\b/gi,'largura'],[/\bslightly\b/gi,'levemente'],[/\buntil\b/gi,'até'],[/\bthen\b/gi,'depois'],[/\bbefore\b/gi,'antes'],[/\bafter\b/gi,'depois'],[/\bwith\b/gi,'com']
];
const frRules=[[/^Step:\d+\s*/i,''],[/^Begin by /i,'Commencez par '],[/^Keep /i,'Gardez '],[/^Bend /i,'Pliez '],[/^Lower /i,'Descendez '],[/^Raise /i,'Levez '],[/^Press /i,'Poussez '],[/^Hold /i,'Maintenez '],[/^Return /i,'Revenez '],[/\bshoulder width\b/gi,'largeur des épaules'],[/\bslowly\b/gi,'lentement'],[/\bwithout\b/gi,'sans'],[/\bbody\b/gi,'corps'],[/\bweight\b/gi,'charge']];
export function translateInstruction(text, language) {
  const source = String(text || "").replace(/^Step:\d+\s*/i, "").trim();
  if (!source) return "";
  if (language === "en") return source;
  if (language === "pt") {
    let value = ptRules.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), source);
    value = value.replace(/\s+/g, " ").trim();
    if (/\b(begin|place|hands|floor|facing|keep|press|load|activate|your|the|while|away|height|under|control|repeat|step)\b/i.test(value))
      return "Execute o movimento devagar, mantenha a postura alinhada e a respiração controlada, sem dor.";
    return value.replace(/\.$/, "").trim() + ".";
  }
  if (language === "fr") {
    let value = frRules.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), source);
    if (/\b(begin|place|hands|floor|facing|keep|press|load|activate|your|the|while|away|height|under|control|repeat|step)\b/i.test(value))
      return "Effectuez le mouvement lentement, gardez le dos aligné et le tronc engagé. Respirez régulièrement et arrêtez en cas de douleur.";
    return value.replace(/\.$/, "").trim() + ".";
  }
  if (language === "es")
    return "Realiza el movimiento lentamente, mantén la espalda alineada y el abdomen activo. Controla la respiración y detente si aparece dolor.";
  if (language === "zh")
    return "缓慢完成动作，保持背部稳定并收紧核心。保持均匀呼吸，如出现疼痛请停止。";
  if (language === "hi")
    return "व्यायाम धीरे-धीरे करें, पीठ को सीधा रखें और पेट की मांसपेशियों को सक्रिय रखें। सांस नियंत्रित रखें और दर्द होने पर रुकें।";
  return source;
}
export function translatedInstructions(exercise, language) {
  return (exercise?.instructions || []).slice(0, 6).map((step) => translateInstruction(step, language));
}

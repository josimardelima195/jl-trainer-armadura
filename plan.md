# Plano de redesign — JL Trainer Armadura

## Direção aprovada

**Design Movement:** premium fitness editorial com cartões arredondados, navegação compacta e foco visual no próximo treino. A referência é uma aplicação fitness comercial moderna, sem reconstruir a arquitetura existente.

**Core Principles:** hierarquia clara; ação principal sempre visível; imagens com função real; contraste e legibilidade em primeiro lugar.

**Color Philosophy:** três paletas com a mesma identidade de marca, alternando entre luz premium, dark fitness e azul moderno. O dourado permanece como assinatura do JL Trainer, usado com moderação.

**Layout Paradigm:** dashboard assimétrico orientado à tarefa, com o próximo treino e a sequência no topo, seguido por cartões de progresso e acesso rápido. No celular, a navegação inferior permanece fixa e o conteúdo usa fluxo vertical.

**Signature Elements:** cartões com bordas suaves; indicadores de progresso em cápsula; imagens recortadas com enquadramento preservado; botões primários com ícone e estado ativo.

**Interaction Philosophy:** ações destrutivas ou importantes permanecem explícitas; filtros mantêm o contexto do usuário; troca de tema é imediata e local; nenhum redesign remove uma funcionalidade existente.

**Animation:** transições curtas de 150–220 ms, elevação discreta no hover e entrada suave de cartões. Sem animações que atrasem a abertura dos treinos ou prejudiquem acessibilidade.

**Typography System:** Space Grotesk para títulos e métricas; DM Sans para textos, labels e instruções. Hierarquia com títulos grandes, subtítulos curtos e informação secundária em cinzento contrastante.

**Brand Essence:** acompanhamento físico acessível para pessoas que querem treinar com consistência, clareza e acompanhamento real. Personalidade: disciplinada, próxima e prática.

**Brand Voice:** direto, encorajador e responsável. Exemplos: “Comece pelo treino de hoje.” e “Registre o que fez para enxergar a sua evolução.”

**Wordmark & Logo:** manter a marca JL existente e apenas melhorar o tratamento visual ao redor dela; não substituir o logotipo por texto genérico.

**Signature Brand Color:** dourado JL `#D6A84F`, usado para progresso, foco e chamadas principais.

## Implementação

1. **Fundação visual:** criar tokens CSS para Premium Light, Dark Fitness e Modern Blue; conectar o seletor às configurações existentes ou a armazenamento local sem alterar o banco.
2. **Dashboard e shell:** reorganizar visualmente início, sidebar, header, navegação mobile, cards de estatística, progresso e acessos rápidos.
3. **Treinos:** preservar `build30DayPlan`, ExerciseDB, filtros, séries, repetições, temporizadores e registros; melhorar cards, GIFs, instruções, estados de carregamento e responsividade.
4. **Biblioteca alimentar:** substituir URLs genéricas por um catálogo local com correspondência explícita alimento/imagem, fallback neutro e fonte/licença registrada. Não usar uma fotografia de prato diferente como se fosse ingrediente.
5. **Planos alimentares:** ampliar a estrutura atual sem quebrar `nutritionPlan`, mantendo estimativas calculadas pelo perfil e acrescentando variedade de 30 dias, modalidades, porções, hidratação, receitas e alternativas.
6. **Páginas restantes:** aplicar o mesmo sistema de cartões, tipografia, estados e espaçamentos em progresso, calendário, desafios, ranking, planos, conteúdos, perfil, coach, assistente e administração.
7. **Validação:** build, diff check, teste de rotas, teste dos três temas, verificação dos GIFs, imagens alimentares, planos pagos, login/Supabase e breakpoints desktop/mobile antes do checkpoint.

## Proteções

Não alterar autenticação, Supabase, RLS, pagamentos, preços, permissões, administração, dados dos utilizadores, identificadores ExerciseDB, GIFs, regras de treino ou funcionalidades existentes. As únicas extensões funcionais previstas são os três temas e o conteúdo alimentar ampliado, conforme solicitado.

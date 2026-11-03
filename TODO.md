# TODO — Redesign definitivo do JL Trainer Armadura

## Fundação visual e temas

- [x] Implementar três temas selecionáveis: Premium Light com branco gelo, azul-marinho, dourado e cinzento; Dark Fitness com grafite, verde-lima, branco e dourado discreto; Modern Blue com fundo branco, azul moderno, azul-claro, verde de sucesso e cinzento secundário.
- [x] Mostrar pré-visualização das três paletas nas configurações e aplicar o tema imediatamente a menus, cartões, botões, gráficos e páginas.
- [x] Guardar a preferência no dispositivo sem criar alteração de base de dados.
- [x] Garantir contraste, foco visível e leitura adequada nos três temas.

## Dashboard e shell

- [ ] Reorganizar a página inicial para priorizar saudação, imagem fitness, botão de treino, plano atual, treino do dia, sequência, progresso semanal, peso, estatísticas e acessos rápidos.
- [ ] Modernizar sidebar, header, sino de notificações, botões, cartões e navegação inferior mobile sem remover rotas.
- [ ] Aplicar espaçamento, tipografia, ícones e animações consistentes em computador, tablet e telemóvel.

## Treinos e ExerciseDB

- [ ] Manter programas, dias, filtros, séries, repetições, temporizadores, registos, ExerciseDB e GIFs existentes.
- [ ] Garantir que cada exercício mostra GIF, nome, músculo, equipamento, séries, repetições, instruções e ação explícita para visualizar a execução.
- [ ] Corrigir enquadramento responsivo dos GIFs para não deformar, cortar o corpo ou carregar imagens desnecessárias.
- [x] Preservar carregamento rápido e estados de loading sem bloquear a entrada na aba.

## Biblioteca alimentar e planos

- [ ] Criar biblioteca reutilizável com correspondência correta entre alimento e imagem, fallback neutro para ausência e fonte/licença registrada.
- [ ] Corrigir batata-doce, feijão, arroz, frango, peixe, ovos, banana, papaia, mandioca, amendoim, couve, abacate e demais alimentos presentes.
- [ ] Expandir alimentação para 30 dias de emagrecimento, bulking e cutting/definição, respeitando o perfil e apresentando valores como estimativas.
- [ ] Adaptar distribuição e hidratação às modalidades existentes: musculação, karaté, futsal, natação, cardio/condicionamento e casa.
- [ ] Variar refeições e incluir alimentos acessíveis em Moçambique, alternativas, porções, horários, hidratação, receitas e preparação.
- [ ] Criar calendário alimentar com dia atual, dia completo, cartões de refeição, fotos, calorias, macros quando disponíveis e botão de preparação.
- [ ] Manter avisos de segurança e não recomendar restrições extremas ou suplementação obrigatória.

## Restantes páginas

- [ ] Aplicar o sistema visual a progresso, gráficos, fotos antes/depois, calendário, desafios, conquistas, ranking, planos, conteúdos, perfil, coach, assistente e administração.
- [ ] Preservar as permissões, planos pagos, preços, pagamentos, autenticação, Supabase e dados existentes.

## Validação e publicação

- [ ] Executar build e diff check sem erros.
- [ ] Testar login/cadastro, Supabase, permissões e planos pagos.
- [ ] Testar os três temas e a persistência local da preferência.
- [ ] Testar GIFs ExerciseDB, filtros, temporizadores e registos de treino.
- [ ] Confirmar correspondência das imagens alimentares e funcionamento no telemóvel.
- [ ] Confirmar que os planos alimentares apresentam 30 dias e respeitam as estimativas do perfil.
- [ ] Validar breakpoints desktop, tablet e mobile e publicar apenas depois do build aprovado.

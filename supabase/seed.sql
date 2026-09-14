-- Seed inicial — rode DEPOIS de 001_initial_schema.sql
-- Supabase Dashboard → SQL Editor → New query → Run

TRUNCATE public.faq_items, public.hero_categories, public.games, public.projects,
  public.posts, public.courses, public.site_settings RESTART IDENTITY CASCADE;

-- Posts
INSERT INTO public.posts (slug, title, category, published_at, excerpt, tone, body, status) VALUES
(
  'mostra-anual-2025',
  'O que rolou na Mostra Anual 2025',
  'Eventos',
  '2025-11-14',
  'Bastidores da mostra que reuniu jogos, curtas e instalações produzidos pelas turmas do ano.',
  'mix',
  '["A Mostra Anual 2025 reuniu mais de quarenta trabalhos entre jogos jogáveis, curtas de animação e instalações interativas. O evento ocupou o auditório e os corredores do bloco de artes da FUMEC durante uma semana aberta ao público.","Destaque para os playtests simultâneos de três estúdios estudantis de Design de Games — filas de quinze minutos e cadernos de feedback preenchidos página a página. Em Computação Gráfica, a parede de renders em formato A0 virou ponto de encontro entre ex-alunos e empresas parceiras.","A curadoria do site começa a partir do que foi exibido na mostra. Se você viu algo lá e quer ver publicado aqui, manda pelo contato."]'::jsonb,
  'published'
),
(
  'pipeline-render-tempo-real',
  'Como a turma estruturou um pipeline de render em tempo real',
  'Bastidores',
  '2025-09-02',
  'Um raio-x do fluxo de trabalho usado no projeto final de Computação Gráfica.',
  'blue',
  '["O projeto final de Computação Gráfica deste semestre exigia entrega em tempo real — não mais turntables offline. A turma montou um pipeline em três etapas: blockout no Blender, bake de materiais no Substance e composição final na engine escolhida pelo grupo.","O gargalo apareceu cedo: texturas em 4K demais para o budget de VRAM. A solução foi atlas compartilhado entre props secundários e resolução adaptativa por distância de câmera. Documentamos o fluxo para as turmas seguintes.","Este post é o primeiro de uma série de bastidores técnicos — o tipo de conteúdo que complementa o portfólio visual com o processo por trás da imagem."]'::jsonb,
  'published'
),
(
  'playtest-publico',
  'O que aprendemos testando jogos com público real',
  'Design de Games',
  '2025-06-20',
  'Notas de campo dos playtests abertos realizados pelos estúdios estudantis.',
  'violet',
  '["Três estúdios estudantis abriram playtests públicos em junho. Regra: nenhum membro da equipe podia explicar o jogo antes de cinco minutos de sessão — o tutorial tinha que funcionar sozinho.","O padrão que se repetiu: jogadores ignoravam HUD textual e respondiam imediatamente a affordances visuais. Jogos com ícones grandes e feedback sonoro claro retiveram sessões três vezes mais longas.","As notas de campo viraram checklist para o próximo ciclo de protótipos. Publicamos aqui para quem está montando playtest pela primeira vez."]'::jsonb,
  'published'
);

-- Projects
INSERT INTO public.projects (slug, title, student, category, year, tone, aspect, description, featured, featured_order, status) VALUES
('deriva-modelagem-organica', 'Nome do Projeto', 'Nome do Aluno', 'Modelagem 3D', 2025, 'blue', 'portrait', 'Estudo de modelagem orgânica e sculpting em criatura submersa, do blockout ao retopo para animação.', true, 0, 'published'),
('nucleo-concept-urbano', 'Nome do Projeto', 'Nome do Aluno', 'Concept Art', 2025, 'violet', 'landscape', 'Série de concept art para um distrito vertical fictício, explorando luz artificial e densidade urbana.', true, 1, 'published'),
('residuo-poster-serie', 'Nome do Projeto', 'Nome do Aluno', 'Posters', 2024, 'electric', 'square', 'Série de pôsteres gerados a partir de simulações de fluido em tempo real.', true, 2, 'published'),
('espectro-animacao-personagem', 'Nome do Projeto', 'Nome do Aluno', 'Animação', 2025, 'mix', 'wide', 'Ciclo de animação facial e corporal para personagem principal de curta autoral em produção.', true, 3, 'published'),
('silhueta-ilustracao-editorial', 'Nome do Projeto', 'Nome do Aluno', 'Ilustração', 2024, 'violet', 'portrait', 'Ilustração editorial digital para revista acadêmica sobre cultura gamer.', true, 4, 'published'),
('orbita-modelagem-hard-surface', 'Nome do Projeto', 'Nome do Aluno', 'Modelagem 3D', 2024, 'electric', 'square', 'Módulo hard-surface para estação orbital, com bake de texturas PBR e apresentação em turntable.', true, 5, 'published'),
('fragmento-concept-personagem', 'Nome do Projeto', 'Nome do Aluno', 'Concept Art', 2023, 'blue', 'portrait', 'Exploração de silhueta e paleta para elenco de personagens de RPG tático.', false, NULL, 'published'),
('eco-poster-tipografico', 'Nome do Projeto', 'Nome do Aluno', 'Posters', 2023, 'mix', 'landscape', 'Pôster tipográfico para a mostra anual de jogos autorais da turma.', false, NULL, 'published');

-- Games
INSERT INTO public.games (slug, title, team, genre, platform, year, tone, description, status) VALUES
('sinal-perdido', 'Nome do Projeto', 'Nome do Aluno', 'Aventura narrativa · Sci-fi', 'PC · Web', 2025, 'electric', 'Uma operadora de rádio isolada tenta reconectar postos de escuta abandonados antes que a tempestade solar apague o sinal.', 'published'),
('raiz-profunda', 'Nome do Projeto', 'Nome do Aluno', 'Puzzle · Exploração', 'PC', 2025, 'violet', 'Puzzle de manipulação de crescimento vegetal em uma floresta vertical que reage ao ritmo do jogador.', 'published'),
('ultimo-turno', 'Nome do Projeto', 'Nome do Aluno', 'Estratégia tática', 'PC', 2024, 'blue', 'Tática por turnos ambientada em uma fábrica ocupada, onde cada ação consome energia compartilhada pela equipe.', 'published'),
('maré-de-vidro', 'Nome do Projeto', 'Nome do Aluno', 'Plataforma · Atmosférico', 'PC · Console', 2024, 'mix', 'Plataforma 2.5D sobre uma cidade litorânea congelada no tempo, com física de vidro quebradiço como mecânica central.', 'published');

-- Courses
INSERT INTO public.courses (slug, name, tagline, description, modules, faq) VALUES
(
  'computacao-grafica',
  'Computação Gráfica',
  'Da malha ao render, do dado à imagem.',
  'Modelagem 3D, pipelines de renderização, simulação visual e produção de imagem técnica e artística — a base de tudo que vira mundo, produto ou tela.',
  '["Modelagem orgânica e hard-surface","Texturização e materiais PBR","Iluminação e renderização","Concept art e design visual","Animação 3D e rigging","Composição e pós-produção"]'::jsonb,
  '[{"question":"Preciso saber desenhar?","answer":"Ajuda, mas não é pré-requisito. O curso parte do fundamento visual e evolui para ferramentas digitais — muitos alunos chegam pelo interesse em 3D e games."},{"question":"Quais softwares são usados?","answer":"Blender, Substance, engines de render e ferramentas de concept variam por disciplina. O foco é pipeline e princípios, não um único programa."},{"question":"O que sai da sala?","answer":"Modelos, renders, concept sheets, animações e peças gráficas — tudo publicável no portfólio e na mostra anual."}]'::jsonb
),
(
  'design-de-games',
  'Design de Games',
  'Sistemas que viram experiência jogável.',
  'Game design, prototipagem, narrativa interativa e produção de jogos autorais do primeiro protótipo ao playtest público.',
  '["Fundamentos de game design","Prototipagem rápida","Narrativa interativa","Level design e pacing","Arte e UI para jogos","Playtest e iteração"]'::jsonb,
  '[{"question":"Preciso programar?","answer":"Conhecimento básico ajuda, mas o curso trabalha com engines acessíveis e equipes multidisciplinares — designer, artista e programador dividem o trabalho."},{"question":"Os jogos são solo ou em grupo?","answer":"Ambos. Protótipos individuais nas primeiras disciplinas; projetos finais em estúdios estudantis de 3 a 5 pessoas."},{"question":"Para onde os jogos vão depois?","answer":"Playtests abertos, mostra anual, itch.io e este site — o objetivo é ter algo jogável e publicável, não só um documento de design."}]'::jsonb
);

-- FAQ home
INSERT INTO public.faq_items (question, answer, sort_order) VALUES
('O que é a FUMEC Criativa?', 'A vitrine das produções dos cursos de Computação Gráfica e Design de Games da Universidade FUMEC, em Belo Horizonte. Modelos, curtas, jogos, posters — o que sai da sala e merece tela.', 0),
('Os trabalhos são dos alunos?', 'Sim. Cada peça foi feita por estudante, em disciplina, projeto autoral ou mostra. Os créditos são de quem fez.', 1),
('Como faço para ter um projeto aqui?', 'Se você é aluno da FUMEC de Computação Gráfica ou Design de Games, envia pelo contato. A curadoria entra na próxima leva do site.', 2),
('Computação Gráfica ou Design de Games?', 'Computação Gráfica é imagem: modelagem, concept, animação, render. Design de Games é jogável: sistemas, protótipo, playtest. Os dois se cruzam o tempo todo.', 3),
('Posso usar um trabalho que vi aqui?', 'Os direitos são dos alunos. Para divulgação, parceria ou qualquer uso, fala com a gente antes.', 4),
('Como falo com o curso?', 'Pelo formulário de contato, pelo e-mail criativa@fumec.br ou nas redes @fumeccriativa. Universidade FUMEC, Belo Horizonte.', 5);

-- Hero categories
INSERT INTO public.hero_categories (id, label, href, tone, aspect, image_url, sort_order, layout) VALUES
('01', 'Modelagem 3D', '/producoes', 'blue', 'aspect-square', '/categories/modelagem-3d.png', 1, '{"top":"32%","left":"4%","width":"14%","rotate":2,"depth":0.65,"fromX":"28vw","fromY":"4vw","driftX":-140,"driftY":40,"order":1}'::jsonb),
('02', 'Concept Art', '/producoes', 'violet', 'aspect-[4/5]', '/categories/concept-art.png', 0, '{"top":"36%","left":"22%","width":"12%","rotate":-3,"depth":0.5,"fromX":"18vw","fromY":"-6vw","driftX":-65,"driftY":60,"order":0}'::jsonb),
('03', 'Posters', '/producoes', 'electric', 'aspect-[3/4]', '/categories/posters.png', 0, '{"top":"30%","right":"22%","width":"13%","rotate":4,"depth":0.72,"fromX":"-20vw","fromY":"-8vw","driftX":70,"driftY":55,"order":0}'::jsonb),
('04', 'Animação', '/producoes', 'electric', 'aspect-video', '/categories/animacao.png', 2, '{"top":"26%","right":"2%","width":"16%","rotate":3,"depth":0.55,"fromX":"-30vw","fromY":"10vw","driftX":120,"driftY":-40,"order":2,"front":true}'::jsonb),
('05', 'Jogos', '/jogos', 'mix', 'aspect-video', '/categories/jogos.png', 1, '{"top":"72%","right":"5%","width":"15%","rotate":-2,"depth":0.6,"fromX":"-28vw","fromY":"-2vw","driftX":145,"driftY":35,"order":1,"front":true}'::jsonb);

-- Site settings
INSERT INTO public.site_settings (id, contact_email, contact_address, social_links, marquee_items, cta_title, cta_description) VALUES (
  1,
  'criativa@fumec.br',
  E'Universidade FUMEC\nBelo Horizonte, MG',
  '{"instagram":"@fumeccriativa"}'::jsonb,
  '[{"label":"MODELAGEM 3D","href":"/producoes"},{"label":"DESIGN DE GAMES","href":"/cursos/design-de-games"},{"label":"CONCEPT ART","href":"/producoes"},{"label":"JOGOS","href":"/jogos"},{"label":"COMPUTAÇÃO GRÁFICA","href":"/cursos/computacao-grafica"},{"label":"ANIMAÇÃO","href":"/producoes"},{"label":"POSTERS","href":"/producoes"},{"label":"PRODUÇÕES DOS ALUNOS","href":"/producoes"}]'::jsonb,
  E'Pronto para\nentrar em cena?',
  'Imagem ou jogo: duas formações na FUMEC, um estúdio compartilhado. Escolhe a tua e vê de perto como a turma produz.'
);

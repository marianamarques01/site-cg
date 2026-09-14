-- Garante as 5 categorias do hero (idempotente)
INSERT INTO public.hero_categories (id, label, href, tone, aspect, image_url, sort_order, layout) VALUES
('01', 'Modelagem 3D', '/producoes', 'blue', 'aspect-square', '/categories/modelagem-3d.png', 1, '{"top":"32%","left":"4%","width":"14%","rotate":2,"depth":0.65,"fromX":"28vw","fromY":"4vw","driftX":-140,"driftY":40,"order":1}'::jsonb),
('02', 'Concept Art', '/producoes', 'violet', 'aspect-[4/5]', '/categories/concept-art.png', 0, '{"top":"36%","left":"22%","width":"12%","rotate":-3,"depth":0.5,"fromX":"18vw","fromY":"-6vw","driftX":-65,"driftY":60,"order":0}'::jsonb),
('03', 'Posters', '/producoes', 'electric', 'aspect-[3/4]', '/categories/posters.png', 0, '{"top":"30%","right":"22%","width":"13%","rotate":4,"depth":0.72,"fromX":"-20vw","fromY":"-8vw","driftX":70,"driftY":55,"order":0}'::jsonb),
('04', 'Animação', '/producoes', 'electric', 'aspect-video', '/categories/animacao.png', 2, '{"top":"26%","right":"2%","width":"16%","rotate":3,"depth":0.55,"fromX":"-30vw","fromY":"10vw","driftX":120,"driftY":-40,"order":2,"front":true}'::jsonb),
('05', 'Jogos', '/jogos', 'mix', 'aspect-video', '/categories/jogos.png', 1, '{"top":"72%","right":"5%","width":"15%","rotate":-2,"depth":0.6,"fromX":"-28vw","fromY":"-2vw","driftX":145,"driftY":35,"order":1,"front":true}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  href = EXCLUDED.href,
  tone = EXCLUDED.tone,
  aspect = EXCLUDED.aspect,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order,
  layout = EXCLUDED.layout;

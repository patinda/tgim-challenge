-- Création de la table tgim_knowledge pour stocker les informations sur TGIM
CREATE TABLE IF NOT EXISTS public.tgim_knowledge (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  category text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  keywords text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT tgim_knowledge_pkey PRIMARY KEY (id)
);

-- Insertion des données TGIM
INSERT INTO public.tgim_knowledge (category, title, content, keywords) VALUES
('presentation', 'Qu''est-ce que TGIM', 'TGIM signifie "Thank God it is Monday!" - une plateforme française dédiée à la reprise d''entreprise. Nous aidons les entrepreneurs à racheter des entreprises rentables plutôt que de courir après des rêves startup.', ARRAY['tgim', 'reprise', 'entreprise', 'acquisition']),

('opportunite', 'Opportunité du marché', 'Il y a plus de 700.000 entreprises qui vont changer de main à cause des départs à la retraite dans les 10 prochaines années en France. C''est une opportunité unique pour devenir propriétaire d''une entreprise rentable.', ARRAY['retraite', 'opportunité', 'marché', '700000']),

('philosophie', 'Notre approche', 'TGIM libère les entrepreneurs du dogme startup pour leur montrer la vraie richesse : des actifs tangibles, profitables dès le premier jour. Nous nous inspirons de l''approche Codie Sanchez aux États-Unis.', ARRAY['startup', 'actifs', 'profitables', 'codie sanchez']),

('formation', 'Programme de formation', 'Le programme TGIM dure 3 mois pour apprendre, 6 mois pour trouver, 12 mois pour tout contrôler. 8 samedis intensifs de 10 heures répartis sur 4 mois, avec suivi personnalisé et accompagnement jusqu''à la reprise effective.', ARRAY['formation', 'programme', '3 mois', '6 mois', '12 mois', 'samedis']),

('competences', 'Deux compétences clés', 'En 2025, une bonne reprise passe par la maîtrise de deux compétences rares : le storytelling et la négociation. Ces compétences sont plus importantes que les bilans et plans comptables.', ARRAY['storytelling', 'négociation', 'compétences', '2025']),

('storytelling', 'Le Storytelling stratégique', 'Le storytelling n''est pas un outil marketing, c''est l''ossature stratégique d''une reprise réussie. Il faut répondre à : pourquoi cette entreprise mérite-t-elle encore d''exister ? Pourquoi suis-je légitime à la porter plus loin ?', ARRAY['storytelling', 'stratégie', 'légitimité', 'vision']),

('negociation', 'L''art de la négociation', 'Négocier, ce n''est pas arracher ni dominer, c''est construire. Il faut comprendre les véritables attentes du cédant, souvent enfouies bien au-delà du prix affiché : transmission respectueuse, reconnaissance, sécurité pour les équipes.', ARRAY['négociation', 'cédant', 'construction', 'attentes']),

('outils', 'Nos outils technologiques', 'TGIM Valuator : système d''estimation de valeur d''entreprise. TGIM Negotiator : simulateur de négociation. TGIM Scanner : plateforme de recherche d''opportunités. L''IA assiste pour l''analyse prédictive, l''automatisation et la due diligence.', ARRAY['valuator', 'negotiator', 'scanner', 'ia', 'outils']),

('financement', 'Financement sans apport', 'Nous apprenons à reprendre une entreprise sans apport personnel et sans caution, grâce à la structuration de club deals. Les repreneurs conservent entre 51% et 80% du capital selon la taille et leur expérience.', ARRAY['financement', 'apport', 'club deal', 'capital']),

('equipe', 'Notre équipe', 'Alison Tartary (CEO & Learner-in-Chief) et Oussama Ammar (El Professor) forment une complémentarité puissante : l''humilité d''apprendre en public et l''expertise confirmée. Ils incarnent les deux faces de l''entrepreneuriat moderne.', ARRAY['alison tartary', 'oussama ammar', 'équipe', 'expertise']),

('prix', 'Coût du programme', 'Le programme TGIM coûte 12 000€. Un format conçu pour les actifs, avec 8 samedis intensifs de 10 heures répartis sur 4 mois, permettant de maintenir son activité professionnelle tout en se formant.', ARRAY['prix', '12000', 'euros', 'format', 'actifs']),

('faq', 'FAQ - Expérience requise', 'Une expérience entrepreneuriale préalable n''est pas nécessaire, mais nous privilégions les candidats ayant une solide expérience professionnelle (minimum 5 ans) dans leur domaine. Cette expertise sectorielle sera un atout majeur.', ARRAY['expérience', '5 ans', 'sélection', 'expertise']),

('faq', 'FAQ - Temps partiel', 'Le programme a été conçu pour les professionnels en activité. Les sessions ont lieu le mercredi, le reste du travail peut être effectué en soirée et le week-end. L''accompagnement continue jusqu''à la finalisation de l''acquisition.', ARRAY['temps partiel', 'mercredi', 'soirée', 'week-end', 'accompagnement']),

('faq', 'FAQ - Storytelling important', 'Comme l''explique Ben Horowitz, "l''histoire n''est pas juste du marketing, l''histoire est la stratégie." Une histoire claire répond aux questions fondamentales et guide toutes les décisions stratégiques et opérationnelles.', ARRAY['ben horowitz', 'histoire', 'stratégie', 'décisions']),

('faq', 'FAQ - Négociation au-delà des chiffres', '80% des deals échouent pour des raisons non-financières. Comprendre les motivations profondes du cédant, structurer une offre qui répond à ses besoins réels (souvent émotionnels) sont des compétences qui s''apprennent.', ARRAY['80%', 'deals', 'non-financier', 'motivations', 'émotionnel']),

('citation', 'Citation Henry Kravis', '"Ne nous félicitez pas quand on achète une entreprise, félicitez-nous quand on la revend. Parce que n''importe quel idiot peut surpayer et acheter une boîte, tant qu''il lui reste assez d''argent pour le faire." - Henry Kravis', ARRAY['henry kravis', 'citation', 'revendre', 'surpayer']),

('citation', 'Citation Steve Jobs', '"The most powerful person in the world is the storyteller." - Steve Jobs', ARRAY['steve jobs', 'storyteller', 'puissant', 'citation']),

('objectif', 'Notre mission', 'Notre but est de vous aider à créer de la prospérité. TGIM, c''est l''innovation appliquée à la reprise d''entreprise : apprendre, transmettre, réussir – en public. Le lundi devrait être le jour où vous dirigez votre propre entreprise, avec le sourire !', ARRAY['mission', 'prospérité', 'innovation', 'lundi', 'sourire']);

-- Création d'un index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_tgim_knowledge_keywords ON public.tgim_knowledge USING GIN (keywords);
CREATE INDEX IF NOT EXISTS idx_tgim_knowledge_category ON public.tgim_knowledge (category);
CREATE INDEX IF NOT EXISTS idx_tgim_knowledge_title ON public.tgim_knowledge (title);

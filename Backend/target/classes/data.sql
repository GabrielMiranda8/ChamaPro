-- =====================================================================
-- ChamaPro - Dados default (data.sql)
-- Compatível com JOINED inheritance: Profissional extends Cliente extends Usuario
-- Toda linha de Profissional precisa existir em tb_usuario + tb_cliente + tb_profissional
-- Toda linha de Cliente precisa existir em tb_usuario + tb_cliente
-- Senhas em texto puro (o AuthController atual compara com .equals(), sem hash)
--
-- Requer no application.properties:
--   spring.sql.init.mode=always
--   spring.jpa.defer-datasource-initialization=true
-- =====================================================================

-- ── Serviços (catálogo) ─────────────────────────────────────────────
INSERT IGNORE INTO tb_servico (id, nome, descricao) VALUES
('a1111111-0000-0000-0000-000000000001', 'Instalação Elétrica Residencial', 'Instalação e manutenção de sistemas elétricos residenciais'),
('a1111111-0000-0000-0000-000000000002', 'Instalação Elétrica Industrial', 'Projetos e manutenção de sistemas elétricos industriais'),
('a1111111-0000-0000-0000-000000000003', 'Instalação Painéis Solares', 'Instalação e manutenção de sistemas de energia solar');


-- ── Usuários: base (tb_usuario) ──────────────────────────────────────
-- Clientes "puros"
INSERT IGNORE INTO tb_usuario (id, nome, email, senha, cpf, dt_nasc, dt_conta, nota, tipo) VALUES
('b2222222-0000-0000-0000-000000000001', 'Marcia',   'marcia@email.com',   '123456', '111.111.111-12', '1995-04-12', '2026-01-10 09:00:00', 5.0, 'CLIENTE'),
('b2222222-0000-0000-0000-000000000002', 'Maurilio', 'maurilio@email.com', '123456', '222.222.222-23', '1990-08-23', '2026-02-14 15:30:00', 5.0, 'CLIENTE'),
('b2222222-0000-0000-0000-000000000003', 'Marcelo',  'marcelo@email.com',  '123456', '333.333.333-34', '1998-11-02', '2026-03-01 18:45:00', 5.0, 'CLIENTE');

-- Profissionais (também são Usuario + Cliente, por causa da hierarquia JOINED)
INSERT IGNORE INTO tb_usuario (id, nome, email, senha, cpf, dt_nasc, dt_conta, nota, tipo) VALUES
('c3333333-0000-0000-0000-000000000001', 'Carlos Eduardo Martins da Costa', 'carlos@email.com', '123456', '444.444.444-44', '1988-02-17', '2026-01-05 08:00:00', 4.8, 'PROFISSIONAL'),
('c3333333-0000-0000-0000-000000000002', 'Kayo Raylander PisandoFofo',   'kayo@email.com', '123456', '555.555.555-55', '1992-06-30', '2026-01-20 10:15:00', 4.9, 'PROFISSIONAL'),
('c3333333-0000-0000-0000-000000000003', 'Caio Breder AcolhiMed',  'rafael.oliveira@email.com', '123456', '666.666.666-66', '1985-09-09', '2026-02-02 14:00:00', 4.7, 'PROFISSIONAL');


-- ── Cliente (tb_cliente) — id igual ao de tb_usuario, para TODOS os 6 ──
INSERT IGNORE INTO tb_cliente (id) VALUES
('b2222222-0000-0000-0000-000000000001'),
('b2222222-0000-0000-0000-000000000002'),
('b2222222-0000-0000-0000-000000000003'),
('c3333333-0000-0000-0000-000000000001'),
('c3333333-0000-0000-0000-000000000002'),
('c3333333-0000-0000-0000-000000000003');


-- ── Profissional (tb_profissional) — só os 3 que são PROFISSIONAL ──
INSERT IGNORE INTO tb_profissional (id) VALUES
('c3333333-0000-0000-0000-000000000001'),
('c3333333-0000-0000-0000-000000000002'),
('c3333333-0000-0000-0000-000000000003');


-- ── ProfissionalServico: vínculo profissional x serviço ──────────────
INSERT IGNORE INTO tb_profissional_servico (id, servico_id, profissional_id, preco, tempo_carreira) VALUES
('d4444444-0000-0000-0000-000000000001', 'a1111111-0000-0000-0000-000000000001', 'c3333333-0000-0000-0000-000000000001', 80.00,  '2015-03-10'),
('d4444444-0000-0000-0000-000000000002', 'a1111111-0000-0000-0000-000000000002', 'c3333333-0000-0000-0000-000000000001', 120.00, '2015-03-10'),
('d4444444-0000-0000-0000-000000000003', 'a1111111-0000-0000-0000-000000000003', 'c3333333-0000-0000-0000-000000000002', 70.00,  '2018-06-01'),
('d4444444-0000-0000-0000-000000000004', 'a1111111-0000-0000-0000-000000000001', 'c3333333-0000-0000-0000-000000000002', 60.00,  '2018-06-01'),
('d4444444-0000-0000-0000-000000000005', 'a1111111-0000-0000-0000-000000000002', 'c3333333-0000-0000-0000-000000000003', 55.00,  '2020-01-15');


-- ── Endereços (um por usuário, todos os 6) ────────────────────────────
INSERT IGNORE INTO tb_endereco (id, cep, rua, bairro, cidade, numero, complemento, referencia, usuario_id) VALUES
('e5555555-0000-0000-0000-000000000001', '35170-000', 'Rua das Acácias',      'Centro',        'Coronel Fabriciano', 120, NULL,       'Perto da praça central',   'b2222222-0000-0000-0000-000000000001'),
('e5555555-0000-0000-0000-000000000002', '35180-000', 'Avenida Brasil',       'Industrial',    'Timóteo',            450, 'Bloco B',  'Próximo ao terminal',      'b2222222-0000-0000-0000-000000000002'),
('e5555555-0000-0000-0000-000000000003', '35172-000', 'Rua Minas Gerais',     'Bela Vista',    'Ipatinga',            88, NULL,       NULL,                        'b2222222-0000-0000-0000-000000000003'),
('e5555555-0000-0000-0000-000000000004', '35170-100', 'Rua Sete de Setembro', 'São Cristóvão', 'Coronel Fabriciano', 305, 'Casa 2',   'Portão azul',               'c3333333-0000-0000-0000-000000000001'),
('e5555555-0000-0000-0000-000000000005', '35180-200', 'Rua José Freire',      'Iguaçu',        'Timóteo',             77, NULL,       NULL,                        'c3333333-0000-0000-0000-000000000002'),
('e5555555-0000-0000-0000-000000000006', '35172-300', 'Rua Ouro Preto',       'Cariru',        'Ipatinga',           212, 'Apto 301', 'Prédio verde',              'c3333333-0000-0000-0000-000000000003');

-- Inserir alimentos completos da tabela TACO
INSERT INTO public.alimentos (nome, categoria, calorias_por_100g, proteinas_por_100g, carboidratos_por_100g, gorduras_por_100g, fibras_por_100g, is_publico) VALUES
-- Cereais e derivados
('Arroz agulhinha cru', 'Cereais', 358, 7.3, 78.8, 0.5, 1.6, true),
('Arroz agulhinha cozido', 'Cereais', 128, 2.5, 28.1, 0.2, 1.6, true),
('Arroz integral cru', 'Cereais', 360, 7.3, 77.5, 1.9, 4.8, true),
('Arroz integral cozido', 'Cereais', 124, 2.6, 25.8, 1.0, 2.7, true),
('Aveia em flocos', 'Cereais', 394, 13.9, 67.0, 8.5, 9.1, true),
('Farinha de trigo', 'Cereais', 364, 10.3, 75.1, 1.4, 2.3, true),
('Macarrão cru', 'Cereais', 373, 12.5, 74.7, 1.8, 2.9, true),
('Macarrão cozido', 'Cereais', 111, 3.7, 22.2, 0.5, 1.7, true),
('Pão francês', 'Cereais', 300, 8.0, 58.6, 3.1, 6.5, true),
('Pão integral', 'Cereais', 253, 9.4, 43.3, 4.8, 6.9, true),

-- Leguminosas
('Feijão preto cru', 'Leguminosas', 324, 21.8, 58.1, 1.3, 21.9, true),
('Feijão preto cozido', 'Leguminosas', 77, 4.5, 14.0, 0.5, 8.4, true),
('Feijão carioca cru', 'Leguminosas', 329, 20.2, 61.2, 1.3, 18.4, true),
('Feijão carioca cozido', 'Leguminosas', 76, 4.8, 13.6, 0.5, 8.5, true),
('Lentilha crua', 'Leguminosas', 349, 24.7, 60.1, 1.1, 7.9, true),
('Lentilha cozida', 'Leguminosas', 93, 6.3, 16.3, 0.2, 7.9, true),
('Grão de bico cru', 'Leguminosas', 355, 21.2, 61.0, 5.4, 12.4, true),
('Grão de bico cozido', 'Leguminosas', 164, 8.9, 27.4, 2.6, 7.6, true),
('Soja em grão crua', 'Leguminosas', 422, 38.8, 29.5, 19.9, 20.2, true),
('Ervilha em vagem', 'Leguminosas', 88, 7.5, 15.6, 0.3, 7.5, true),

-- Carnes e derivados
('Carne bovina (alcatra)', 'Carnes', 163, 30.7, 0.0, 4.3, 0.0, true),
('Carne bovina (contrafilé)', 'Carnes', 216, 26.4, 0.0, 11.9, 0.0, true),
('Carne bovina (patinho)', 'Carnes', 141, 28.6, 0.0, 3.0, 0.0, true),
('Carne bovina (acém)', 'Carnes', 124, 26.0, 0.0, 2.8, 0.0, true),
('Frango peito sem pele', 'Carnes', 165, 31.0, 0.0, 3.6, 0.0, true),
('Frango coxa com pele', 'Carnes', 204, 18.4, 0.0, 14.2, 0.0, true),
('Frango sobrecoxa sem pele', 'Carnes', 140, 21.2, 0.0, 5.7, 0.0, true),
('Carne suína (lombo)', 'Carnes', 143, 27.4, 0.0, 3.4, 0.0, true),
('Carne suína (pernil)', 'Carnes', 178, 25.0, 0.0, 8.3, 0.0, true),
('Linguiça de porco', 'Carnes', 296, 17.1, 2.8, 24.0, 0.0, true),

-- Peixes e frutos do mar
('Salmão', 'Peixes', 211, 25.4, 0.0, 12.4, 0.0, true),
('Tilápia', 'Peixes', 96, 20.1, 0.0, 1.7, 0.0, true),
('Sardinha', 'Peixes', 135, 24.2, 0.0, 4.1, 0.0, true),
('Atum em lata', 'Peixes', 194, 29.0, 0.0, 8.1, 0.0, true),
('Bacalhau salgado', 'Peixes', 136, 29.5, 0.0, 1.4, 0.0, true),
('Camarão', 'Peixes', 83, 18.1, 0.0, 1.0, 0.0, true),
('Merluza', 'Peixes', 76, 17.8, 0.0, 0.3, 0.0, true),
('Pescada', 'Peixes', 88, 19.9, 0.0, 0.8, 0.0, true),

-- Ovos e laticínios
('Ovo de galinha inteiro', 'Ovos', 155, 13.0, 1.1, 11.0, 0.0, true),
('Clara de ovo', 'Ovos', 51, 10.9, 0.7, 0.0, 0.0, true),
('Gema de ovo', 'Ovos', 353, 16.1, 0.6, 32.0, 0.0, true),
('Leite integral', 'Laticínios', 61, 2.9, 4.3, 3.2, 0.0, true),
('Leite desnatado', 'Laticínios', 35, 2.9, 4.8, 0.2, 0.0, true),
('Iogurte natural', 'Laticínios', 51, 4.6, 3.8, 1.5, 0.0, true),
('Queijo minas frescal', 'Laticínios', 264, 17.4, 2.9, 20.2, 0.0, true),
('Queijo mussarela', 'Laticínios', 289, 25.0, 3.4, 19.5, 0.0, true),
('Requeijão cremoso', 'Laticínios', 270, 11.1, 3.0, 24.5, 0.0, true),

-- Frutas
('Banana prata', 'Frutas', 89, 1.1, 22.3, 0.3, 2.6, true),
('Maçã com casca', 'Frutas', 52, 0.3, 13.8, 0.2, 2.4, true),
('Laranja pera', 'Frutas', 37, 0.9, 8.9, 0.1, 1.0, true),
('Mamão papaia', 'Frutas', 40, 0.5, 10.4, 0.1, 1.8, true),
('Manga tommy', 'Frutas', 64, 0.4, 16.7, 0.2, 1.6, true),
('Uva itália', 'Frutas', 53, 1.8, 12.0, 0.4, 0.9, true),
('Abacaxi', 'Frutas', 48, 0.4, 12.3, 0.1, 1.0, true),
('Melancia', 'Frutas', 33, 0.8, 8.1, 0.2, 0.1, true),
('Melão', 'Frutas', 29, 0.7, 7.5, 0.1, 0.3, true),
('Morango', 'Frutas', 30, 0.9, 6.8, 0.3, 1.7, true),

-- Hortaliças
('Alface lisa', 'Hortaliças', 11, 1.6, 1.7, 0.3, 2.0, true),
('Tomate', 'Hortaliças', 15, 1.1, 3.1, 0.2, 1.2, true),
('Cenoura crua', 'Hortaliças', 34, 1.3, 7.7, 0.2, 3.2, true),
('Beterraba crua', 'Hortaliças', 32, 1.9, 6.8, 0.1, 3.4, true),
('Brócolis cozido', 'Hortaliças', 22, 1.9, 4.0, 0.4, 2.9, true),
('Couve-flor cozida', 'Hortaliças', 17, 1.3, 2.5, 0.2, 2.4, true),
('Abobrinha italiana', 'Hortaliças', 19, 1.3, 4.0, 0.2, 1.0, true),
('Pepino', 'Hortaliças', 13, 0.7, 2.9, 0.1, 0.5, true),
('Cebola', 'Hortaliças', 38, 1.7, 8.8, 0.2, 2.2, true),
('Pimentão verde', 'Hortaliças', 21, 1.2, 4.6, 0.2, 2.6, true),

-- Tubérculos
('Batata inglesa', 'Tubérculos', 52, 1.2, 11.9, 0.1, 1.3, true),
('Batata doce', 'Tubérculos', 118, 2.0, 28.2, 0.1, 2.2, true),
('Mandioca', 'Tubérculos', 125, 0.8, 30.1, 0.3, 1.6, true),
('Inhame', 'Tubérculos', 97, 2.3, 23.2, 0.1, 0.7, true),
('Cará', 'Tubérculos', 116, 2.1, 27.9, 0.1, 3.9, true),

-- Óleos e gorduras
('Azeite de oliva', 'Óleos', 884, 0.0, 0.0, 100.0, 0.0, true),
('Óleo de soja', 'Óleos', 884, 0.0, 0.0, 100.0, 0.0, true),
('Óleo de girassol', 'Óleos', 884, 0.0, 0.0, 100.0, 0.0, true),
('Margarina', 'Óleos', 596, 0.9, 0.6, 65.0, 0.0, true),
('Manteiga', 'Óleos', 760, 0.6, 0.1, 84.0, 0.0, true),

-- Oleaginosas
('Amendoim torrado', 'Oleaginosas', 544, 23.9, 20.3, 43.9, 8.0, true),
('Castanha do Brasil', 'Oleaginosas', 643, 14.5, 15.0, 63.5, 7.9, true),
('Castanha de caju', 'Oleaginosas', 570, 18.5, 28.7, 43.8, 3.7, true),
('Amêndoa', 'Oleaginosas', 640, 19.0, 19.5, 53.4, 11.6, true),
('Nozes', 'Oleaginosas', 654, 14.0, 18.5, 59.0, 6.0, true),

-- Açúcares e doces
('Açúcar cristal', 'Açúcares', 387, 0.0, 99.5, 0.0, 0.0, true),
('Mel de abelha', 'Açúcares', 309, 0.4, 84.0, 0.0, 0.4, true),
('Chocolate ao leite', 'Açúcares', 535, 7.3, 59.7, 29.7, 2.4, true),

-- Bebidas
('Café coado', 'Bebidas', 4, 0.2, 0.6, 0.0, 0.0, true),
('Chá mate', 'Bebidas', 2, 0.3, 0.4, 0.0, 0.0, true),
('Suco de laranja natural', 'Bebidas', 37, 0.5, 8.7, 0.2, 0.1, true),

-- Condimentos
('Sal refinado', 'Condimentos', 0, 0.0, 0.0, 0.0, 0.0, true),
('Vinagre de álcool', 'Condimentos', 4, 0.0, 1.0, 0.0, 0.0, true),
('Alho', 'Condimentos', 113, 5.1, 23.9, 0.2, 4.3, true);

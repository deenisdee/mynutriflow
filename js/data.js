// ============================================
// ARQUIVO: js/data.js - VERSÃO COMPLETA
// ============================================
// 46 RECEITAS TOTAIS (6 originais + 40 novas)

const RECIPES = [
   {
    id: 1,
    name: 'Bowl de Açaí Proteico',
    category: 'Café da Manhã',
    calories: 320,
    protein: 25,
    carbs: 42,
    fats: 8,
    fiber: 6,
    time: 10,
    servings: 1,
    difficulty: 'Fácil',

    featured: true,
    description: 'Bowl cremoso de açaí com 25g de proteína, perfeito para pós-treino',
    
    tags: [
        'Post-treino',
        'Energético',
        'Antioxidante',
        'Rico em proteína'
    ],
    
    benefits: [
        'Acelera recuperação muscular',
        'Rico em antioxidantes naturais',
        'Energia prolongada sem picos de insulina',
        'Ajuda na queima de gordura'
    ],
    
    allergens: [
        'Leite (opcional)',
        'Oleaginosas'
    ],
    
    image: 'https://images.unsplash.com/photo-1768134459263-34278a332e4c?q=80',
    
    // 👇 NOVA ESTRUTURA DE INGREDIENTES COM ÍCONES
    ingredients: [
        { 
            icon: 'droplets',
            quantity: '200g',
            text: 'de polpa de açaí puro (sem xarope de guaraná)'
        },
        { 
            icon: 'zap',
            quantity: '1 scoop (30g)',
            text: 'de whey protein sabor baunilha ou neutro'
        },
        { 
            icon: 'banana',
            quantity: '1 unidade (100g)',
            text: 'banana congelada média'
        },
        { 
            icon: 'milk',
            quantity: '50ml',
            text: 'de leite de amêndoas sem açúcar'
        },
        { 
            icon: 'wheat',
            quantity: '2 colheres sopa (20g)',
            text: 'de granola sem açúcar'
        },
        { 
            icon: 'nut',
            quantity: '1 colher chá',
            text: 'de pasta de amendoim integral'
        },
        { 
            icon: 'apple',
            quantity: '50g total',
            text: 'frutas frescas: morango, kiwi, banana'
        },
        { 
            icon: 'droplet',
            quantity: '1 colher chá',
            text: 'de mel puro',
            optional: true
        },
        { 
            icon: 'circle',
            quantity: 'a gosto',
            text: 'coco ralado sem açúcar para finalizar',
            optional: true
        }
    ],
    
    instructions: [
        'Corte a banana em rodelas e congele por pelo menos 2 horas antes do preparo',
        'No liquidificador ou processador, adicione a polpa de açaí semi-descongelada (textura cremosa, não líquida)',
        'Adicione a banana congelada, whey protein e leite de amêndoas',
        'Bata em velocidade média por 30-45 segundos até obter consistência cremosa e homogênea (similar a sorvete)',
        'Se ficar muito grosso, adicione 10ml de leite por vez até atingir a textura ideal',
        'Despeje em uma tigela funda (bowl)',
        'Decore com granola em uma metade e frutas frescas na outra',
        'Finalize com a pasta de amendoim por cima e opcional mel em fio',
        'Sirva imediatamente para manter a temperatura ideal'
    ],
    
    tips: [
        '🔥 Dica Pro: Congele a banana cortada em rodelas para facilitar',
        '💪 Para mais proteína: adicione 1 colher de pasta de amendoim',
        '⚡ Post-treino: adicione 5g de creatina monohidratada',
        '🥤 Versão smoothie: adicione 100ml de leite para textura líquida',
        '❄️ Textura perfeita: açaí semi-congelado (não totalmente duro)'
    ],
    
    // 👇 FOTOS DAS ETAPAS (quando gerar no Leonardo.ai)
    images: {
        hero: 'https://images.unsplash.com/photo-1768134459263-34278a332e4c?q=80',
        steps: [ ]
    },
    
    macros: {
        breakfast: '30% proteína, 55% carboidratos, 15% gorduras',
        postWorkout: 'Perfeito para janela anabólica (até 1h pós-treino)'
    }
},
    {
        id: 2,
        name: 'Frango Grelhado com Batata Doce',
        category: 'Almoço',
        calories: 450,
        protein: 45,
        carbs: 38,
        fats: 12,
        fiber: 7,
        time: 30,
        servings: 2,
        difficulty: 'Médio',
        featured: false,
        tags: [
                'Alto teor proteico',
                'Ganho de massa',
                'Pré-treino',
                'Refeição completa'
            ],
        benefits: [
                'Proteína de alta qualidade para ganho muscular',
                'Carboidratos de baixo índice glicêmico',
                'Rico em vitaminas A e C (batata doce)',
                'Saciedade prolongada por até 4 horas'
            ],
        allergens: [],
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80',
        ingredients: [
                '300g de peito de frango (aproximadamente 2 filés médios)',
                '2 batatas doces médias (400g total)',
                '200g de brócolis frescos',
                '2 dentes de alho picados',
                '1 colher de sopa de azeite extra virgem',
                '1 limão (suco)',
                'Temperos: sal rosa do Himalaia, pimenta-do-reino, páprica doce, alecrim fresco',
                '1 colher de chá de mostarda Dijon (opcional para marinada)',
                'Ervas frescas: tomilho, orégano ou manjericão a gosto'
            ],
        instructions: [
                'MARINADA: Em um bowl, misture o frango com suco de limão, alho, mostarda, sal, pimenta e páprica',
                'Deixe marinar na geladeira por mínimo 20 minutos (ideal: 2 horas) coberto com filme plástico',
                'Pré-aqueça o forno a 200°C enquanto prepara as batatas',
                'Descasque e corte as batatas doces em cubos de 2cm (tamanho uniforme para cozimento igual)',
                'Em uma assadeira, disponha as batatas, regue com metade do azeite, sal, páprica e alecrim',
                'Leve ao forno por 25-30 minutos, virando na metade do tempo até ficarem douradas',
                'Enquanto isso, aqueça uma grelha ou frigideira antiaderente em fogo médio-alto',
                'Grelhe o frango por 6-8 minutos de cada lado até atingir 74°C internamente (use termômetro)',
                'Nos últimos 5 minutos, cozinhe o brócolis no vapor (não deixe amolecer muito)',
                'Retire o frango e deixe descansar por 3-5 minutos antes de cortar (mantém suculência)',
                'Monte o prato: base de brócolis, batatas ao lado, frango fatiado por cima',
                'Finalize com fio de azeite extra virgem e ervas frescas picadas'
            ],
        tips: [
                '🔥 Dica Pro: Use termômetro culinário - 74°C = frango perfeito e suculento',
                '💪 Ganho de massa: aumente para 400g de frango',
                '🥔 Batata crocante: seque bem após lavar e use papel toalha',
                '⏱️ Meal prep: prepare 4 porções e armazene por até 4 dias',
                '🌿 Variação: substitua brócolis por aspargos ou vagem'
            ],
        macros: {
            lunch: '40% proteína, 35% carboidratos, 25% gorduras',
            preworkout: 'Consuma 1-2h antes do treino para energia sustentada'
        },
        mealPrepTips: [
                'Armazene em potes de vidro separados (dura 4 dias)',
                'Congele o frango cru marinado (até 3 meses)',
                'Reaqueça no forno (microondas resseca o frango)'
            ]
    },
    {
        id: 3,
        name: 'Omelete de Claras Fitness',
        category: 'Café da Manhã',
        calories: 180,
        protein: 28,
        carbs: 8,
        fats: 4,
        fiber: 2,
        time: 15,
        servings: 1,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Baixa caloria',
                'Alto teor proteico',
                'Low carb',
                'Definição muscular'
            ],
        benefits: [
                'Máxima proteína com mínimas calorias',
                'Zero gordura saturada',
                'Rico em vitaminas do complexo B',
                'Acelera metabolismo pela manhã'
            ],
        allergens: [
                'Ovos',
                'Laticínios'
            ],
        image: 'https://images.unsplash.com/photo-1583427548995-7210c027bd1f?q=80',
        ingredients: [
                '5 claras de ovo grandes (aproximadamente 150ml)',
                '1 ovo inteiro caipira',
                '1 xícara (30g) de espinafre fresco bem lavado',
                '5 tomates cereja cortados ao meio',
                '2 colheres de sopa (40g) de queijo cottage light',
                '1 pitada de sal rosa do Himalaia',
                'Pimenta-do-reino moída na hora',
                '1/2 colher de chá de azeite de oliva ou spray antiaderente',
                'Opcional: cebola roxa picada (10g)',
                'Opcional: orégano seco e manjericão fresco'
            ],
        instructions: [
                'Separe as claras das gemas com cuidado (reserve gemas para outras receitas)',
                'Em um bowl, bata as claras e o ovo inteiro com um garfo por 30 segundos até espumar levemente',
                'Tempere com sal e pimenta (não exagere no sal)',
                'Pique o espinafre em tiras médias e os tomates ao meio',
                'Aqueça uma frigideira antiaderente de 20cm em fogo médio por 2 minutos',
                'Adicione o azeite ou spray e espalhe com papel toalha',
                'Despeje a mistura de ovos na frigideira quente',
                'Cozinhe em fogo médio-baixo por 2-3 minutos sem mexer',
                'Quando as bordas começarem a dourar, adicione espinafre, tomate e cottage em metade da omelete',
                'Com uma espátula de silicone, dobre a omelete ao meio cuidadosamente',
                'Cozinhe por mais 1-2 minutos até o recheio aquecer',
                'Deslize para o prato, finalize com orégano e manjericão fresco'
            ],
        tips: [
                '🍳 Segredo da textura: fogo médio-baixo (fogo alto = omelete borrachuda)',
                '💧 Clara espumosa: bata com garfo, não liquidificador',
                '🧀 Versão vegana: troque cottage por tofu amassado',
                '🌶️ Mais sabor: adicione jalapeño ou pimenta calabresa',
                '⏱️ Meal prep: claras duram 4 dias na geladeira em pote fechado'
            ],
        macros: {
            breakfast: '60% proteína, 20% carboidratos, 20% gorduras',
            cutting: 'Ideal para fase de definição muscular'
        },
        variations: [
                'Versão mexicana: adicione pico de gallo e abacate',
                'Versão mediterrânea: tomate seco, azeitona e feta light',
                'Versão proteica: adicione 30g de peito de peru fatiado'
            ]
    },
    {
        id: 4,
        name: 'Salmão Grelhado',
        category: 'Jantar',
        calories: 380,
        protein: 35,
        carbs: 12,
        fats: 22,
        fiber: 4,
        time: 25,
        servings: 2,
        difficulty: 'Médio',
        featured: false,
        tags: [
                'Ômega-3',
                'Anti-inflamatório',
                'Jantar leve',
                'Saúde cardiovascular'
            ],
        benefits: [
                'Rico em ômega-3 EPA e DHA',
                'Reduz inflamação muscular',
                'Melhora saúde do coração',
                'Acelera recuperação pós-treino'
            ],
        allergens: [
                'Peixe'
            ],
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
        ingredients: [
                '2 filés de salmão fresco (150g cada)',
                '200g de aspargos frescos',
                '1 limão siciliano',
                '2 colheres de sopa de azeite extra virgem',
                '3 dentes de alho picados',
                'Ervas frescas: tomilho e endro',
                'Sal rosa do Himalaia',
                'Pimenta-do-reino moída',
                'Opcional: 100g de arroz integral'
            ],
        instructions: [
                'Pré-aqueça o forno a 200°C',
                'Lave e seque os filés de salmão',
                'Em um bowl, misture suco de 1/2 limão, azeite, alho, sal e pimenta',
                'Marine o salmão por 10 minutos',
                'Corte aspargos em hastes, descarte a parte dura',
                'Em uma assadeira, disponha os aspargos, regue com azeite e sal',
                'Coloque o salmão sobre os aspargos',
                'Asse por 15-18 minutos até o salmão ficar rosado no centro',
                'Finalize com ervas frescas e fatias de limão'
            ],
        tips: [
                '🐟 Ponto perfeito: 63°C no termômetro = salmão suculento',
                '🌿 Substitua aspargos por brócolis ou vagem',
                '🍋 Limão siciliano > limão taiti (mais suave)',
                '❄️ Salmão congelado: descongele 24h na geladeira',
                '⏱️ Meal prep: dura 2 dias refrigerado'
            ],
        macros: {
            dinner: '45% proteína, 15% carboidratos, 40% gorduras boas'
        }
    },
    {
        id: 5,
        name: 'Panqueca Proteica de Aveia',
        category: 'Café da Manhã',
        calories: 280,
        protein: 22,
        carbs: 30,
        fats: 8,
        fiber: 5,
        time: 20,
        servings: 2,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Café da manhã',
                'Energia sustentada',
                'Proteína'
            ],
        benefits: [
                'Boa dose de proteína para saciedade e recuperação muscular',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Ótimo para começar o dia com energia estável'
            ],
        allergens: [
                'Leite/Laticínios',
                'Ovos',
                'Glúten (pode conter)'
            ],
        image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&q=80',
        ingredients: [
                '3 ovos',
                '50g de aveia',
                '1 scoop de whey',
                '1 banana',
                'Canela',
                'Mel para servir'
            ],
        instructions: [
                'Bata todos ingredientes no liquidificador',
                'Deixe descansar por 5 minutos',
                'Aqueça frigideira antiaderente',
                'Despeje porções da massa',
                'Cozinhe 2 minutos cada lado',
                'Sirva com mel e frutas'
            ],
        tips: [
                '🥣 Mais saciedade: acrescente 1 colher de chia ou linhaça',
                '💪 Ajuste o whey: use sem sabor para receitas salgadas e baunilha/choco para doces',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            breakfast: '31% proteína, 43% carboidratos, 26% gorduras',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão low carb: reduza a banana e use morango ou abacate',
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 6,
        name: 'Bowl Vegano de Quinoa',
        category: 'Veganas',
        calories: 420,
        protein: 18,
        carbs: 60,
        fats: 12,
        fiber: 8,
        time: 35,
        servings: 2,
        difficulty: 'Médio',
        featured: false,
        tags: [
                'Ganho de peso',
                'Vegano',
                'Rico em fibras',
                'Energia sustentada'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Gorduras boas: apoio à saúde cardiovascular e hormonal',
                'Fonte vegetal de nutrientes e micronutrientes essenciais'
            ],
        allergens: [],
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
        ingredients: [
                '1 xícara de quinoa',
                'Grão de bico assado',
                'Abacate fatiado',
                'Tomate cereja',
                'Rúcula',
                'Tahine para molho'
            ],
        instructions: [
                'Cozinhe a quinoa conforme embalagem',
                'Tempere e asse o grão de bico',
                'Prepare o molho de tahine',
                'Monte o bowl com todos ingredientes',
                'Regue com o molho',
                'Finalize com sementes'
            ],
        tips: [
                '🥑 Abacate no ponto: use bem maduro para cremosidade e melhor sabor',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '17% proteína, 57% carboidratos, 26% gorduras'
        },
        variations: [],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 7,
        name: 'Tapioca Fit Recheada',
        category: 'Café da Manhã',
        calories: 210,
        protein: 15,
        carbs: 22,
        fats: 7,
        fiber: 5,
        time: 10,
        servings: 1,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Emagrecimento',
                'Definição',
                'Café da manhã',
                'Baixa caloria',
                'Low carb',
                'Rápido'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Ótimo para começar o dia com energia estável'
            ],
        allergens: [
                'Leite/Laticínios',
                'Ovos'
            ],
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
        ingredients: [
                '4 colheres de goma de tapioca',
                '2 ovos mexidos',
                'Queijo cottage',
                'Tomate picado',
                'Orégano',
                'Sal a gosto'
            ],
        instructions: [
                'Aqueça frigideira antiaderente',
                'Espalhe a tapioca uniformemente',
                'Aguarde formar uma película',
                'Recheie com ovos mexidos e cottage',
                'Adicione tomate e orégano',
                'Dobre ao meio e sirva'
            ],
        tips: [
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            breakfast: '28% proteína, 42% carboidratos, 30% gorduras'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 8,
        name: 'Vitamina Verde Detox',
        category: 'Café da Manhã',
        calories: 180,
        protein: 12,
        carbs: 22,
        fats: 5,
        fiber: 5,
        time: 5,
        servings: 1,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Café da manhã',
                'Baixa caloria',
                'Low carb',
                'Rápido',
                'Energia sustentada',
                'Proteína'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Ótimo para começar o dia com energia estável'
            ],
        allergens: [
                'Leite/Laticínios'
            ],
        image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&q=80',
        ingredients: [
                '1 banana',
                '1 folha de couve',
                '200ml de leite de coco',
                '1 scoop de whey baunilha',
                '1 col de linhaça',
                'Gelo a gosto'
            ],
        instructions: [
                'Lave bem a couve',
                'Coloque todos ingredientes no liquidificador',
                'Bata até ficar homogêneo',
                'Sirva imediatamente'
            ],
        tips: [
                '💪 Ajuste o whey: use sem sabor para receitas salgadas e baunilha/choco para doces',
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            breakfast: '27% proteína, 49% carboidratos, 25% gorduras'
        },
        variations: [
                'Versão low carb: reduza a banana e use morango ou abacate',
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 9,
        name: 'Pão de Queijo Proteico',
        category: 'Café da Manhã',
        calories: 250,
        protein: 20,
        carbs: 22,
        fats: 9,
        fiber: 3,
        time: 25,
        servings: 6,
        difficulty: 'Médio',
        featured: false,
        tags: [
                'Emagrecimento',
                'Definição',
                'Café da manhã',
                'Low carb',
                'Proteína'
            ],
        benefits: [
                'Boa dose de proteína para saciedade e recuperação muscular',
                'Ótimo para começar o dia com energia estável'
            ],
        allergens: [
                'Leite/Laticínios',
                'Ovos',
                'Glúten (pode conter)'
            ],
        image: 'https://images.unsplash.com/photo-1760445530213-bd887eec98fa?q=80',
        ingredients: [
                '2 ovos',
                '100g de queijo minas',
                '50g de polvilho doce',
                '2 scoops de whey sem sabor',
                '50ml de leite desnatado',
                'Sal a gosto'
            ],
        instructions: [
                'Pré-aqueça o forno a 180°C',
                'Bata todos ingredientes no liquidificador',
                'Despeje em forminhas de silicone',
                'Asse por 20-25 minutos',
                'Deixe esfriar antes de desenformar',
                'Sirva morno ou frio'
            ],
        tips: [
                '🔥 Dica Pro: pré-aqueça o forno para garantir textura uniforme',
                '💪 Ajuste o whey: use sem sabor para receitas salgadas e baunilha/choco para doces',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            breakfast: '32% proteína, 35% carboidratos, 33% gorduras',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 10,
        name: 'Mingau de Aveia com Frutas',
        category: 'Café da Manhã',
        calories: 290,
        protein: 14,
        carbs: 40,
        fats: 8,
        fiber: 7,
        time: 12,
        servings: 1,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Café da manhã',
                'Rico em fibras',
                'Energia sustentada'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Ótimo para começar o dia com energia estável'
            ],
        allergens: [
                'Leite/Laticínios',
                'Glúten (pode conter)'
            ],
        image: 'https://plus.unsplash.com/premium_photo-1663841165436-95ccbc1bbd1c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: [
                '50g de aveia em flocos',
                '250ml de leite desnatado',
                '1 banana fatiada',
                'Canela em pó',
                '1 col de mel',
                'Frutas vermelhas para decorar'
            ],
        instructions: [
                'Aqueça o leite em uma panela',
                'Adicione a aveia e mexa bem',
                'Cozinhe por 5-7 minutos mexendo sempre',
                'Desligue e adicione a banana',
                'Polvilhe canela',
                'Sirva com mel e frutas vermelhas'
            ],
        tips: [
                '🥣 Mais saciedade: acrescente 1 colher de chia ou linhaça',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            breakfast: '19% proteína, 56% carboidratos, 25% gorduras'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 11,
        name: 'Crepioca de Banana',
        category: 'Café da Manhã',
        calories: 220,
        protein: 16,
        carbs: 26,
        fats: 6,
        fiber: 3,
        time: 8,
        servings: 1,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Emagrecimento',
                'Definição',
                'Café da manhã',
                'Baixa caloria',
                'Rápido',
                'Energia sustentada'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Ótimo para começar o dia com energia estável'
            ],
        allergens: [
                'Ovos',
                'Oleaginosas'
            ],
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
        ingredients: [
                '1 ovo',
                '2 col de tapioca',
                '1 banana amassada',
                'Canela',
                'Mel (opcional)',
                'Pasta de amendoim'
            ],
        instructions: [
                'Bata o ovo com a tapioca',
                'Despeje em frigideira quente',
                'Espalhe a banana amassada',
                'Polvilhe canela',
                'Dobre ao meio quando firmar',
                'Sirva com pasta de amendoim'
            ],
        tips: [
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            breakfast: '29% proteína, 47% carboidratos, 24% gorduras'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 12,
        name: 'Iogurte Grego com Granola',
        category: 'Café da Manhã',
        calories: 260,
        protein: 20,
        carbs: 27,
        fats: 8,
        fiber: 7,
        time: 5,
        servings: 1,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Café da manhã',
                'Rico em fibras',
                'Rápido'
            ],
        benefits: [
                'Boa dose de proteína para saciedade e recuperação muscular',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Gorduras boas: apoio à saúde cardiovascular e hormonal',
                'Ótimo para começar o dia com energia estável'
            ],
        allergens: [
                'Leite/Laticínios',
                'Oleaginosas',
                'Glúten (pode conter)'
            ],
        image: 'https://images.unsplash.com/photo-1593450298063-4e08a162a437?q=80',
        ingredients: [
                '200g de iogurte grego natural',
                '3 col de granola sem açúcar',
                'Frutas vermelhas',
                '1 col de mel',
                'Sementes de chia',
                'Castanhas picadas'
            ],
        instructions: [
                'Coloque o iogurte em uma tigela',
                'Adicione a granola',
                'Distribua as frutas vermelhas',
                'Regue com mel',
                'Finalize com chia e castanhas',
                'Sirva imediatamente'
            ],
        tips: [
                '🥣 Mais saciedade: acrescente 1 colher de chia ou linhaça',
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            breakfast: '31% proteína, 42% carboidratos, 28% gorduras',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 13,
        name: 'Toast de Abacate com Ovo',
        category: 'Café da Manhã',
        calories: 310,
        protein: 18,
        carbs: 35,
        fats: 11,
        fiber: 3,
        time: 10,
        servings: 1,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Café da manhã',
                'Rápido',
                'Proteína'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Gorduras boas: apoio à saúde cardiovascular e hormonal',
                'Ótimo para começar o dia com energia estável'
            ],
        allergens: [
                'Ovos',
                'Glúten (pode conter)'
            ],
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&q=80',
        ingredients: [
                '2 fatias de pão integral',
                '1 abacate maduro',
                '2 ovos',
                'Limão',
                'Pimenta do reino',
                'Sal rosa'
            ],
        instructions: [
                'Toste o pão integral',
                'Amasse o abacate com limão, sal e pimenta',
                'Prepare os ovos pochê ou mexidos',
                'Espalhe o abacate no pão',
                'Coloque os ovos por cima',
                'Sirva com pimenta a gosto'
            ],
        tips: [
                '🥑 Abacate no ponto: use bem maduro para cremosidade e melhor sabor',
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            breakfast: '23% proteína, 45% carboidratos, 32% gorduras'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 14,
        name: 'Smoothie Bowl de Morango',
        category: 'Café da Manhã',
        calories: 300,
        protein: 22,
        carbs: 33,
        fats: 9,
        fiber: 5,
        time: 8,
        servings: 1,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Café da manhã',
                'Rápido',
                'Energia sustentada',
                'Proteína'
            ],
        benefits: [
                'Boa dose de proteína para saciedade e recuperação muscular',
                'Ótimo para começar o dia com energia estável'
            ],
        allergens: [
                'Leite/Laticínios',
                'Glúten (pode conter)'
            ],
        image: 'https://images.unsplash.com/photo-1622484212839-2425bcf558f3?q=80',
        ingredients: [
                '200g de morangos congelados',
                '1 banana congelada',
                '1 scoop de whey morango',
                '100ml de leite de coco',
                'Toppings: granola, frutas, coco',
                'Sementes a gosto'
            ],
        instructions: [
                'Bata frutas congeladas com whey e leite',
                'A mistura deve ficar bem espessa',
                'Despeje em uma tigela',
                'Decore com granola e frutas frescas',
                'Adicione coco ralado e sementes',
                'Sirva imediatamente com colher'
            ],
        tips: [
                '💪 Ajuste o whey: use sem sabor para receitas salgadas e baunilha/choco para doces',
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            breakfast: '29% proteína, 44% carboidratos, 27% gorduras',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão low carb: reduza a banana e use morango ou abacate',
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 15,
        name: 'Peito de Peru com Legumes',
        category: 'Almoço',
        calories: 380,
        protein: 42,
        carbs: 22,
        fats: 14,
        fiber: 5,
        time: 30,
        servings: 2,
        difficulty: 'Médio',
        featured: true,
        tags: [
                'Hipertrofia',
                'Almoço',
                'Alto teor proteico',
                'Low carb'
            ],
        benefits: [
                'Alto teor proteico para manutenção e ganho de massa magra',
                'Gorduras boas: apoio à saúde cardiovascular e hormonal',
                'Refeição completa: sustenta por horas sem beliscar'
            ],
        allergens: [],
        image: 'https://images.unsplash.com/photo-1670398564097-0762e1b30b3a?q=80',
        ingredients: [
                '400g de peito de peru',
                'Abobrinha',
                'Cenoura',
                'Vagem',
                'Alho e cebola',
                'Azeite e temperos'
            ],
        instructions: [
                'Corte o peru em cubos',
                'Tempere com alho, sal e pimenta',
                'Refogue a cebola no azeite',
                'Adicione o peru e doure',
                'Acrescente os legumes cortados',
                'Cozinhe até ficarem al dente'
            ],
        tips: [
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            lunch: '44% proteína, 23% carboidratos, 33% gorduras',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 16,
        name: 'Atum com Salada de Grão de Bico',
        category: 'Almoço',
        calories: 340,
        protein: 35,
        carbs: 28,
        fats: 10,
        fiber: 7,
        time: 15,
        servings: 2,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Hipertrofia',
                'Almoço',
                'Alto teor proteico',
                'Rico em fibras',
                'Proteína'
            ],
        benefits: [
                'Alto teor proteico para manutenção e ganho de massa magra',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Gorduras boas: apoio à saúde cardiovascular e hormonal',
                'Refeição completa: sustenta por horas sem beliscar'
            ],
        allergens: [
                'Peixe'
            ],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
        ingredients: [
                '2 latas de atum em água',
                '1 lata de grão de bico',
                'Tomate cereja',
                'Pepino',
                'Cebola roxa',
                'Azeite e limão'
            ],
        instructions: [
                'Escorra o atum e o grão de bico',
                'Pique os legumes em cubos pequenos',
                'Misture todos ingredientes',
                'Tempere com azeite, limão e sal',
                'Adicione ervas frescas',
                'Sirva gelado'
            ],
        tips: [
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            lunch: '41% proteína, 33% carboidratos, 26% gorduras',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 17,
        name: 'Filé Mignon ao Molho Madeira',
        category: 'Jantar',
        calories: 420,
        protein: 45,
        carbs: 33,
        fats: 12,
        fiber: 3,
        time: 35,
        servings: 2,
        difficulty: 'Médio',
        featured: false,
        tags: [
                'Hipertrofia',
                'Ganho de peso',
                'Jantar',
                'Alto teor proteico'
            ],
        benefits: [
                'Alto teor proteico para manutenção e ganho de massa magra',
                'Refeição completa: sustenta por horas sem beliscar'
            ],
        allergens: [
                'Leite/Laticínios'
            ],
        image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=800&q=80',
        ingredients: [
                '2 filés mignon (150g cada)',
                '100ml de vinho Madeira',
                'Cogumelos frescos',
                'Creme de leite light',
                'Manteiga e alho',
                'Sal e pimenta'
            ],
        instructions: [
                'Tempere os filés com sal e pimenta',
                'Sele na manteiga até o ponto desejado',
                'Reserve os filés',
                'Na mesma panela, refogue os cogumelos',
                'Adicione o vinho e deixe reduzir',
                'Finalize com creme de leite e sirva'
            ],
        tips: [
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            dinner: '43% proteína, 31% carboidratos, 26% gorduras',
            preworkout: 'Consuma 1-2h antes do treino para energia e performance',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 18,
        name: 'Tilápia com Crosta de Ervas',
        category: 'Jantar',
        calories: 290,
        protein: 38,
        carbs: 12,
        fats: 10,
        fiber: 3,
        time: 25,
        servings: 2,
        difficulty: 'Médio',
        featured: false,
        tags: [
                'Hipertrofia',
                'Jantar',
                'Alto teor proteico',
                'Low carb'
            ],
        benefits: [
                'Alto teor proteico para manutenção e ganho de massa magra',
                'Gorduras boas: apoio à saúde cardiovascular e hormonal',
                'Refeição completa: sustenta por horas sem beliscar'
            ],
        allergens: [
                'Glúten (pode conter)',
                'Peixe'
            ],
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
        ingredients: [
                '2 filés de tilápia',
                '2 col de farinha de rosca integral',
                'Salsinha e cebolinha',
                'Alho',
                'Limão',
                'Azeite'
            ],
        instructions: [
                'Tempere os filés com limão e alho',
                'Misture farinha com ervas picadas',
                'Cubra os filés com a mistura',
                'Regue com azeite',
                'Asse a 200°C por 15-20 minutos',
                'Sirva com legumes no vapor'
            ],
        tips: [
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            dinner: '52% proteína, 17% carboidratos, 31% gorduras',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 19,
        name: 'Risoto de Frango Light',
        category: 'Almoço',
        calories: 410,
        protein: 32,
        carbs: 44,
        fats: 12,
        fiber: 3,
        time: 40,
        servings: 3,
        difficulty: 'Médio',
        featured: false,
        tags: [
                'Hipertrofia',
                'Ganho de peso',
                'Almoço',
                'Alto teor proteico',
                'Proteína'
            ],
        benefits: [
                'Alto teor proteico para manutenção e ganho de massa magra',
                'Refeição completa: sustenta por horas sem beliscar'
            ],
        allergens: [
                'Leite/Laticínios'
            ],
        image: 'https://images.unsplash.com/photo-1637361874063-e5e415d7bcf7?q=80',
        ingredients: [
                '200g de arroz arbóreo',
                '300g de frango em cubos',
                'Caldo de legumes',
                'Cebola e alho',
                'Vinho branco',
                'Queijo parmesão light'
            ],
        instructions: [
                'Refogue a cebola e alho',
                'Adicione o frango e doure',
                'Acrescente o arroz e toste',
                'Adicione vinho e deixe evaporar',
                'Vá adicionando caldo aos poucos',
                'Finalize com queijo ralado'
            ],
        tips: [
                '🍗 Para ficar suculento: não fure o frango e deixe descansar 3 min antes de cortar',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            lunch: '31% proteína, 43% carboidratos, 26% gorduras',
            preworkout: 'Consuma 1-2h antes do treino para energia e performance'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 20,
        name: 'Espaguete de Abobrinha ao Pesto',
        category: 'Veganas',
        calories: 280,
        protein: 15,
        carbs: 32,
        fats: 10,
        fiber: 8,
        time: 20,
        servings: 2,
        difficulty: 'Fácil',
        featured: true,
        tags: [
                'Vegano',
                'Rico em fibras'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Gorduras boas: apoio à saúde cardiovascular e hormonal',
                'Fonte vegetal de nutrientes e micronutrientes essenciais'
            ],
        allergens: [
                'Leite/Laticínios',
                'Oleaginosas'
            ],
        image: 'https://images.unsplash.com/photo-1766300284417-23e4e7619a30?q=80',
        ingredients: [
                '3 abobrinhas médias',
                'Manjericão fresco',
                'Castanhas',
                'Alho',
                'Azeite',
                'Queijo parmesão'
            ],
        instructions: [
                'Corte as abobrinhas em espiral (spiralizer)',
                'Bata manjericão, castanhas, alho e azeite',
                'Faça um pesto cremoso',
                'Refogue levemente a abobrinha',
                'Misture com o pesto',
                'Sirva com queijo ralado'
            ],
        tips: [
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '22% proteína, 46% carboidratos, 32% gorduras'
        },
        variations: [],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 21,
        name: 'Hambúrguer Caseiro Fitness',
        category: 'Almoço',
        calories: 350,
        protein: 40,
        carbs: 25,
        fats: 10,
        fiber: 5,
        time: 25,
        servings: 4,
        difficulty: 'Médio',
        featured: false,
        tags: [
                'Hipertrofia',
                'Almoço',
                'Alto teor proteico',
                'Low carb',
                'Energia sustentada',
                'Proteína'
            ],
        benefits: [
                'Alto teor proteico para manutenção e ganho de massa magra',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Refeição completa: sustenta por horas sem beliscar'
            ],
        allergens: [
                'Ovos',
                'Glúten (pode conter)'
            ],
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
        ingredients: [
                '500g de patinho moído',
                '1 ovo',
                'Aveia',
                'Cebola picada',
                'Alho',
                'Temperos a gosto'
            ],
        instructions: [
                'Misture a carne com ovo e aveia',
                'Adicione cebola, alho e temperos',
                'Modele os hambúrgueres',
                'Grelhe por 5 minutos cada lado',
                'Sirva em pão integral',
                'Adicione salada e molho fit'
            ],
        tips: [
                '🥣 Mais saciedade: acrescente 1 colher de chia ou linhaça',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            lunch: '46% proteína, 29% carboidratos, 26% gorduras',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 22,
        name: 'Moqueca de Peixe Light',
        category: 'Jantar',
        calories: 320,
        protein: 35,
        carbs: 20,
        fats: 11,
        fiber: 5,
        time: 35,
        servings: 3,
        difficulty: 'Médio',
        featured: false,
        tags: [
                'Hipertrofia',
                'Jantar',
                'Alto teor proteico',
                'Low carb',
                'Proteína'
            ],
        benefits: [
                'Alto teor proteico para manutenção e ganho de massa magra',
                'Gorduras boas: apoio à saúde cardiovascular e hormonal',
                'Refeição completa: sustenta por horas sem beliscar'
            ],
        allergens: [
                'Leite/Laticínios',
                'Peixe'
            ],
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
        ingredients: [
                '500g de peixe branco',
                'Leite de coco light',
                'Tomate',
                'Pimentão',
                'Coentro',
                'Azeite de dendê (pouco)'
            ],
        instructions: [
                'Tempere o peixe com limão',
                'Refogue cebola, tomate e pimentão',
                'Adicione o peixe',
                'Acrescente leite de coco',
                'Cozinhe em fogo baixo',
                'Finalize com coentro e dendê'
            ],
        tips: [
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            dinner: '44% proteína, 25% carboidratos, 31% gorduras',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 23,
        name: 'Strogonoff de Frango Light',
        category: 'Jantar',
        calories: 390,
        protein: 38,
        carbs: 28,
        fats: 14,
        fiber: 5,
        time: 30,
        servings: 4,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Hipertrofia',
                'Jantar',
                'Alto teor proteico',
                'Proteína'
            ],
        benefits: [
                'Alto teor proteico para manutenção e ganho de massa magra',
                'Refeição completa: sustenta por horas sem beliscar'
            ],
        allergens: [
                'Leite/Laticínios'
            ],
        image: 'https://images.unsplash.com/photo-1766300508550-0f537b4d0459?q=80',
        ingredients: [
                '600g de peito de frango',
                'Champignon',
                'Creme de leite light',
                'Mostarda',
                'Cebola',
                'Extrato de tomate'
            ],
        instructions: [
                'Corte o frango em tiras',
                'Refogue cebola e frango',
                'Adicione champignon',
                'Acrescente extrato de tomate',
                'Misture mostarda e creme de leite',
                'Sirva com arroz integral'
            ],
        tips: [
                '🍗 Para ficar suculento: não fure o frango e deixe descansar 3 min antes de cortar',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            dinner: '39% proteína, 29% carboidratos, 32% gorduras',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 24,
        name: 'Lasanha de Berinjela',
        category: 'Jantar',
        calories: 340,
        protein: 28,
        carbs: 30,
        fats: 12,
        fiber: 5,
        time: 50,
        servings: 6,
        difficulty: 'Médio',
        featured: true,
        tags: [
                'Hipertrofia',
                'Jantar',
                'Alto teor proteico',
                'Proteína'
            ],
        benefits: [
                'Boa dose de proteína para saciedade e recuperação muscular',
                'Refeição completa: sustenta por horas sem beliscar'
            ],
        allergens: [
                'Leite/Laticínios'
            ],
        image: 'https://images.unsplash.com/photo-1709429790175-b02bb1b19207?q=80',
        ingredients: [
                '2 berinjelas grandes',
                'Carne moída magra',
                'Molho de tomate caseiro',
                'Queijo mozzarella light',
                'Ricota',
                'Manjericão'
            ],
        instructions: [
                'Fatie as berinjelas e grelhe',
                'Prepare molho com carne moída',
                'Em refratário, alterne camadas',
                'Berinjela, molho, queijo',
                'Finalize com mozzarella',
                'Asse a 180°C por 30 minutos'
            ],
        tips: [
                '🔥 Dica Pro: pré-aqueça o forno para garantir textura uniforme',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            dinner: '33% proteína, 35% carboidratos, 32% gorduras',
            preworkout: 'Consuma 1-2h antes do treino para energia e performance',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 25,
        name: 'Wrap de Frango Teriyaki',
        category: 'Jantar',
        calories: 380,
        protein: 35,
        carbs: 35,
        fats: 11,
        fiber: 5,
        time: 25,
        servings: 2,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Hipertrofia',
                'Jantar',
                'Alto teor proteico',
                'Proteína'
            ],
        benefits: [
                'Alto teor proteico para manutenção e ganho de massa magra',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Refeição completa: sustenta por horas sem beliscar'
            ],
        allergens: [
                'Glúten (pode conter)'
            ],
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80',
        ingredients: [
                'Tortilhas integrais',
                '300g de frango em tiras',
                'Molho teriyaki light',
                'Vegetais (cenoura, pepino)',
                'Alface',
                'Gergelim'
            ],
        instructions: [
                'Refogue o frango',
                'Adicione molho teriyaki',
                'Aqueça as tortilhas',
                'Monte com alface e vegetais',
                'Adicione o frango',
                'Enrole e sirva'
            ],
        tips: [
                '🍗 Para ficar suculento: não fure o frango e deixe descansar 3 min antes de cortar',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            dinner: '37% proteína, 37% carboidratos, 26% gorduras',
            preworkout: 'Consuma 1-2h antes do treino para energia e performance',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 26,
        name: 'Sopa de Lentilha com Legumes',
        category: 'Jantar',
        calories: 290,
        protein: 18,
        carbs: 36,
        fats: 8,
        fiber: 7,
        time: 40,
        servings: 4,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Jantar',
                'Rico em fibras'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Refeição completa: sustenta por horas sem beliscar'
            ],
        allergens: [],
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
        ingredients: [
                '200g de lentilha',
                'Cenoura',
                'Batata',
                'Calabresa light (opcional)',
                'Cebola e alho',
                'Caldo de legumes'
            ],
        instructions: [
                'Refogue cebola e alho',
                'Adicione a lentilha',
                'Acrescente legumes picados',
                'Cubra com caldo',
                'Cozinhe por 30 minutos',
                'Ajuste sal e sirva quente'
            ],
        tips: [
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            dinner: '25% proteína, 50% carboidratos, 25% gorduras'
        },
        variations: [
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 27,
        name: 'Barrinha de Proteína Caseira',
        category: 'Lanches',
        calories: 180,
        protein: 12,
        carbs: 22,
        fats: 5,
        fiber: 5,
        time: 30,
        servings: 8,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Lanche',
                'Baixa caloria',
                'Low carb',
                'Energia sustentada',
                'Proteína'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Gorduras boas: apoio à saúde cardiovascular e hormonal'
            ],
        allergens: [
                'Leite/Laticínios',
                'Oleaginosas',
                'Glúten (pode conter)'
            ],
        image: 'https://plus.unsplash.com/premium_photo-1726217054248-ba1b3494ee4d?q=80',
        ingredients: [
                '2 scoops de whey',
                '100g de aveia',
                '50g de pasta de amendoim',
                'Mel',
                'Gotas de chocolate 70%',
                'Castanhas picadas'
            ],
        instructions: [
                'Misture whey e aveia',
                'Adicione pasta de amendoim e mel',
                'Incorpore gotas de chocolate',
                'Espalhe em forma forrada',
                'Refrigere por 2 horas',
                'Corte em barrinhas'
            ],
        tips: [
                '🥣 Mais saciedade: acrescente 1 colher de chia ou linhaça',
                '💪 Ajuste o whey: use sem sabor para receitas salgadas e baunilha/choco para doces',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '27% proteína, 49% carboidratos, 25% gorduras'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 28,
        name: 'Cookies Proteicos de Banana',
        category: 'Sobremesas',
        calories: 150,
        protein: 10,
        carbs: 18,
        fats: 4,
        fiber: 5,
        time: 25,
        servings: 10,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Sobremesa fit',
                'Baixa caloria',
                'Low carb',
                'Energia sustentada',
                'Proteína'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Gorduras boas: apoio à saúde cardiovascular e hormonal'
            ],
        allergens: [
                'Leite/Laticínios',
                'Oleaginosas',
                'Glúten (pode conter)'
            ],
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80',
        ingredients: [
                '2 bananas maduras',
                '1 scoop de whey',
                '100g de aveia',
                'Canela',
                'Gotas de chocolate',
                'Castanhas (opcional)'
            ],
        instructions: [
                'Amasse as bananas',
                'Misture com whey e aveia',
                'Adicione canela e gotas de chocolate',
                'Faça bolinhas e achate',
                'Asse a 180°C por 15 minutos',
                'Deixe esfriar antes de servir'
            ],
        tips: [
                '🥣 Mais saciedade: acrescente 1 colher de chia ou linhaça',
                '💪 Ajuste o whey: use sem sabor para receitas salgadas e baunilha/choco para doces',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '27% proteína, 49% carboidratos, 24% gorduras'
        },
        variations: [
                'Versão low carb: reduza a banana e use morango ou abacate',
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 29,
        name: 'Chips de Batata Doce',
        category: 'Lanches',
        calories: 140,
        protein: 3,
        carbs: 23,
        fats: 4,
        fiber: 5,
        time: 35,
        servings: 2,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Lanche',
                'Baixa caloria',
                'Low carb',
                'Energia sustentada'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Gorduras boas: apoio à saúde cardiovascular e hormonal'
            ],
        allergens: [],
        image: 'https://images.unsplash.com/photo-1566847284565-a733fe649d7d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: [
                '1 batata doce grande',
                'Azeite em spray',
                'Sal rosa',
                'Páprica',
                'Alho em pó',
                'Alecrim'
            ],
        instructions: [
                'Corte a batata em fatias finas',
                'Disponha em assadeira',
                'Borrife azeite',
                'Tempere com sal e especiarias',
                'Asse a 180°C por 25-30 minutos',
                'Vire na metade do tempo'
            ],
        tips: [
                '🔥 Dica Pro: pré-aqueça o forno para garantir textura uniforme',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '9% proteína, 66% carboidratos, 26% gorduras'
        },
        variations: [
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 30,
        name: 'Bolo de Caneca Proteico',
        category: 'Sobremesas',
        calories: 200,
        protein: 18,
        carbs: 18,
        fats: 6,
        fiber: 5,
        time: 5,
        servings: 1,
        difficulty: 'Fácil',
        featured: true,
        tags: [
                'Emagrecimento',
                'Definição',
                'Sobremesa fit',
                'Baixa caloria',
                'Low carb',
                'Rápido'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Opção prática para manter dieta sem abrir mão do sabor'
            ],
        allergens: [
                'Leite/Laticínios',
                'Ovos',
                'Glúten (pode conter)'
            ],
        image: 'https://images.unsplash.com/photo-1511938842055-c59f750525b4?q=80',
        ingredients: [
                '1 ovo',
                '1 scoop de whey chocolate',
                '1 col de cacau em pó',
                '1 col de aveia',
                'Fermento',
                'Leite'
            ],
        instructions: [
                'Misture todos ingredientes em uma caneca',
                'Bata bem com garfo',
                'Leve ao microondas por 90 segundos',
                'Deixe esfriar 1 minuto',
                'Desenforme ou coma na caneca',
                'Decore a gosto'
            ],
        tips: [
                '🔥 Dica Pro: pré-aqueça o forno para garantir textura uniforme',
                '🥣 Mais saciedade: acrescente 1 colher de chia ou linhaça',
                '💪 Ajuste o whey: use sem sabor para receitas salgadas e baunilha/choco para doces',
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '36% proteína, 36% carboidratos, 27% gorduras'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 31,
        name: 'Guacamole com Vegetais',
        category: 'Lanches',
        calories: 160,
        protein: 4,
        carbs: 22,
        fats: 6,
        fiber: 5,
        time: 10,
        servings: 2,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Lanche',
                'Baixa caloria',
                'Low carb',
                'Rápido'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Gorduras boas: apoio à saúde cardiovascular e hormonal'
            ],
        allergens: [],
        image: 'https://plus.unsplash.com/premium_photo-1681406689576-b5384bcfed64?q=80',
        ingredients: [
                '2 abacates maduros',
                'Tomate picado',
                'Cebola roxa',
                'Limão',
                'Coentro',
                'Vegetais para servir'
            ],
        instructions: [
                'Amasse os abacates',
                'Adicione tomate e cebola picados',
                'Tempere com limão e sal',
                'Misture o coentro',
                'Sirva com cenoura e pepino',
                'Consuma no mesmo dia'
            ],
        tips: [
                '🥑 Abacate no ponto: use bem maduro para cremosidade e melhor sabor',
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '10% proteína, 56% carboidratos, 34% gorduras'
        },
        variations: [
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 32,
        name: 'Bolinho de Arroz Integral',
        category: 'Lanches',
        calories: 190,
        protein: 8,
        carbs: 28,
        fats: 5,
        fiber: 5,
        time: 25,
        servings: 6,
        difficulty: 'Médio',
        featured: false,
        tags: [
                'Lanche',
                'Baixa caloria',
                'Energia sustentada',
                'Proteína'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Opção prática para manter dieta sem abrir mão do sabor'
            ],
        allergens: [
                'Leite/Laticínios',
                'Ovos',
                'Glúten (pode conter)'
            ],
        image: 'https://images.unsplash.com/photo-1676037150357-4417246cd4ce?q=80',
        ingredients: [
                '2 xícaras de arroz integral cozido',
                '2 ovos',
                'Queijo ralado light',
                'Cebolinha',
                'Aveia',
                'Temperos'
            ],
        instructions: [
                'Misture arroz com ovos',
                'Adicione queijo e cebolinha',
                'Tempere a gosto',
                'Modele bolinhos',
                'Passe na aveia',
                'Asse ou frite em pouco óleo'
            ],
        tips: [
                '🥣 Mais saciedade: acrescente 1 colher de chia ou linhaça',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '17% proteína, 59% carboidratos, 24% gorduras'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 33,
        name: 'Pasta de Atum Fit',
        category: 'Lanches',
        calories: 120,
        protein: 15,
        carbs: 8,
        fats: 3,
        fiber: 3,
        time: 5,
        servings: 2,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Emagrecimento',
                'Definição',
                'Lanche',
                'Baixa caloria',
                'Low carb',
                'Rápido'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Opção prática para manter dieta sem abrir mão do sabor'
            ],
        allergens: [
                'Leite/Laticínios',
                'Peixe'
            ],
        image: 'https://images.unsplash.com/photo-1766302353690-fb2fef54f390?q=80',
        ingredients: [
                '1 lata de atum',
                'Iogurte grego',
                'Mostarda',
                'Cebolinha',
                'Suco de limão',
                'Temperos'
            ],
        instructions: [
                'Escorra bem o atum',
                'Misture com iogurte grego',
                'Adicione mostarda e limão',
                'Tempere com cebolinha',
                'Ajuste sal e pimenta',
                'Sirva com torradas integrais'
            ],
        tips: [
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '50% proteína, 27% carboidratos, 23% gorduras'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 34,
        name: 'Muffin de Banana com Aveia',
        category: 'Sobremesas',
        calories: 170,
        protein: 9,
        carbs: 22,
        fats: 5,
        fiber: 5,
        time: 30,
        servings: 8,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Sobremesa fit',
                'Baixa caloria',
                'Low carb',
                'Energia sustentada',
                'Proteína'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Opção prática para manter dieta sem abrir mão do sabor'
            ],
        allergens: [
                'Leite/Laticínios',
                'Ovos',
                'Glúten (pode conter)'
            ],
        image: 'https://images.unsplash.com/photo-1694459257405-0bcf15515710?q=80',
        ingredients: [
                '3 bananas maduras',
                '2 ovos',
                '150g de aveia',
                '1 scoop de whey',
                'Canela',
                'Fermento'
            ],
        instructions: [
                'Amasse as bananas',
                'Bata com ovos',
                'Misture aveia, whey e canela',
                'Adicione fermento',
                'Distribua em forminhas',
                'Asse a 180°C por 20 minutos'
            ],
        tips: [
                '🔥 Dica Pro: pré-aqueça o forno para garantir textura uniforme',
                '🥣 Mais saciedade: acrescente 1 colher de chia ou linhaça',
                '💪 Ajuste o whey: use sem sabor para receitas salgadas e baunilha/choco para doces',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '21% proteína, 52% carboidratos, 27% gorduras'
        },
        variations: [
                'Versão low carb: reduza a banana e use morango ou abacate',
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 35,
        name: 'Mousse Proteica de Chocolate',
        category: 'Sobremesas',
        calories: 150,
        protein: 20,
        carbs: 8,
        fats: 4,
        fiber: 3,
        time: 10,
        servings: 2,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Emagrecimento',
                'Definição',
                'Sobremesa fit',
                'Baixa caloria',
                'Low carb',
                'Rápido'
            ],
        benefits: [
                'Boa dose de proteína para saciedade e recuperação muscular',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Opção prática para manter dieta sem abrir mão do sabor'
            ],
        allergens: [
                'Leite/Laticínios'
            ],
        image: 'https://images.unsplash.com/photo-1575234337239-4c6492d7df1c?q=80',
        ingredients: [
                '1 scoop de whey chocolate',
                '200g de iogurte grego',
                'Cacau em pó',
                'Adoçante',
                'Essência de baunilha',
                'Raspas de chocolate 70%'
            ],
        instructions: [
                'Misture whey com iogurte',
                'Adicione cacau em pó',
                'Adoce a gosto',
                'Bata até ficar cremoso',
                'Refrigere por 30 minutos',
                'Sirva com raspas de chocolate'
            ],
        tips: [
                '💪 Ajuste o whey: use sem sabor para receitas salgadas e baunilha/choco para doces',
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '54% proteína, 22% carboidratos, 24% gorduras',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 36,
        name: 'Brownie Fit de Chocolate',
        category: 'Sobremesas',
        calories: 180,
        protein: 12,
        carbs: 22,
        fats: 5,
        fiber: 3,
        time: 35,
        servings: 9,
        difficulty: 'Médio',
        featured: true,
        tags: [
                'Sobremesa fit',
                'Baixa caloria',
                'Low carb',
                'Energia sustentada',
                'Proteína'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Opção prática para manter dieta sem abrir mão do sabor'
            ],
        allergens: [
                'Leite/Laticínios',
                'Ovos'
            ],
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
        ingredients: [
                '3 ovos',
                '100g de cacau em pó',
                '1 scoop de whey chocolate',
                'Banana madura',
                'Adoçante',
                'Fermento'
            ],
        instructions: [
                'Bata ovos com banana',
                'Adicione cacau e whey',
                'Adoce a gosto',
                'Acrescente fermento',
                'Despeje em forma untada',
                'Asse a 180°C por 25 minutos'
            ],
        tips: [
                '🔥 Dica Pro: pré-aqueça o forno para garantir textura uniforme',
                '💪 Ajuste o whey: use sem sabor para receitas salgadas e baunilha/choco para doces',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '27% proteína, 49% carboidratos, 25% gorduras'
        },
        variations: [
                'Versão low carb: reduza a banana e use morango ou abacate',
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 37,
        name: 'Pudim de Chia com Frutas',
        category: 'Sobremesas',
        calories: 140,
        protein: 8,
        carbs: 18,
        fats: 4,
        fiber: 7,
        time: 240,
        servings: 2,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Sobremesa fit',
                'Baixa caloria',
                'Low carb',
                'Rico em fibras'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Opção prática para manter dieta sem abrir mão do sabor'
            ],
        allergens: [
                'Leite/Laticínios'
            ],
        image: 'https://plus.unsplash.com/premium_photo-1663840225561-76ecde33143c?q=80',
        ingredients: [
                '3 col de sementes de chia',
                '200ml de leite de coco',
                'Adoçante',
                'Essência de baunilha',
                'Frutas vermelhas',
                'Coco ralado'
            ],
        instructions: [
                'Misture chia com leite',
                'Adicione adoçante e baunilha',
                'Refrigere por 4 horas',
                'Mexa a cada hora',
                'Sirva com frutas',
                'Decore com coco ralado'
            ],
        tips: [
                '🥣 Mais saciedade: acrescente 1 colher de chia ou linhaça',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '23% proteína, 51% carboidratos, 26% gorduras'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 38,
        name: 'Sorvete de Banana Fit',
        category: 'Sobremesas',
        calories: 120,
        protein: 6,
        carbs: 17,
        fats: 3,
        fiber: 3,
        time: 5,
        servings: 2,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Sobremesa fit',
                'Baixa caloria',
                'Low carb',
                'Rápido',
                'Energia sustentada',
                'Proteína'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Opção prática para manter dieta sem abrir mão do sabor'
            ],
        allergens: [
                'Leite/Laticínios',
                'Oleaginosas'
            ],
        image: 'https://images.unsplash.com/photo-1657225953401-5f95007fc8e0?q=80',
        ingredients: [
                '3 bananas congeladas',
                '1 scoop de whey baunilha',
                'Cacau em pó (opcional)',
                'Pasta de amendoim',
                'Leite (se necessário)',
                'Toppings a gosto'
            ],
        instructions: [
                'Corte bananas em rodelas e congele',
                'Bata no processador',
                'Adicione whey',
                'Bata até ficar cremoso',
                'Sirva imediatamente',
                'Decore com pasta de amendoim'
            ],
        tips: [
                '💪 Ajuste o whey: use sem sabor para receitas salgadas e baunilha/choco para doces',
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '20% proteína, 57% carboidratos, 23% gorduras'
        },
        variations: [
                'Versão low carb: reduza a banana e use morango ou abacate',
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 39,
        name: 'Suco Verde Energético',
        category: 'Lanches',
        calories: 90,
        protein: 4,
        carbs: 12,
        fats: 3,
        fiber: 5,
        time: 5,
        servings: 1,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Lanche',
                'Baixa caloria',
                'Low carb',
                'Rápido'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Opção prática para manter dieta sem abrir mão do sabor'
            ],
        allergens: [],
        image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&q=80',
        ingredients: [
                '1 maçã verde',
                '1 folha de couve',
                'Gengibre',
                'Limão',
                'Água de coco',
                'Hortelã'
            ],
        instructions: [
                'Lave bem todos ingredientes',
                'Corte a maçã',
                'Bata tudo no liquidificador',
                'Coe se preferir',
                'Sirva com gelo',
                'Consuma imediatamente'
            ],
        tips: [
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '18% proteína, 53% carboidratos, 30% gorduras'
        },
        variations: [
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 40,
        name: 'Shake Proteico de Morango',
        category: 'Lanches',
        calories: 220,
        protein: 28,
        carbs: 14,
        fats: 6,
        fiber: 5,
        time: 5,
        servings: 1,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Emagrecimento',
                'Definição',
                'Hipertrofia',
                'Lanche',
                'Alto teor proteico',
                'Baixa caloria'
            ],
        benefits: [
                'Boa dose de proteína para saciedade e recuperação muscular',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Opção prática para manter dieta sem abrir mão do sabor'
            ],
        allergens: [
                'Leite/Laticínios',
                'Glúten (pode conter)'
            ],
        image: 'https://images.unsplash.com/photo-1589734575451-8ddc34c5752b?q=80',
        ingredients: [
                '1 scoop de whey morango',
                '200ml de leite desnatado',
                'Morangos frescos',
                'Aveia',
                'Gelo',
                'Mel (opcional)'
            ],
        instructions: [
                'Coloque todos ingredientes no liquidificador',
                'Bata até ficar homogêneo',
                'Ajuste consistência com mais leite',
                'Prove e adoce se necessário',
                'Sirva imediatamente',
                'Ideal pós-treino'
            ],
        tips: [
                '🥣 Mais saciedade: acrescente 1 colher de chia ou linhaça',
                '💪 Ajuste o whey: use sem sabor para receitas salgadas e baunilha/choco para doces',
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '50% proteína, 25% carboidratos, 24% gorduras',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 41,
        name: 'Café Proteico Gelado',
        category: 'Lanches',
        calories: 180,
        protein: 22,
        carbs: 12,
        fats: 5,
        fiber: 3,
        time: 5,
        servings: 1,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Emagrecimento',
                'Definição',
                'Lanche',
                'Baixa caloria',
                'Low carb',
                'Rápido'
            ],
        benefits: [
                'Boa dose de proteína para saciedade e recuperação muscular',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Opção prática para manter dieta sem abrir mão do sabor'
            ],
        allergens: [
                'Leite/Laticínios'
            ],
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
        ingredients: [
                '1 dose de café expresso frio',
                '1 scoop de whey baunilha',
                '200ml de leite desnatado',
                'Gelo',
                'Canela',
                'Adoçante'
            ],
        instructions: [
                'Prepare café e deixe esfriar',
                'Bata com whey e leite',
                'Adicione gelo',
                'Adoce a gosto',
                'Polvilhe canela',
                'Sirva gelado'
            ],
        tips: [
                '💪 Ajuste o whey: use sem sabor para receitas salgadas e baunilha/choco para doces',
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '49% proteína, 27% carboidratos, 25% gorduras',
            postWorkout: 'Bom para recuperação (até 1h pós-treino)'
        },
        variations: [
                'Versão sem lactose: use iogurte/queijos sem lactose e whey isolado',
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 42,
        name: 'Água Saborizada Detox',
        category: 'Lanches',
        calories: 15,
        protein: 0,
        carbs: 0,
        fats: 2,
        fiber: 5,
        time: 5,
        servings: 1,
        difficulty: 'Fácil',
        featured: false,
        tags: [
                'Lanche',
                'Baixa caloria',
                'Low carb',
                'Rápido'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Baixa caloria: ajuda em estratégia de emagrecimento',
                'Opção prática para manter dieta sem abrir mão do sabor'
            ],
        allergens: [],
        image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&q=80',
        ingredients: [
                '500ml de água',
                'Rodelas de limão',
                'Folhas de hortelã',
                'Gengibre',
                'Pepino',
                'Gelo'
            ],
        instructions: [
                'Adicione água em uma jarra',
                'Coloque rodelas de limão',
                'Acrescente hortelã e gengibre',
                'Adicione pepino fatiado',
                'Refrigere por 30 minutos',
                'Sirva gelado com gelo'
            ],
        tips: [
                '⏱️ Versão express: deixe porções medidas para montar em 2-3 minutos',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '0% proteína, 0% carboidratos, 100% gorduras'
        },
        variations: [
                'Versão vegana: substitua proteína animal por tofu/leguminosas quando possível'
            ]
    },
    {
        id: 43,
        name: 'Buddha Bowl Vegano',
        category: 'Veganas',
        calories: 380,
        protein: 16,
        carbs: 54,
        fats: 11,
        fiber: 8,
        time: 30,
        servings: 2,
        difficulty: 'Médio',
        featured: false,
        tags: [
                'Vegano',
                'Rico em fibras',
                'Energia sustentada'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Gorduras boas: apoio à saúde cardiovascular e hormonal',
                'Fonte vegetal de nutrientes e micronutrientes essenciais'
            ],
        allergens: [],
        image: 'https://plus.unsplash.com/premium_photo-1664648005742-0c360f4910b2?q=80',
        ingredients: [
                'Arroz integral',
                'Grão de bico assado',
                'Batata doce',
                'Espinafre',
                'Abacate',
                'Molho tahine'
            ],
        instructions: [
                'Cozinhe o arroz integral',
                'Asse batata doce e grão de bico',
                'Refogue o espinafre',
                'Monte o bowl em camadas',
                'Adicione abacate fatiado',
                'Regue com molho tahine'
            ],
        tips: [
                '🥑 Abacate no ponto: use bem maduro para cremosidade e melhor sabor',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '17% proteína, 57% carboidratos, 26% gorduras'
        },
        variations: [],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 44,
        name: 'Hambúrguer de Grão de Bico',
        category: 'Veganas',
        calories: 280,
        protein: 14,
        carbs: 38,
        fats: 8,
        fiber: 6,
        time: 30,
        servings: 4,
        difficulty: 'Médio',
        featured: true,
        tags: [
                'Vegano',
                'Rico em fibras',
                'Energia sustentada'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Gorduras boas: apoio à saúde cardiovascular e hormonal',
                'Fonte vegetal de nutrientes e micronutrientes essenciais'
            ],
        allergens: [
                'Glúten (pode conter)'
            ],
        image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&q=80',
        ingredients: [
                '2 xícaras de grão de bico cozido',
                'Cebola e alho',
                'Aveia',
                'Cominho',
                'Salsinha',
                'Azeite'
            ],
        instructions: [
                'Amasse o grão de bico',
                'Refogue cebola e alho',
                'Misture tudo com aveia',
                'Tempere com cominho',
                'Modele os hambúrgueres',
                'Grelhe ou asse até dourar'
            ],
        tips: [
                '🥣 Mais saciedade: acrescente 1 colher de chia ou linhaça',
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '20% proteína, 54% carboidratos, 26% gorduras'
        },
        variations: [],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 45,
        name: 'Curry de Legumes com Tofu',
        category: 'Veganas',
        calories: 320,
        protein: 18,
        carbs: 42,
        fats: 9,
        fiber: 6,
        time: 35,
        servings: 3,
        difficulty: 'Médio',
        featured: false,
        tags: [
                'Vegano',
                'Rico em fibras',
                'Proteína'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Fonte vegetal de nutrientes e micronutrientes essenciais'
            ],
        allergens: [
                'Leite/Laticínios',
                'Soja'
            ],
        image: 'https://plus.unsplash.com/premium_photo-1723708960579-de1e03d9aa56?q=80',
        ingredients: [
                '200g de tofu firme',
                'Leite de coco',
                'Curry em pó',
                'Batata',
                'Cenoura',
                'Brócolis'
            ],
        instructions: [
                'Corte o tofu em cubos',
                'Refogue com curry',
                'Adicione legumes picados',
                'Cubra com leite de coco',
                'Cozinhe até os legumes ficarem macios',
                'Sirva com arroz basmati'
            ],
        tips: [
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '22% proteína, 52% carboidratos, 25% gorduras'
        },
        variations: [],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    },
    {
        id: 46,
        name: 'Wrap Vegano de Falafel',
        category: 'Veganas',
        calories: 350,
        protein: 15,
        carbs: 50,
        fats: 10,
        fiber: 6,
        time: 40,
        servings: 4,
        difficulty: 'Médio',
        featured: false,
        tags: [
                'Vegano',
                'Rico em fibras'
            ],
        benefits: [
                'Equilíbrio de macronutrientes para energia e saciedade',
                'Rico em fibras: melhora digestão e aumenta saciedade',
                'Fonte vegetal de nutrientes e micronutrientes essenciais'
            ],
        allergens: [
                'Glúten (pode conter)'
            ],
        image: 'https://images.unsplash.com/photo-1666819615040-eff5e52c778a?q=80',
        ingredients: [
                'Grão de bico',
                'Salsinha e coentro',
                'Cominho',
                'Alho',
                'Tortilha integral',
                'Molho tahine'
            ],
        instructions: [
                'Processe grão de bico com temperos',
                'Modele bolinhas de falafel',
                'Asse a 200°C por 25 minutos',
                'Aqueça as tortilhas',
                'Monte com salada',
                'Regue com molho tahine'
            ],
        tips: [
                '🧂 Temperos: prefira ervas e especiarias para mais sabor com menos calorias'
            ],
        macros: {
            snack: '17% proteína, 57% carboidratos, 26% gorduras'
        },
        variations: [],
        mealPrepTips: [
                'Armazene em potes bem fechados na geladeira (até 3-4 dias)',
                'Separe molho/folhas para manter textura',
                'Reaqueça em fogo baixo ou forno para preservar sabor'
            ]
    }
];

// Código premium válido - ALTERE AQUI PARA MUDAR O CÓDIGO
//const VALID_PREMIUM_CODE = 'FITPRO2024';

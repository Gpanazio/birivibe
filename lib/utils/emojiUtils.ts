// Função para mapear alimentos a emojis específicos
export const getFoodEmoji = (name: string): string => {
    if (!name) return '🍽️';
    const lowerName = name.toLowerCase();

    // Bebidas
    if (lowerName.includes('café') || lowerName.includes('coffee')) return '☕';
    if (lowerName.includes('chá') || lowerName.includes('tea')) return '🍵';
    if (lowerName.includes('suco') || lowerName.includes('juice')) return '🧃';
    if (lowerName.includes('leite') || lowerName.includes('milk')) return '🥛';
    if (lowerName.includes('água') || lowerName.includes('water')) return '💧';
    if (lowerName.includes('cerveja') || lowerName.includes('beer')) return '🍺';
    if (lowerName.includes('vinho') || lowerName.includes('wine')) return '🍷';
    if (lowerName.includes('refrigerante') || lowerName.includes('soda')) return '🥤';
    if (lowerName.includes('smoothie') || lowerName.includes('shake')) return '🥤';

    // Ovos
    if (lowerName.includes('ovo') || lowerName.includes('egg')) return '🍳';

    // Carnes
    if (lowerName.includes('frango') || lowerName.includes('chicken')) return '🍗';
    if (lowerName.includes('carne') || lowerName.includes('beef') || lowerName.includes('bife')) return '🥩';
    if (lowerName.includes('bacon')) return '🥓';
    if (lowerName.includes('peixe') || lowerName.includes('fish') || lowerName.includes('salmão') || lowerName.includes('atum')) return '🐟';
    if (lowerName.includes('camarão') || lowerName.includes('shrimp')) return '🦐';
    if (lowerName.includes('porco') || lowerName.includes('pork') || lowerName.includes('linguiça') || lowerName.includes('salsicha')) return '🥓';
    if (lowerName.includes('hambúrguer') || lowerName.includes('burger')) return '🍔';
    if (lowerName.includes('costela')) return '🍖';

    // Laticínios
    if (lowerName.includes('queijo') || lowerName.includes('cheese')) return '🧀';
    if (lowerName.includes('iogurte') || lowerName.includes('yogurt')) return '🥛';
    if (lowerName.includes('manteiga') || lowerName.includes('butter')) return '🧈';
    if (lowerName.includes('whey')) return '💪';

    // Frutas
    if (lowerName.includes('maçã') || lowerName.includes('apple')) return '🍎';
    if (lowerName.includes('banana')) return '🍌';
    if (lowerName.includes('laranja') || lowerName.includes('orange')) return '🍊';
    if (lowerName.includes('morango') || lowerName.includes('strawberry')) return '🍓';
    if (lowerName.includes('uva') || lowerName.includes('grape')) return '🍇';
    if (lowerName.includes('melancia') || lowerName.includes('watermelon')) return '🍉';
    if (lowerName.includes('abacaxi') || lowerName.includes('pineapple')) return '🍍';
    if (lowerName.includes('manga') || lowerName.includes('mango')) return '🥭';
    if (lowerName.includes('pêssego') || lowerName.includes('peach')) return '🍑';
    if (lowerName.includes('limão') || lowerName.includes('lemon')) return '🍋';
    if (lowerName.includes('cereja') || lowerName.includes('cherry')) return '🍒';
    if (lowerName.includes('coco') || lowerName.includes('coconut')) return '🥥';
    if (lowerName.includes('kiwi')) return '🥝';
    if (lowerName.includes('abacate') || lowerName.includes('avocado')) return '🥑';
    if (lowerName.includes('fruta')) return '🍎';

    // Vegetais
    if (lowerName.includes('alface') || lowerName.includes('lettuce') || lowerName.includes('salada')) return '🥗';
    if (lowerName.includes('tomate') || lowerName.includes('tomato')) return '🍅';
    if (lowerName.includes('cenoura') || lowerName.includes('carrot')) return '🥕';
    if (lowerName.includes('brócolis') || lowerName.includes('broccoli')) return '🥦';
    if (lowerName.includes('milho') || lowerName.includes('corn')) return '🌽';
    if (lowerName.includes('batata') || lowerName.includes('potato')) return '🥔';
    if (lowerName.includes('pepino') || lowerName.includes('cucumber')) return '🥒';
    if (lowerName.includes('pimentão') || lowerName.includes('pepper')) return '🫑';
    if (lowerName.includes('cebola') || lowerName.includes('onion')) return '🧅';
    if (lowerName.includes('alho') || lowerName.includes('garlic')) return '🧄';
    if (lowerName.includes('cogumelo') || lowerName.includes('mushroom')) return '🍄';
    if (lowerName.includes('espinafre') || lowerName.includes('spinach')) return '🥬';
    if (lowerName.includes('berinjela') || lowerName.includes('eggplant')) return '🍆';

    // Carboidratos
    if (lowerName.includes('arroz') || lowerName.includes('rice')) return '🍚';
    if (lowerName.includes('pão') || lowerName.includes('bread') || lowerName.includes('torrada') || lowerName.includes('toast')) return '🍞';
    if (lowerName.includes('macarrão') || lowerName.includes('pasta') || lowerName.includes('espaguete') || lowerName.includes('spaghetti')) return '🍝';
    if (lowerName.includes('pizza')) return '🍕';
    if (lowerName.includes('feijão') || lowerName.includes('beans')) return '🫘';
    if (lowerName.includes('aveia') || lowerName.includes('oat')) return '🥣';
    if (lowerName.includes('cereal')) return '🥣';
    if (lowerName.includes('granola')) return '🥣';
    if (lowerName.includes('tapioca')) return '🫓';
    if (lowerName.includes('panqueca') || lowerName.includes('pancake')) return '🥞';
    if (lowerName.includes('waffle')) return '🧇';
    if (lowerName.includes('croissant')) return '🥐';
    if (lowerName.includes('pretzel')) return '🥨';
    if (lowerName.includes('bagel')) return '🥯';

    // Doces e sobremesas
    if (lowerName.includes('chocolate')) return '🍫';
    if (lowerName.includes('sorvete') || lowerName.includes('ice cream')) return '🍦';
    if (lowerName.includes('bolo') || lowerName.includes('cake')) return '🍰';
    if (lowerName.includes('biscoito') || lowerName.includes('cookie')) return '🍪';
    if (lowerName.includes('donut') || lowerName.includes('rosquinha')) return '🍩';
    if (lowerName.includes('pudim') || lowerName.includes('pudding')) return '🍮';
    if (lowerName.includes('mel') || lowerName.includes('honey')) return '🍯';
    if (lowerName.includes('cupcake')) return '🧁';
    if (lowerName.includes('pie') || lowerName.includes('torta')) return '🥧';
    if (lowerName.includes('candy') || lowerName.includes('bala') || lowerName.includes('doce')) return '🍬';

    // Nuts e sementes
    if (lowerName.includes('amendoim') || lowerName.includes('peanut')) return '🥜';
    if (lowerName.includes('castanha') || lowerName.includes('nut') || lowerName.includes('amêndoa') || lowerName.includes('nozes')) return '🌰';

    // Comidas prontas
    if (lowerName.includes('sushi')) return '🍣';
    if (lowerName.includes('taco')) return '🌮';
    if (lowerName.includes('burrito')) return '🌯';
    if (lowerName.includes('hot dog') || lowerName.includes('cachorro quente')) return '🌭';
    if (lowerName.includes('sanduíche') || lowerName.includes('sandwich')) return '🥪';
    if (lowerName.includes('sopa') || lowerName.includes('soup') || lowerName.includes('caldo')) return '🍲';
    if (lowerName.includes('curry')) return '🍛';
    if (lowerName.includes('ramen') || lowerName.includes('lámen')) return '🍜';
    if (lowerName.includes('fries') || lowerName.includes('batata frita')) return '🍟';
    if (lowerName.includes('pipoca') || lowerName.includes('popcorn')) return '🍿';

    // Azeite e óleos
    if (lowerName.includes('azeite') || lowerName.includes('óleo') || lowerName.includes('oil')) return '🫒';

    // Default
    return '🍽️';
};

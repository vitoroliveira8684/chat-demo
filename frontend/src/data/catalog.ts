// src/data/catalog.ts

export interface ProductItem {
  id: string;
  name: string;
  price: string;
  image: string[]; // Pode ser foto do produto ou um ícone
  link: string;  // Link de compra ou agendamento
}

export const CATALOG: Record<string, ProductItem[]> = {
  // --- INFORMÁTICA (HELIO FILHO) ---
  info_pcsr: [
   {
    id: 'info_pcgamer1',
    name: 'Pc Gamer Intel Core I5, 8gb, Ssd 120gb Sata 8 Gb',
    price: 'R$ 2.700,00',
    image: [
        'https://http2.mlstatic.com/D_NQ_NP_2X_963381-MLB50448528430_062022-F.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_733705-MLB50448472620_062022-R.webp'
    ],
    link: 'https://heliofilho.mercadoshops.com.br/pc-gamer-intel-core-i5-8gb-ssd-120gb-sata/up/MLBU1108294637#item_id=MLB2692013134&component=collection_grid&page_from=home&custom_categories=false&item_id=MLB2692013134&component=collection_grid&page_from=home&custom_categories=false'
  },
  {
    id: 'info_pcgamer2',
    name: 'Pc Gamer Intel Core I3, Amd R5 220 1gb, 8gb, Ssd 120gb 8 Gb',
    price: 'R$ 2.300,00',
    image: [
        'https://http2.mlstatic.com/D_Q_NP_2X_658754-MLB50275804677_062022-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_779296-MLB50275809614_062022-R.webp'
    ],
    link: 'https://heliofilho.mercadoshops.com.br/pc-gamer-intel-core-i3-amd-r5-220-1gb-8gb-ssd-120gb/up/MLBU1111209636#item_id=MLB2675700967&component=collection_grid&page_from=home&custom_categories=false&item_id=MLB2675700967&component=collection_grid&page_from=home&custom_categories=false'
  },
  {
    id: 'info_pcgamer3',
    name: 'Pc Gamer Intel Core I5, 8gb, Ssd 120gb Sata 8 Gb',
    price: 'R$ 2.700,00',
    image: [
        'https://http2.mlstatic.com/D_Q_NP_2X_733705-MLB50448472620_062022-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_963381-MLB50448528430_062022-R.webp'
    ],
    link: 'https://heliofilho.mercadoshops.com.br/pc-gamer-intel-core-i5-8gb-ssd-120gb-sata/up/MLBU1108294637#item_id=MLB2692013134&component=collection_grid&page_from=home&custom_categories=false&item_id=MLB2692013134&component=collection_grid&page_from=home&custom_categories=false'
   },
   {
    id: 'info_pcgamer4',
    name: 'Pc Intel Core I5, 4gb Ram, 500gb Hd Ou 120gb Ssd 4 Gb',
    price: 'R$ 1.500,00',
    image: [
        'https://http2.mlstatic.com/D_Q_NP_2X_965456-MLB50647304815_072022-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_927434-MLB50647362678_072022-R.webp'
    ],  
    link: 'https://heliofilho.mercadoshops.com.br/pc-intel-core-i5-4gb-ram-500gb-hd-ou-120gb-ssd/up/MLBU1112604720#item_id=MLB2711486597&component=collection_grid&page_from=home&custom_categories=false&item_id=MLB2711486597&component=collection_grid&page_from=home&custom_categories=false'
  },
  {
    id: 'info_pcgamer5',
    name: 'Pc Pentium Dual Core, 4gb Ram, 120gb Ssd, Cpu Hayom, Win10 4 Gb',
    price: 'R$ 1.250,00',
    image: [
        'https://http2.mlstatic.com/D_Q_NP_2X_788835-MLB50647924494_072022-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_857510-MLB50647486984_072022-R.webp'
    ],
    link: 'https://heliofilho.mercadoshops.com.br/pc-pentium-dual-core-4gb-ram-120gb-ssd-cpu-hayom-win10/up/MLBU1109121503#item_id=MLB2711456400&component=collection_grid&page_from=home&custom_categories=false&item_id=MLB2711456400&component=collection_grid&page_from=home&custom_categories=false'
  }
],

  info_headset: [
    {
    id: 'info_headset1',
    name: 'Fone De Ouvido Headset Gamer Evolut Eg-305bl Azul Thoth Azul',
    price: 'R$ 130,00',
    image: [
        'https://http2.mlstatic.com/D_Q_NP_2X_988164-MLB89085603320_082025-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_834499-MLB50598648566_072022-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_781615-MLB50598672451_072022-R.webp'

    ],
    link: 'https://heliofilho.mercadoshops.com.br/fone-de-ouvido-headset-gamer-evolut-eg305bl-azul-thoth/up/MLBU1112666702#item_id=MLB2706470492&component=collection_grid&page_from=home&custom_categories=false&item_id=MLB2706470492&component=collection_grid&page_from=home&custom_categories=false'
  },
  {
    id: 'info_headset2',
    name: 'Headset Gamer Com Fio Thoth Eg305rd Vermelho Evolut Vermelho',
    price: 'R$ 130,00',
    image: [
        'https://http2.mlstatic.com/D_Q_NP_2X_695944-MLB89447044157_082025-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_719466-MLB50598341273_072022-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_900586-MLB50598138813_072022-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_702284-MLB50598306320_072022-R.webp'
    ],
    link: 'https://heliofilho.mercadoshops.com.br/headset-gamer-redragon-zeus-x-rgb-upgrade-outemu-blue-up-mlb1112671070#item_id=MLB2706597047&component=collection_grid&page_from=home&custom_categories=false&item_id=MLB2706597047&component=collection_grid&page_from=home&custom_categories=false'
  },
  {
    id: 'info_headset3',
    name: 'Headset Gamer Redragon Zeus X Rgb Upgrade Outemu Blue Up',
    price: 'R$ 230,00',
    image: [
        'https://http2.mlstatic.com/D_Q_NP_2X_695944-MLB89447044157_082025-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_719466-MLB50598341273_072022-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_900586-MLB50598138813_072022-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_702284-MLB50598306320_072022-R.webp'
    ],
    link: 'https://heliofilho.mercadoshops.com.br/headset-gamer-redragon-zeus-x-rgb-upgrade-outemu-blue-up-mlb1112671070#item_id=MLB2706597047&component=collection_grid&page_from=home&custom_categories=false&item_id=MLB2706597047&component=collection_grid&page_from=home&custom_categories=false'
  }
],

  info_teclado: [
    {
    id: 'info_teclado1',
    name: 'Teclado Desktop Cm20 Office Preto',
    price: 'R$ 35,00',
    image: [
        'https://http2.mlstatic.com/D_Q_NP_2X_728840-MLB89463151245_082025-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_685221-MLB50611339537_072022-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_754809-MLB50611443087_072022-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_691975-MLB50611329553_072022-R.webp'
    ],
    link: 'https://heliofilho.mercadoshops.com.br/teclado-mecanico-gamer-redragon-kumara-rgb-upgrade-outemu-red-up-mlb1112671084#item_id=MLB2706597063&component=collection_grid&page_from=home&custom_categories=false&item_id=MLB2706597063&component=collection_grid&page_from=home&custom_categories=false'
    },
    {
    id: 'info_teclado2',
    name: 'Teclado Mecânico Gamer Tc3218 Preto',
    price: 'R$ 225,00',
    image: [
        'https://http2.mlstatic.com/D_Q_NP_2X_647082-MLB89091797276_082025-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_881579-MLB50611543741_072022-R.webp'
    ],
    link: 'https://heliofilho.mercadoshops.com.br/teclado-mecanico-gamer-tc3218/up/MLBU1108936977#item_id=MLB2707711257&component=collection_grid&page_from=home&custom_categories=false&item_id=MLB2707711257&component=collection_grid&page_from=home&custom_categories=false'
    },
    {
    id: 'info_teclado3',
    name: 'Teclado Gamer Com Multimidia Led Rgb Usb - Tc3204 Preto',
    price: 'R$ 170,00',
    image: [
        'https://http2.mlstatic.com/D_Q_NP_2X_617537-MLB50611385953_072022-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_667099-MLB50611472511_072022-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_634642-MLB50611399884_072022-R.webp',
        'https://http2.mlstatic.com/D_Q_NP_2X_669843-MLB50611561216_072022-R.webp'
    ],
    link: 'https://heliofilho.mercadoshops.com.br/teclado-gamer-com-multimidia-led-rgb-usb--tc3204/up/MLBU750969495#item_id=MLB2707727259&component=collection_grid&page_from=home&custom_categories=false&item_id=MLB2707727259&component=collection_grid&page_from=home&custom_categories=false'
    }
  ],

  // --- PADARIA (DOCE SABOR) ---
  pad_sonho: [
    {
    id: 'pad_sonho',
    name: 'Sonho de Creme (Unidade)',
    price: 'R$ 4,50',
    image: ['https://static.itdg.com.br/images/1200-630/c040fe298c4b12658864e43b67948232/34684-original.jpg'], // Foto ilustrativa
    link: 'https://wa.me/55000000000?text=Quero+um+sonho' // Link leva pro Zap
  },
],
  pad_combo: [
    {
    id: 'pad_combo',
    name: 'Combo Café + Pão na Chapa',
    price: 'R$ 12,00',
    image: ['https://guiadacozinha.com.br/wp-content/uploads/2019/10/pao-na-chapa-com-requeijao.jpg'],
    link: 'https://wa.me/55000000000?text=Quero+o+combo'
  },
  ],
  // --- CONTABILIDADE (DAVID) ---
  cont_mei: [

  {
    id: 'cont_mei',
    name: 'Abertura de MEI (Assessoria)',
    price: 'Grátis', // Isca para atrair cliente
    image: ['https://blog.nubank.com.br/wp-content/uploads/2021/04/o-que-e-mei-header.jpg'],
    link: 'https://wa.me/55000000000?text=Preciso+abrir+MEI'
  },
],
};

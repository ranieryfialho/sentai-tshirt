import { Product } from "@/types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Camiseta Sentai Ranger Red",
    slug: "camiseta-sentai-ranger-red",
    description: "Camiseta oficial do líder do esquadrão. Algodão 100% penteado.",
    price: 89.90,
    promotional_price: 79.90,
    category: "Camisetas",
    images: [
      { id: 101, src: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=1000", alt: "Camiseta Vermelha Frontal" }
    ],
    specs: { "Material": "Algodão", "Gênero": "Unissex" }
  },
  {
    id: 2,
    name: "Action Figure Mecha Z",
    slug: "action-figure-mecha-z",
    description: "Figura de ação colecionável com 32 pontos de articulação.",
    price: 450.00,
    category: "Colecionáveis",
    images: [
      { id: 102, src: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&q=80&w=1000", alt: "Robô Action Figure" }
    ],
    tags: ["Destaque", "Novo"]
  },
  {
    id: 3,
    name: "Caneca Geek 'Level Up'",
    slug: "caneca-geek-level-up",
    description: "Caneca de cerâmica 350ml para suas maratonas de jogos.",
    price: 35.00,
    category: "Acessórios",
    images: [
      { id: 103, src: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=1000", alt: "Caneca Gamer" }
    ]
  }
];
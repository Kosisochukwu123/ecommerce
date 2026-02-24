import topPiece2 from "../../public/images/Top-Piece2.png";
import mensTop1 from "../../public/images/mens-top1.png";
import mensTop2 from "../../public/images/mens-top2.png";

export const products = [
  {
    id: "1",
    image: topPiece2,
    name: "men classy hoddies",
    category: "hoodies",
    rating: {
      stars: 4.2,
      count: 120,
    },
    priceCents: 15990,
    keywords: ["t-shirt", "clothing", "casual"],
  },
  {
    id: "2",
    image: mensTop1,
    name: "black cartoon shirt",
    category: "t-shirt",
    rating: {
      stars: 4.7,
      count: 250,
    },
    priceCents: 19990,
    keywords: ["jeans", "pants", "denim"],
  },
  {
    id: "3",
    image: mensTop2,
    name: "brown cartoon shirt",
    category: "t-shirt",
    rating: {
      stars: 4.6,
      count: 180,
    },
    priceCents: 4999,
    keywords: ["shirt", "cartoon", "brown", "men fashion"],

    // keywords: ["sneakers", "shoes", "athletic"],

    description: "A soft cotton cartoon shirt perfect for casual outings.",
    stock: 25,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Brown", "Black", "White"],
    brand: "Nike",
    discountCents: 3999,
    images: ["/img/shirt1.png", "/img/shirt2.png", "/img/shirt3.png"],
    isActive: true,
    createdAt: "2026-02-15"

  },
];

export default products;

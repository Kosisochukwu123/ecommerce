import topPiece1 from "../../public/images/Top-Piece1.png"
import womenTop1 from "../../public/images/womens-top1.png"
import womenHoddie from "../../public/images/women-hoddie.jpg"

export const productLadies = [
    {
        id: "1",
        image: topPiece1,
        name: "Light blowse",
        rating: {
            stars: 4.5,
            count: 87
        },
        priceCents: 1052,
        keywords: ["socks", "sports", "apparel"]
    },
    {
        id: "2",
        image: womenTop1,
        name: "Black mini top with sharwara",
        category: "t-shirt", 
        rating: {
            stars: 4.2,
            count: 120
        },
        priceCents: 1590,
        keywords: ["t-shirt", "clothing", "casual"]
    },
    {
        id: "3",
        image: womenHoddie,
        name: "female sexy hoddies",
        category: "hoodies", 
        rating: {
            stars: 4.2,
            count: 120
        },
        priceCents: 1590,
        keywords: ["t-shirt", "clothing", "casual"]
    },
  
];


export default productLadies;


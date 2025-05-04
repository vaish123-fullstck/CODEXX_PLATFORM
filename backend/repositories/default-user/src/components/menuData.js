import breakFastimg from "../assets/eggbrrrgrrrmuffin.png";
import BurgersImg from "../assets/doublecheeseburger.png";
import BeveragesImg from "../assets/coke.png";
import FishnChickenImg from "../assets/deluxecrspybrrgrr.png";

/* Breakfast */
import HotCakesnSausage from "../assets/breakfast/hotcakesnsausage.png";
import HotCakes from "../assets/breakfast/hotcakes.png";
import Sausageneggcheesebrrrgrrr from "../assets/breakfast/sausageeggcheesebrrrgrrr.png";
import Sausagencheese from "../assets/breakfast/sausgnchs.png";

/* Burgers */
import BaconBrrrgrrr from "../assets/burgers/baconburger.png";
import Bigbrrrgrrr from "../assets/burgers/bigbrrrgrrr.png";
import Cheeseburger from "../assets/burgers/cheeseburger.png";
import Classichambrgr from "../assets/burgers/classichambrgr.png";
import Classicmelt from "../assets/burgers/clscmelt.png";
import Doublecheeseburger from "../assets/burgers/doublecheeseburger.png";

/* Beverages */
import Bottlewater from "../assets/beverages/bottleswater.png";
import Coke from "../assets/beverages/coke.png";
import Drpepper from "../assets/beverages/drpepper.png";
import Fanta from "../assets/beverages/fanta.png";
import Sprite from "../assets/beverages/sprite.png";
import FrozenFanta from "../assets/beverages/frznfanta.png";
import ClassicFrozenCoke from "../assets/beverages/classicfzncoke.png";

/* Fish & Chicken */
import ChickenSandwichImg from "../assets/fishnchicken/deluxecrspybrrgrr.png";
import FishFilletSandwich from "../assets/fishnchicken/fishfilletsandwhich.png";
import SpicyCrispyBrrrgrr from "../assets/fishnchicken/spicycrspybrrgrr.png";

import HotCakesIng from "../assets/ingredients/hotcakes.png";
import Sausage from "../assets/ingredients/sausagepatty.png";
import HotCakesSyrup from "../assets/ingredients/hotcakesyrup.png";
import FoldedEgg from "../assets/ingredients/foldedegg.png";
import Cheese from "../assets/ingredients/cheese.png";
import PotatoBun from "../assets/ingredients/bun.png";
import SmokedBacon from "../assets/ingredients/smokedbacon.png";
import BeefPatty from "../assets/ingredients/beefpatty.png";
import crinkledpickle from "../assets/ingredients/crinkledpickle.png";
import shreddedlettuce from "../assets/ingredients/shreddedlettuce.png";
import onions from "../assets/ingredients/onionss.png";
import tomato from "../assets/ingredients/tomato.png";
import ketchup from "../assets/ingredients/tomatoketchup.png";
import Regularbun from "../assets/ingredients/regularbun.png";
import Ham from "../assets/ingredients/canadianbacon.png";
import caronions from "../assets/ingredients/caronions.png";
import spicysauce from "../assets/ingredients/spicysauce.png";
import tartarsauce from "../assets/ingredients/tartarsauce.png";
import fishfillet from "../assets/ingredients/fishfillet.png";
import crispychickenfillet from "../assets/ingredients/crispychickenfillet.png";
import topbun from "../assets/ingredients/topbun.png";
import bottombun from "../assets/ingredients/bottombun.png";

export const menuCategories = {
  Breakfast: {
    items: [
      { 
        name: "HotCakes N Sausage", 
        price: "$5.99",
        image: HotCakesnSausage,
        description: "Fluffy hotcakes served with savory sausage and rich syrup.",
        ingredients: [
          { name: "Hotcakes", image: HotCakesIng },
          { name: "Sausage", image: Sausage },
          { name: "Hot Cake Syrup ", image: HotCakesSyrup },
        ]
      },
      { 
        name: "HotCakes", 
        price: "$4.49",
        image: HotCakes,
        description: "Golden-brown hotcakes with butter and maple syrup.",
        ingredients: [
          { name: "HotCakes", image: HotCakesIng },
          { name: "Hot Cake Syrup", image: HotCakesSyrup },
        ]
      },
      { 
        name: "Sausage N Egg Cheese Brrrgrrr", 
        price: "$4.99",
        image: Sausageneggcheesebrrrgrrr,
        description: "A warm bun filled with juicy sausage, egg, and melted cheese.",
        ingredients: [
          { name: "Sausage", image: Sausage },
          { name: "Folded Egg", image: FoldedEgg },
          { name: "Cheese", image: Cheese },
        ]
      },
      { 
        name: "Sausage N Cheese", 
        price: "$7.99",
        image: Sausagencheese,
        description: "A simple but delicious sandwich with sausage and melted cheese.",
        ingredients: [
          { name: "Sausage", image: Sausage },
          { name: "Cheese", image: Cheese },
        ]
      },
    ],
    image: breakFastimg,
  },
  Burgers: {
    items: [
      { 
        name: "Bacon Brrrgrrr", 
        price: "$8.49",
        image: BaconBrrrgrrr,
        description: " Price:150 $",
        description:"A juicy beef patty topped with crispy bacon and cheese.",
        ingredients: [
          { name: "Potato Bun", image: PotatoBun},
          { name: "Smoked Bacon", image: SmokedBacon },
          { name: "Beef Patty", image: BeefPatty },
          { name: "American cheese", image: Cheese },
          { name: "Crinkled Pickle", image: crinkledpickle },
          { name: "Shredded Lettuce", image:shreddedlettuce},
          {name:"Onions",image:onions},
          {name:"topbun",image:topbun},
          {name:"bottombun",image:bottombun},

        ]
      },
      { 
        name: "Big Brrrgrrr", 
        price: "$5.99",
        image: Bigbrrrgrrr,
        description: "A double-stacked burger with fresh lettuce, tomato, and our secret sauce.",
        ingredients: [
          { name: "Potato Bun", image: PotatoBun},
          { name: "Beef Patty", image: BeefPatty },
          { name: "American cheese", image: Cheese },
          { name: "Crinkled Pickle", image: crinkledpickle },
          { name: "Shredded Lettuce", image:shreddedlettuce},
          {name:"Onions",image:onions},
          { name: "Tomato Slice", image:tomato},
          {name:"Tomato Ketchup", image:ketchup},
        ]
      },
      { 
        name: "Cheeseburger", 
        price: "$4.49",
        image: Cheeseburger,
        description: "A classic beef patty topped with melted cheese and pickles.",
        ingredients: [
          { name: "Regular Bun", image: Regularbun},
          { name: "Beef Patty", image: BeefPatty },
          { name: "American cheese", image: Cheese },
          { name: "Crinkled Pickle", image: crinkledpickle },
          {name:"Onions",image:onions},
          {name:"Tomato Ketchup", image:ketchup},
        ]
      },
      { 
        name: "Classic Hamburger", 
        price: "$6.29",
        image: Classichambrgr,
        description: "A simple, delicious burger with fresh toppings and a toasted bun.",
        ingredients: [
          { name: "Potato Bun", image: PotatoBun},
          { name: "Canadian Bacon", image: Ham },
          { name: "American cheese", image: Cheese },
          { name: "Crinkled Pickle", image: crinkledpickle },
          {name:"Onions",image:onions},
          {name:"Tomato Ketchup", image:ketchup},
        ]
      },
      { 
        name: "Classic Melt", 
        price: "$4.99",
        image: Classicmelt,
        description: "A cheesy grilled burger melt with caramelized onions.",
        ingredients: [
          { name: "Potato Bun", image: PotatoBun},
          { name: "American cheese", image: Cheese },
          { name: "Crinkled Pickle", image: crinkledpickle },
          {name:"Tomato Ketchup", image:ketchup},
          {name:"Caramalized Onions", image:caronions},
        ]
      },
      { 
        name: "Double Cheeseburger", 
        price: "$7.99",
        image: Doublecheeseburger,
        description: "Two beef patties stacked with double the cheese and flavor.",
        ingredients: [
          { name: "Potato Bun", image: PotatoBun},
          { name: "Beef Patty", image: BeefPatty },
          { name: "American cheese", image: Cheese },
          { name: "Crinkled Pickle", image: crinkledpickle },
          { name: "Shredded Lettuce", image:shreddedlettuce},
          {name:"Onions",image:onions},
          { name: "Tomato Slice", image:tomato},
          {name:"Tomato Ketchup", image:ketchup},
          {name:"Spicy Sauce", image:spicysauce},
        ]
      },
    ],
    image: BurgersImg,
  },
  Beverages: {
    items: [
      { 
        name: "Coke", 
        price:"$1.00",
        image: Coke,
        description: "A refreshing, ice-cold Coca-Cola classic."
      },
      { 
        name: "Fanta", 
        price:"$1.00",
        image: Fanta,
        description: "Sweet, fruity, and fizzy orange-flavored soda."
      },
      { 
        name: "Dr Pepper", 
        price:"$1.00",
        image: Drpepper,
        description: "A unique blend of 23 flavors in a classic soft drink."
      },
      { 
        name: "Bottle Water", 
        price:"$1.00",
        image: Bottlewater,
        description: "Cool, crisp, and refreshing bottled water."
      },
      { 
        name: "Classic Frozen Coke", 
        price:"$1.00",
        image: ClassicFrozenCoke,
        description: "A frozen version of your favorite Coke, perfect for hot days."
      },
      { 
        name: "Classic Frozen Fanta", 
        price:"$1.00",
        image: FrozenFanta,
        description: "A slushy, fruity, frozen Fanta drink."
      },
      { 
        name: "Sprite", 
        price:"$1.00",
        image: Sprite,
        description: "A crisp, lemon-lime soda with a refreshing taste."
      },
    ],
    image: BeveragesImg,
  },
  FishnChicken: {
    items: [
      { 
        name: "Deluxe Crispy Chicken Sandwich", 
        price: "$5.99",
        image: ChickenSandwichImg,
        description: "A crispy chicken fillet topped with lettuce, tomato, and mayo.",
        ingredients: [
          { name: "Crispy chicken fillet", image: crispychickenfillet},
          { name: "Potato Bun", image:PotatoBun},
          { name: "American cheese", image: Cheese },
          { name: "Crinkled Pickle", image: crinkledpickle },
          {name:"Tomato Ketchup", image:ketchup},
          {name:"Caramalized Onions", image:caronions},
        ]
      },
      { 
        name: "Fish Fillet Sandwich", 
        price: "$4.49",
        image: FishFilletSandwich,
        description: "A crispy fish fillet with tartar sauce on a soft bun.",
        ingredients: [
          { name: "Fish fillet", image:fishfillet},
          { name: "Potato Bun", image:PotatoBun},
          { name: "Tartar sauce", image: tartarsauce},
          {name:"Caramalized Onions", image:caronions},
        ]
      },
      { 
        name: "Spicy Crispy Brrrgrrr", 
        price: "$6.29",
        image: SpicyCrispyBrrrgrr,
        description: "A crispy chicken burger with a spicy kick.",
        ingredients: [
          { name: "Crispy Chicken Fillet", image:crispychickenfillet},
          { name: "Potato Bun", image:PotatoBun},
          { name: "Spicy Sauce", image: spicysauce},
          {name:"Caramalized Onions", image:caronions},
        ]
      },
    ],
    image: FishnChickenImg,
  },
};

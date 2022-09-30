const page = document.location.href;

if (page.match("cart")) {
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((objetProduits) => {
      console.log(objetProduits);
      affichagePanier(objetProduits);
  })
  .catch((err) => {
      document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
      console.log("erreur 404, sur ressource api: " + err);
  });
} else {
  console.log("sur page confirmation");
}

function affichagePanier(index) {
  let panier = JSON.parse(localStorage.getItem("panierStocké"));
   if (panier && panier.length != 0) {
    for (let choix of panier) {
      console.log(choix);
      for (let g = 0, h = index.length; g < h; g++) {
        if (choix._id === index[g]._id) {
          choix.name = index[g].name;
          choix.prix = index[g].price;
          choix.image = index[g].imageUrl;
          choix.description = index[g].description;
          choix.alt = index[g].altTxt;
        }
      }
    }
    affiche(panier);
  } else {
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML =
      "Vous n'avez pas d'article dans votre panier";
  }
  modifQuantité();
  suppression();
}

function affiche(indexé) {
  let zonePanier = document.querySelector("#cart__items");
  zonePanier.innerHTML += indexé.map((choix) => 
  `<article class="cart__item" data-id="${choix._id}" data-couleur="${choix.couleur}" data-quantité="${choix.quantité}" data-prix="${choix.prix}"> 
    <div class="cart__item__img">
      <img src="${choix.image}" alt="${choix.alt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${choix.name}</h2>
        <span>couleur : ${choix.couleur}</span>
        <p data-prix="${choix.prix}">${choix.prix} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${choix.quantité}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem" data-id="${choix._id}" data-couleur="${choix.couleur}">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
    ).join(""); 
  totalProduit();
}

function modifQuantité() {
  const cart = document.querySelectorAll(".cart__item");
  cart.forEach((cart) => {
    cart.addEventListener("change", (eq) => {
      let panier = JSON.parse(localStorage.getItem("panierStocké"));
      for (article of panier)
        if (
          article._id === cart.dataset.id &&
          cart.dataset.couleur === article.couleur
        ) {
          article.quantité = eq.target.value;
          localStorage.panierStocké = JSON.stringify(panier);
          cart.dataset.quantité = eq.target.value;
          totalProduit();
        }
    });
  });
}

function suppression() {
  const cartdelete = document.querySelectorAll(".cart__item .deleteItem");
  cartdelete.forEach((cartdelete) => {
    cartdelete.addEventListener("click", () => {
      let panier = JSON.parse(localStorage.getItem("panierStocké"));
      for (let d = 0, c = panier.length; d < c; d++)
        if (
          panier[d]._id === cartdelete.dataset.id &&
          panier[d].couleur === cartdelete.dataset.couleur
        ) {
          const num = [d];
          let nouveauPanier = JSON.parse(localStorage.getItem("panierStocké"));
          nouveauPanier.splice(num, 1);
          if (nouveauPanier && nouveauPanier.length == 0) {
            document.querySelector("#totalQuantity").innerHTML = "0";
            document.querySelector("#totalPrice").innerHTML = "0";
            document.querySelector("h1").innerHTML =
              "Vous n'avez pas d'article dans votre panier";
          }
          localStorage.panierStocké = JSON.stringify(nouveauPanier);
          return location.reload();
        }
    });
  });
}

function totalProduit() {
  let totalArticle = 0;
  let totalPrix = 0;
  const cart = document.querySelectorAll(".cart__item");
  cart.forEach((cart) => {
    totalArticle += JSON.parse(cart.dataset.quantité);
    totalPrix += cart.dataset.quantité + cart.dataset.prix;
  });
  document.getElementById("totalQuantity").textContent = totalArticle;
  document.getElementById("totalPrice").textContent = totalPrix;
}
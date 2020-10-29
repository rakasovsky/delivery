const  cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close-button");

 const authButton = document.querySelector(".auth-button");
 const  modalAuth = document.querySelector(".modal-auth");
 const  closeAuth = document.querySelector(".close-auth");
 const logInForm = document.querySelector("#logInForm");

 const loginInput = document.querySelector("#login");
 const userName = document.querySelector(".user-name");
 const buttonOut = document.querySelector(".button-out");


const cardsRestaurants = document.querySelector(".resto-select_bottom");
const containerPromo = document.querySelector(".container-promo");
const restoSelect = document.querySelector(".resto-select");
const menu = document.querySelector(".menu");
const logo = document.querySelectorAll(".logo");

const cardMenu = document.querySelector(".cards-menu")

let login = localStorage.getItem('delivery');


const getData = async function(url){

    const response = await fetch(url);

    if(!response.ok){
        throw  new Error(`Error in ${url}, error status ${response.status}`);
    }

   return await response.json();
};

getData('./db/partners.json')



const toggleModal = function() {
    modal.classList.toggle("is-open")
};


const toggleModalAuth = function() {
     modalAuth.classList.toggle("is-open")
 };


 
 function authorized() {

     function logOut() {
         login = '';

         localStorage.removeItem('delivery')
         authButton.style.display = 'block';
         userName.style.display = 'none';
         buttonOut.style.display = 'none';

         buttonOut.removeEventListener('click', logOut)

         checkAuth();
     }

     console.log('Authozired')

     userName.textContent = login;

     authButton.style.display = 'none';
     userName.style.display = 'inline';
     buttonOut.style.display = 'block';


     buttonOut.addEventListener('click', logOut)
 }

 function notAuthorized() {
     console.log('Not Authorized')

     function logIn(event) {
         event.preventDefault();
         login = loginInput.value;

         localStorage.setItem('delivery', login);

         toggleModalAuth();
         authButton.removeEventListener("click", toggleModalAuth);
         closeAuth.removeEventListener("click", toggleModalAuth);
         logInForm.removeEventListener('submit', logIn);

         logInForm.reset();
         checkAuth();
     }

     authButton.addEventListener("click", toggleModalAuth);
     closeAuth.addEventListener("click", toggleModalAuth);
     logInForm.addEventListener('submit', logIn);
 }

 function checkAuth() {
     if(login) {
         authorized();
     } else {
         notAuthorized();
     }
 }


 
 
 
 function createCardRestaurant(resto) {

     const { name, time_of_delivery: tOd, price, stars, kitchen, image, products  } = resto;

     const card = `
      <a  class="resto-card" data-products="${products}">
            <img src="${image}" alt="" class="resto_img">
            <div class="card-info">
                <div class="card-info_top">
                    <span class="text-medium">
                        ${name}
                    </span>
                    <span class="card_info_time">
                        ${tOd}
                    </span>
                </div>
                <div class="card-info_bottom">
                    <span class="card_info-star">
                        <img src="assets/img/icons/star.svg" alt="star">
                        <span class="star_yellow">${stars}</span>
                    </span>
                    <span>
                        От ${price} грн
                    </span>
                    <span class="card-info-ellipse">
                        <img src="assets/img/icons/ellipse.svg" alt="">
                    </span>
                    <span class="category">
                       ${kitchen}
                    </span>
                </div>
            </div>
        </a>
    `;

     cardsRestaurants.insertAdjacentHTML('afterbegin', card)
 }

// createCardRestaurant();


function createCardGood({ description, id, image, name, price }) {
    const card = document.createElement('div');
    card.className = 'card';

    card.insertAdjacentHTML('afterbegin', `
                <img src="${image}" alt="image" class="card-image">
                <div class="card-text">
                    <div class="card-heading">
                        <h3 class="card-title card-title-reg">${name}</h3>
                    </div>
                 
                    <div class="card-info">
                        <div class="ingredients">
                            ${description}
                        </div>
                    </div>
                 
                    <div class="card-buttons">
                        <button class="button button-primary button-add-cart">
                            <span class="button-card-text">В корзину</span>
                            <span class="button-cart-svg"></span>
                        </button>
                        <strong class="card-price-bold">${price}</strong>
                    </div>
                </div>
    `);


    cardMenu.insertAdjacentElement('afterbegin', card)
}

function openGoods(event) {
    const target = event.target;

    if(login){

        const restaurant = target.closest('.resto-card');
        if (restaurant) {
            cardMenu.textContent = '';
            containerPromo.classList.add('hide');
            restoSelect.classList.add('hide');
            menu.classList.remove('hide');
            getData(`./db/${restaurant.dataset.products}`).then(function (data) {
                data.forEach(createCardGood)
            });
            // createCardGood();
        }
    } else {
        toggleModalAuth();
    }



}





function init() {
    getData('./db/partners.json').then(function (data) {
        data.forEach(createCardRestaurant)
    });

    cartButton.addEventListener("click", toggleModal);
    close.addEventListener("click", toggleModal);
    cardsRestaurants.addEventListener('click', openGoods);
    logo.forEach(function (f) {
        f.addEventListener('click', function () {
            containerPromo.classList.remove('hide');
            restoSelect.classList.remove('hide');
            menu.classList.add('hide')})
    });

    checkAuth();
}

init();

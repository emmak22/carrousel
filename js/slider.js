'use strict';   // Mode strict du JavaScript

/*************************************************************************************************/
/* ****************************************** DONNEES ****************************************** */
/*************************************************************************************************/
// Codes des touches du clavier.
const SPACE_KEY= 'Space';
const LEFT_ARROW_KEY = 'ArrowLeft';
const RIGHT_ARROW_KEY = 'ArrowRight';

// La liste des slides du carrousel. tableau d'objets qui possèderont 'url de l'image et la légende (const)
const slides =
[
    { image: 'images/1.jpg', legend: 'Street Art'          },
    { image: 'images/2.jpg', legend: 'Fast Lane'           },
    { image: 'images/3.jpg', legend: 'Colorful Building'   },
    { image: 'images/4.jpg', legend: 'Skyscrapers'         },
    { image: 'images/5.jpg', legend: 'City by night'       },
    { image: 'images/6.jpg', legend: 'Tour Eiffel la nuit' }
];
//slides[state.index].image
// Objet contenant l'état du carrousel.
let state;


/*************************************************************************************************/
/* ***************************************** FONCTIONS ***************************************** */
/*************************************************************************************************/
//passe à l'image suivante
function onSliderGoToNext()
{
    // Passage à la slide suivante.
    state.index++;
    // Est-ce qu'on est arrivé à la fin de la liste des slides ?
    if(state.index == slides.length)
    {
        // Oui, on revient au début (le carrousel est circulaire).
        state.index = 0;
    }   
    // Mise à jour de l'affichage.
    refreshSlider();
}

//passe à l'image précédente
function onSliderGoToPrevious()
{
    // Passage à la slide précédente.
    state.index--;
    // Est-ce qu'on est revenu au début de la liste des slides ?
    if(state.index < 0) {

        // Oui, on revient à la fin (le carrousel est circulaire).
        state.index = slides.length - 1;
    }    
    // Mise à jour de l'affichage.
    refreshSlider();
}

//va afficher une image au hasard
function onSliderGoToRandom()
{
    let index;
    
    //boucle de validation (do while)
    do
    {
        /*
         * Récupération d'un numéro de slide aléatoire différent
         * du numéro de slide actuel.
         */
        index = getRandomInteger(0, slides.length - 1);
    }
    while(index == state.index);
         
    // Passage à une slide aléatoire.
    state.index = index;
    // Mise à jour de l'affichage.
    refreshSlider();
}


/*
 * Quand on créé un gestionnaire d'évènements, le navigateur appelle la
 * fonction en fournissant un argument event représentant l'évènement lui-même.
 *
 * Si le gestionnaire d'évènements n'a pas besoin de cet argument,
 * inutile de le déclarer !
 *
 * Mais ici on va en avoir besoin...
 */
//lorsque l'on manipule avec le clavier
function onSliderKeyUp(event)
{
    
    /*
     * Les gestionnaires d'évènements d'appui sur une touche (évènements
     * keydown, keyup, keypress) contiennent une propriété keyCode dans l'objet
     * event représentant le code de la touche du clavier.
     *
     * Il existe de très nombreux codes, plus ou moins standards, voir la page :
     * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
     */
     
     //condition avec event.code selon la touche qu'il appui, on déclenche une fonction. (image suivante, précedent ou play/pause)
     switch(event.code)
    {
        case RIGHT_ARROW_KEY:
        // On passe à la slide suivante.
        onSliderGoToNext();
        break;

        case SPACE_KEY:
        // On démarre ou on arrête le carrousel.
        onSliderToggle();
        break;

        case LEFT_ARROW_KEY:
        // On passe à la slide précédente.
        onSliderGoToPrevious();
        break;
    }
     
}

//lance la lecture automatique ou la stop
function onSliderToggle()
{
    console.log(this)
    // Modification de l'icône du bouton pour démarrer ou arrêter le carrousel. (jouer avec les classes des icons fontawesome)
    const icon = document.querySelector('#slider-toggle i');

    icon.classList.toggle('fa-play');
    icon.classList.toggle('fa-pause');

    //Si le carrousel n'est pas démarré ?
    if(state.timer == null) {
        // démarrage du carousel, toutes les deux secondes.
        state.timer = window.setInterval(onSliderGoToNext, 2000);
        /*
         * Modification du libellé du bouton en mode "OFF".
         *
         * La variable spéciale this est automatiquement initialisée par le
         * navigateur avec l'objet DOM qui a déclenché l'évènement.
         *
         * C'est le bouton "Démarrer/Arrêter le carrousel" qui a déclenché
         * l'évènement, donc la variable spéciale this vaut la même chose
         * que l'objet renvoyé par document.querySelector('#js-slider-toggle');
         */
         this.title = 'Arrêter le carrousel';
    //sinon
    }else{
        // arrêt du carousel.
        window.clearInterval(state.timer);
        // Réinitialisation de la propriété pour le prochain clic sur le bouton.
        state.timer = null;
        /*
         * Modification du libellé du bouton en mode "ON".
         *
         * La variable spéciale this est automatiquement initialisée par le
         * navigateur avec l'objet DOM qui a déclenché l'évènement.
         *
         * C'est le bouton "Démarrer/Arrêter le carrousel" qui a déclenché
         * l'évènement, donc la variable spéciale this vaut la même chose
         * que l'objet renvoyé par document.querySelector('#js-slider-toggle');
         */
         this.title = 'Démarrer le carrousel';
    }     
}

//fonction qui va afficher ou cacher la barre de menu
function onToolbarToggle()
{
    // Modification de l'icône du lien pour afficher ou cacher la barre d'outils.
    const icon = document.querySelector('#toolbar-toggle i');

    icon.classList.toggle('fa-arrow-down');
    icon.classList.toggle('fa-arrow-right');
    // Affiche ou cache la barre d'outils.
    document.querySelector('.toolbar ul').classList.toggle('hide');
}

//mise à jour de l'image et de sa légende
function refreshSlider()
{
    // Recherche des balises de contenu du carrousel.
    const sliderImage  = document.querySelector('#slider img');
    const sliderLegend = document.querySelector('#slider figcaption');
    // Changement de la source de l'image et du texte de la légende du carrousel.
    sliderImage.src          = slides[state.index].image;
    sliderLegend.textContent = slides[state.index].legend;
    
}
/*************************************************************************************************/
/* ************************************** CODE PRINCIPAL *************************************** */
/*************************************************************************************************/

/*
 * Installation d'un gestionnaire d'évènement déclenché quand l'arbre DOM sera
 * totalement construit par le navigateur.
 *
 * Le gestionnaire d'évènement est une fonction anonyme que l'on donne en deuxième
 * argument directement à document.addEventListener().
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du carrousel.
    state       = {};
    state.index = 0;                   // On commence à la première slide
    state.timer = null;                // Le carrousel est arrêté au démarrage
    
    // Installation des gestionnaires d'évènement. (fonction utilities)
    installEventHandler('#slider-random', 'click', onSliderGoToRandom);
    installEventHandler('#slider-previous', 'click', onSliderGoToPrevious);
    installEventHandler('#slider-next', 'click', onSliderGoToNext);
    installEventHandler('#slider-toggle', 'click', onSliderToggle);
    installEventHandler('#toolbar-toggle', 'click', onToolbarToggle);
    /*
     * L'évènement d'appui sur une touche doit être installé sur l'ensemble de la
     * page, on ne recherche pas une balise en particulier dans l'arbre DOM.
     *
     * L'ensemble de la page c'est la balise <html> et donc la variable document.
     */
     document.addEventListener('keyup', onSliderKeyUp);
     
     // Affichage initial.
    refreshSlider();
    
    /*document.addEventListener("keydown", function(e){
        
        //e.preventDefault()     vire le comportement par défaut du navigateur
        console.log("event code", e.code) //CELUI-CI 
        console.log("event keyCode", e.keyCode)
        console.log("event key", e.key)
    })
    
    let test = document.querySelector("#test")
    test.addEventListener("click", (e)=>{
        e.preventDefault();
        if(test.innerHTML == "Play"){
            test.innerHTML = "Stop"
        }else{
            test.innerHTML = "Play"
        }
    })*/
    
})


/*
 si on attribut nos fonction annonymes à une constante, alors elles deviennent des fonctions nommées et donc plus anonymes
const maFonction = function(){
    console.log("coucou")
}

//pareil qu'une fonction classique
function maFonctionIdem(){
    console.log("coucou")
}

const maFonctionFleche = () => {
    console.log("coucou")
}

du coup comme elle ne sont plus anonymes, nous pourrons les appeler comme des fonctions classiques

maFonction()

maFonction2()

document.body.addEventListener("click", maFonction)

//tant que l'utilisateur cliquera sur refuser, il renverra ma demande de validation

//tu m'executer le confirm tant que la variable ok n'est pas true
let ok;
do{
    ok = window.confirm("valider ou refuser?")
}while(ok !== true)

//tant que ok est false tu m'execute un confirm

while(ok === false){
    ok = window.confirm("valider ou refuser?")
}


const array1 = ['a', 'b', 'c'];

//syntaxe propre à un instruction unique sur une ligne elle fait le return automatique
array1.forEach(element => console.log(element));

//syntaxe pour de multiples instructions on doit envoyer nous même un return
array1.forEach((element) => {
    console.log("coucou")
    console.log(element)
    return element
})

//imaginons que nous sommes dans un code JSX de react (HTML + JS compilés)

const array2 = [
{id: 20, nom: "coca"},
{id: 155, nom: "fanta"},
{id: 232, nom: "pepsi"},
]


<div>
    <h2>Ma liste</h2>
    
    {array2.map((element) => {
    
        return (
            <div key={element.id}>
                <p>{element.name}</p>
            </div>
        )
    })
    
    }

</div>

//si jamais nos éléments n'ont pas d'index de référence, on va devoir le créer avec notre boucle map

<div>
    <h2>Ma liste</h2>
    
    {array2.map((element, index) => {
    
        return (
            <div key={index}>
                <p>{element.name}</p>
            </div>
        )
    })
    
    }

</div>

*/
const divButtonFilter = document.querySelector('.bouttons');
let dataWorks = [];
let dataWorksFiltered = [];
let dataCategories = [];

// Recup données Api
async function dataApi() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const data = await response.json();
        dataWorks = data;
        showWorks(dataWorks);
        modalWorks(dataWorks);
    } catch {
        console.log('error');
    }
};


// Recup les "categories" de l'API
async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();
    dataCategories = data;

    // création des boutons dans l'html avec les données de l'api ( titre et id )
    dataCategories.map((category) => {
        const button = document.createElement('button');
        button.dataset.id = category.id;
        button.textContent = category.name;
        divButtonFilter.appendChild(button);
    })
};

// fonction qui permet de créer img en html provenant de l'api et de l'afficher
function showWorks(data) {
    const imgCategories = document.querySelector(".gallery");
    imgCategories.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        const figure = document.createElement("figure");
        // Affiche images
        figure.innerHTML = `
      <img src="${data[i].imageUrl}" alt="${data[i].title}" crossorigin="anonymous">
      <figcaption>${data[i].title}</figcaption>
    `;
        imgCategories.appendChild(figure);
    }
};



// Fonction pour filtrer les travaux selons leurs catégories
function filtrerCategories() {
    dataWorksFiltered = dataWorks;
    const buttonFilters = document.querySelectorAll('.bouttons button');
    buttonFilters.forEach((buttonFilter) => buttonFilter.addEventListener('click', () => {
        buttonFilters.forEach((buttonFilter2) => buttonFilter2.classList.remove('selected'));
        buttonFilter.classList.add('selected');
        if (!buttonFilter.classList.contains('all')) {
            showWorks(dataWorksFiltered.filter((work) => work.categoryId == buttonFilter.dataset.id));
        } else {
            showWorks(dataWorks)
        }
    }))
};

addEventListener('DOMContentLoaded', async (e) => {
    await dataApi();
    await fetchCategories();
    await filtrerCategories();
     
})


// Get the modal
const modal = document.getElementById("modaleuser");
const modalback = document.querySelector(".modalback2");

// Get the button that opens the modal
const btn = document.getElementById("btnmodal");

// Get the <span> element that closes the modal
const span = document.querySelector(".close");


 // récupère éléments de la last MODALE
const modal2 = document.querySelector(".modaladd");
const modal3 = document.querySelector(".modalback");


// close window de la première modale
span.onclick = function() {
  modal.style.display = "none";
  modalback.style.display = "none";
 

}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalback ) {
    modal.style.display = "none";
    modalback.style.display = "none";
    modal3.style.display = "none";
    modal2.style.display="none"
   
  }

  if (event.target == modal2 ) {
    modal3.style.display = "none";
    modal2.style.display="none";
    modalback.style.display = "none";
   
  }
}






// Get the button that opens the modal
const btn2 = document.getElementById("btnadd");

// Modal1
btn.onclick = function() {
  modal.style.display = "block";
  modalback.style.display = "flex";
}

// MODAL 2
btn2.onclick = function() {
    modal.style.display = "none";
    modal2.style.display = "flex";
    modal3.style.display = "block";
}

const btnback = document.querySelector(".fa-arrow-left")
const close2 = document.getElementById("close")


btnback.onclick = function() {
  modal.style.display = "block";
    modal2.style.display = "none";
}

// close window de la last MODAL
close2.onclick = function() {
  modal3.style.display = "none";
  modal2.style.display = "none";
  modal.style.display = "none";
  modalback.style.display = "none";
}


// affiche works dans la modal
function modalWorks(data) {
    const modalGall = document.querySelector(".modal_gallery");
    modalGall.innerHTML = "";
  
    
    for (let i = 0; i < data.length; i++) {
      // Création d' éléments pour l'affichage des travaux
      const figure = document.createElement("figure");
      const deleteIcon = document.createElement("div");
      deleteIcon.classList.add("delete_icon");
      deleteIcon.value = data[i].id;
      // Affichage des works
      figure.innerHTML = `
                  <img src="${data[i].imageUrl}" alt="${data[i].title}" crossorigin="anonymous">
                  <figcaption>éditer</figcaption>
              `;
              // affiche icon delete
         deleteIcon.innerHTML = `<i class="fa-regular fa-trash-can fa-2xs"></i>
`;

              const galleryEl = document.querySelector(".modal_gallery");
              galleryEl.appendChild(figure);
              figure.appendChild(deleteIcon);


              const id = data[i].id;

              // FONCTION delete IMG
              async function deleteElement(e) {
                        
                let id = deleteIcon.value;

              let response = await fetch("http://localhost:5678/api/works" + "/" + id, {
                      method: "DELETE",
                      headers: {'Authorization': `Bearer ${window.localStorage.getItem('accessToken')}`}
                      
                    });
   
      
              if (response.status === 200 || 204) {
                udateWorks();
              } else if (response.status === 401 || 400) {
                console.log("erreur");
              }
            }

            deleteIcon.addEventListener("click", deleteElement);
                    
            }
        }


  // recup token de l'admin

  const token = window.localStorage.getItem("accessToken");

  // fonction déconnexion
  function logOut(e) {
    localStorage.clear();
  };


// si connecté apparition barre admin et logout

const log = document.querySelector('.login');

if (token !== null) {
  log.innerHTML = " ";
  log.innerHTML = "logout";
  log.addEventListener("click", logOut);
  const adminBar = document.querySelector(".head");
  adminBar.style.display = "flex";
  const edit = document.querySelector(".modifier");
  edit.style.display = "block";


}





// AFFICHER IMG dans la modal d'ajout


const inputFile = document.querySelector("#image");

// Listener pour load la new img
inputFile.addEventListener("change", loadFile);


// afficher la new img
function loadFile(e) {
  e.preventDefault();


  const reader = new FileReader();
  reader.addEventListener("load", function () {
    viewImg.src = reader.result;
  });
  // Lecture de l'image
  reader.readAsDataURL(inputFile.files[0]);

  // style de la new img
  const picture = document.querySelector(".addphoto");
  const label = document.querySelector(".addphoto > label");
  const viewImg = document.createElement("img");
  viewImg.setAttribute("id", "preview_image");

  picture.appendChild(viewImg);

  label.style.opacity = "0";
  viewImg.style.position = "absolute";
  viewImg.style.objectFit = "contain";
  viewImg.style.height = "170px";
  viewImg.style.margin = "auto";
  viewImg.style.margin ="0px 44px";
  viewImg.style.opacity =  "1"
};



// Ajouter new img à la gallerie

const validerBtn = document.querySelector(".valider");


async function addWork() {
  
  
 
  const inputPicture = document.getElementById("image").files[0];
  const inputTitle = document.getElementById("title").value;
  const inputCategorie = document.getElementById("categories").value;
  

  // envoie données du formulaire new img
  const formData = new FormData();
  formData.append("image", inputPicture);
  formData.append("title", inputTitle);
  formData.append("category", inputCategorie);

  // POST request api

  let response = await fetch("http://localhost:5678/api/works" , {
    method: "POST",
    headers: 
       {'Authorization': `Bearer ${window.localStorage.getItem('accessToken')}`},
    
    body: formData,
  });

 

  
  if (response.status === 200 || 204) {
    udateWorks();
    modal3.style.display = "none";
    modal2.style.display = "none";
    modal.style.display = "none";
    modalback.style.display= "none";
   
    
    
  } else if (response.status === 401 || 400) {
    alert('erreur');
    console.log("Erreur");
  };
};


validerBtn.addEventListener("click", (e)=> {
  e.preventDefault;
  addWork();
  console.log("TEST");
  

});




function udateWorks() {
  dataApi();
};




function CreateGuid() {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

const reducerHT = (previousValue, currentValue) => previousValue + parseFloat(currentValue.montant);
const reducerTVA = (previousValue, currentValue) => previousValue + parseFloat(currentValue.montantTVA);

const calculTotaux = ()=>{
    let total = articles.reduce(reducerHT, 0);
    let totalTVA = articles.reduce(reducerTVA, 0);
    let totalTTC = total + totalTVA;
    $(`.total`).text(`${total}`);
    $(`.total-tva`).text(`${totalTVA}`);
    $(`.total-ttc`).text(`${totalTTC}`);
}

let articles = []

// Insertion de la ligne d'un article
function addLine(article, idx){
    
    
    idx = idx || articles.length;
    $('.tab-lines').append(
        `
        <tr id="${article.id}">
            <th scope="row">${idx}</th>
            <td>
                <div class="textarea designation" contenteditable>${article.designation}</div>
            </td>
            <td>
                <div class="textarea montant" contenteditable>${article.montant}</div>
            </td>
            <td>
                <div class="textarea tva" contenteditable>${article.tva}</div>
            </td>
            <td>
                <div class="mtva">${article.montantTVA}</div>
            </td>
            <td>
                <div class="mttc">${article.montantTTC}</div>
            </td>
            <td>
                <button type="button" class="delete btn btn-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
                        viewBox="0 0 16 16">
                        <path
                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z">
                        </path>
                        <path fill-rule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z">
                        </path>
                    </svg>
                </button>
            </td>
        </tr>
        `
    );

    // Evenement de modification du nom d'un article
    $(`#${article.id} .designation`).on('input',()=>{
        let design = $(`#${article.id} .designation`).text();
        let art = articles.find(ar => ar.id == article.id);
        art.designation = design;

    });

    // Evenement de modification du montant
    $(`#${article.id} .montant`).on('input',()=>{
        let montant = $(`#${article.id} .montant`).text();
        let art = articles.find(ar => ar.id == article.id);
        art.montant = montant;

        let mtva = parseFloat(art.montant)*parseFloat(art.tva)/100;
        let mttc = parseFloat(art.montant) + mtva;
        art.montantTTC = mttc;
        art.montantTVA = mtva;
        $(`#${article.id} .mttc`).text(`${mttc}`);
        $(`#${article.id} .mtva`).text(`${mtva}`);

        calculTotaux();

    });

    // Evenement de modification de la TVA
    $(`#${article.id} .tva`).on('input',()=>{
        let tva = $(`#${article.id} .tva`).text();
        let art = articles.find(ar => ar.id == article.id);
        art.tva = tva;

        let mtva = parseFloat(art.montant)*parseFloat(art.tva)/100;
        let mttc = parseFloat(art.montant) + mtva;
        art.montantTTC = mttc;
        art.montantTVA = mtva;
        $(`#${article.id} .mttc`).text(`${mttc}`);
        $(`#${article.id} .mtva`).text(`${mtva}`);

        calculTotaux();

    });

    // Evenement de suppression d'un article
    $(`#${article.id} .delete`).on('click',()=>{
        let newArticles = articles.filter(a => a.id != article.id);
        articles = [...newArticles];
        $(`.tab-lines`).empty();
        $('.delete').off();
        addLines();

        calculTotaux();

    });

}

// Insertion de toutes les lignes
function addLines(){
    articles.forEach((ar, idx) =>{
        addLine(ar, idx+1);

    })
}

// Evenement d'ajout d'une nouvelle ligne
$('.add-line').on('click', () => {
    let article = {
        id: CreateGuid(),
        designation: "",
        montant: "",
        tva: "",
        montantTVA:"",
        montantTTC: ""
    }
    articles.push(article);
    addLine(article);

});
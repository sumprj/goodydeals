window.onload = function () {
    const categoryHeaderElement = document.getElementById("category-header");
    const skuidHeaderElement = document.getElementById("skuid-header");
    const titleHeaderElement = document.getElementById("title-header");
    const priceHeaderElement = document.getElementById("price-header");
    
    const categoryTogglerElement = document.getElementById("category-toggler");
    const skuidTogglerElement = document.getElementById("skuid-toggler");
    const titleTogglerElement = document.getElementById("title-toggler");
    const priceTogglerElement = document.getElementById("price-toggler");
    
    const toggleOn = {
        category:false,
        skuid: false,
        title: false,
        price: false
    }

    const categoryToggler = toggle(categoryHeaderElement, categoryTogglerElement, true);
    const skuidToggler = toggle(skuidHeaderElement, skuidTogglerElement, true);
    const titleToggler = toggle(titleHeaderElement,titleTogglerElement, true);
    const priceToggler = toggle(priceHeaderElement,priceTogglerElement, true);
    
    categoryToggler('click', '▲', '▼', () => {
        makeToggleVisible('category',categoryTogglerElement);
        allItems.sort(compareByCategoryAsc);
        updateTable(allItems);
    }, () => {
        makeToggleVisible('category',categoryTogglerElement);
        allItems.sort(compareByCategoryDesc);
        updateTable(allItems);    
    });

    skuidToggler('click', '▲', '▼', () => {
        makeToggleVisible('skuid',skuidTogglerElement);
        allItems.sort(compareBySkuidAsc);
        updateTable(allItems);
    }, () => {
        makeToggleVisible('skuid',skuidTogglerElement);
        allItems.sort(compareBySkuidDesc);
        updateTable(allItems);    
    });
    
    titleToggler('click', '▲', '▼', () => {
        makeToggleVisible('title',titleTogglerElement);
        allItems.sort(compareByTitleAsc);
        updateTable(allItems);
    }, () => {
        makeToggleVisible('title',titleTogglerElement);
        allItems.sort(compareByTitleDesc);
        updateTable(allItems);    
    });

    priceToggler('click', '▲', '▼', () => {
        makeToggleVisible('price',priceTogglerElement);
        allItems.sort(compareByPriceAsc);
        updateTable(allItems);
    }, () => {
        makeToggleVisible('price',priceTogglerElement);
        allItems.sort(compareByPriceDesc);
        updateTable(allItems);    
    });


    function makeToggleVisible(element, htmlElement){
        if(!toggleOn[element]){
            closeAllToggle();
            toggleOn[element] = true;
            htmlElement.classList.remove('invisible');
        }
    }

    function closeAllToggle(){
        if(toggleOn.category){ 
            toggleOn.category = false;
            categoryTogglerElement.classList.add('invisible');
        }else if(toggleOn.skuid){
            toggleOn.skuid = false;
            skuidTogglerElement.classList.add('invisible');
        }else if(toggleOn.title){
            toggleOn.title = false;
            titleTogglerElement.classList.add('invisible');
        }else if(toggleOn.price){
            toggleOn.price = false;
            priceTogglerElement.classList.add('invisible');
        }
    }
}


function updateTable(arr){
    for(let index = 0; index < arr.length; index++) {
        document.getElementById("category-"+(index+1)).innerHTML = arr[index].category;
        document.getElementById("skuid-"+(index+1)).innerHTML = arr[index].skuid;
        document.getElementById("title-"+(index+1)).innerHTML = arr[index].title;
        let normalizedDesc = arr[index].description;
        if(normalizedDesc.length>20)
            normalizedDesc = normalizedDesc.substring(0,20)+"..."
        document.getElementById("description-"+(index+1)).innerHTML = normalizedDesc;
        document.getElementById("price-"+(index+1)).innerHTML = arr[index].price;
    }
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {boolean} initialValue 
 * @returns @function
 */
function toggle(elementEvent, elementValue, initialValue) {
    let toggleBooleanValue = initialValue;

    /**
     * 
     * @param {string} event 
     * @param {string} toggleValueOnTrue 
     * @param {string} toggleValueOnFalse 
     * @param {function} callBackOnTrue - Callback when toggle value will be true
     * @param {function} callBackOnFalse - Callback when toggle value will be false
     */
    return function (event, toggleValueOnTrue, toggleValueOnFalse, callBackOnTrue, callBackOnFalse) {
        elementEvent.addEventListener(event, () => {
            
            if (toggleBooleanValue) {
                elementValue.innerHTML = toggleValueOnTrue;
                callBackOnTrue();
            }
            else {
                elementValue.innerHTML = toggleValueOnFalse;
                callBackOnFalse();
            }
            toggleBooleanValue = !toggleBooleanValue;
        });
    }
}

function compareByCategoryAsc(item2, item1){
    return item2.category.localeCompare(item1.category)
}

function compareByCategoryDesc(item2, item1){
    return -item2.category.localeCompare(item1.category) 
}

function compareBySkuidAsc(item2, item1){
    return item2.skuid.localeCompare(item1.skuid)    
}

function compareBySkuidDesc(item2, item1){
    return -item2.skuid.localeCompare(item1.skuid)    
}

function compareByTitleAsc(item2, item1){
    return item2.title.localeCompare(item1.title)    
}

function compareByTitleDesc(item2, item1){
    return -item2.title.localeCompare(item1.title)    
}


function compareByPriceAsc(item2, item1){
    return item2.price - item1.price;    
}

function compareByPriceDesc(item2, item1){
    return item1.price-item2.price;    
}




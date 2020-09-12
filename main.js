let links = [];
let store = { categories: [], user: '', isFirstTime: true, links: [] };
let editingIdx = -1;
const form = document.querySelector('#link-form');
const nameInput = document.getElementById('name-input');
const urlInput = document.getElementById('url-input');
const selectCategory = document.getElementById('select-category');
const codingLinks = document.getElementById('coding-links');
const laterLinks = document.getElementById('later-links');
const goodToKnowLinks = document.getElementById('good-to-know-links');
const quoteEl = document.getElementById('quote');
const submitBtn = document.getElementById('submit-btn');
const addCategoryBtn = document.getElementById('add-category-btn');
const addCategoryInput = document.getElementById('add-category-input');

var colors = ['darkseagreen', 'lightsteelblue', 'darkkhaki'];

selectCategory.addEventListener('change', (e) => {
  if (e.target.value === 'addCategory') {
    showCategoryInput();
    return;
  } else {
    hideCategoryInput();
  }
});

addCategoryBtn.addEventListener('click', () => {
  const catInput = addCategoryInput.value.trim();
  if (!catInput) {
    document.getElementById('category-modal-btn').click();
    return;
  }
  const newCategory = { name: catInput, id: Math.random(), links: [] };
  store.categories.push(newCategory);
  updateLocalStorageStore();
  hideCategoryInput();
  updateCategoryOptions(catInput);
  renderCategory(newCategory);
  addCategoryInput.value = '';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();
  const category = selectCategory.value;
  if (!name || !url || !category) {
    document.getElementById('modal-btn').click();
    return;
  }
  link = {
    name,
    url,
    category,
    id: Math.random(),
    clickCount: 0,
  };
  if (editingIdx > -1) {
    console.log(editingIdx);
    store.links[editingIdx].name = name;
    store.links[editingIdx].url = url;
    store.links[editingIdx].category = category;
    removeCategories();
    store.links.forEach((link) => {
      insertLink(link);
    });
    updateLocalStorageStore();
    editingIdx = -1;
  } else {
    store.links.push(link);
    updateLocalStorageStore();
    insertLink(link);
  }
  if (nameInput.value || urlInput.value || selectCategory.value) {
    nameInput.value = '';
    urlInput.value = '';
    selectCategory.value = '';
  }
});

function renderLink(link) {
  const returnLink = (linkObj) => {
    const div = document.createElement('div');
    // <li class="item"> </li>
    div.setAttribute(
      'class',
      'nes-container is-dark link-container is-rounded'
    );
    div.innerHTML = `
        <a href="${
          linkObj.url.indexOf('http') > -1
            ? linkObj.url
            : 'http://' + linkObj.url
        }" class="link-name" target="_blank" rel="noopener noreferrer">${
      linkObj.name
    }</a>
        <div class="link-action">
          <button
            type="button"
            class="action-btn nes-btn is-success is-small"
            data-id="${linkObj.id}"
            id="link-edit"
            onClick="editLink(this)"
          >
            e
          </button>
          <button type="button" id="link-delete" data-id="${
            linkObj.id
          }" class="action-btn nes-btn is-warning"
          onclick="removeLink(this)"
          >
            X
          </button>
        </div>
        `;
    return div;
  };

  if (link.category === 'coding') {
    codingLinks.append(returnLink(link));
  } else if (link.category === 'visitLater') {
    laterLinks.append(returnLink(link));
  } else {
    goodToKnowLinks.append(returnLink(link));
  }
}

window.addEventListener('load', () => {
  updateQuote();
  const t = getLocalStorageStore();
  if (!t) {
    return;
  }
  store = t;
  store.categories.forEach((cat) => {
    updateCategoryOptions(cat);
    renderCategory(cat);
  });
  store.links.forEach((link) => insertLink(link));
});

function removeLink(el) {
  const remainingLinks = store.links.filter(
    (item) => item.id != el.getAttribute('data-id')
  );
  store.links = remainingLinks;
  updateLocalStorageStore();
  el.parentNode.parentNode.remove();
}

function editLink(el) {
  if (el.parentNode.parentNode.classList.contains('is-editing')) {
    el.parentNode.parentNode.classList.remove('is-editing');
    editingIdx = -1;
    nameInput.value = '';
    urlInput.value = '';
    selectCategory.value = '';
    return;
  }
  const prevEl = document.querySelector('.is-editing');
  if (prevEl) prevEl.classList.remove('is-editing');
  el.parentNode.parentNode.classList.add('is-editing');
  editingIdx = store.links.findIndex(
    (item) => item.id == el.getAttribute('data-id')
  );
  nameInput.value = store.links[editingIdx].name;
  urlInput.value = store.links[editingIdx].url;
  selectCategory.value = store.links[editingIdx].category;
}

const updateQuote = async () => {
  let response = await fetch(
    'https://programming-quotes-api.herokuapp.com/quotes/random'
  );

  if (response.ok) {
    const quote = await response.json();
    quoteEl.innerHTML = '"' + quote.en + '"';
  }
};

function updateLocalStorageStore() {
  localStorage.setItem('store', JSON.stringify(store));
}

function getLocalStorageStore() {
  return JSON.parse(localStorage.getItem('store'));
}
function showCategoryInput() {
  submitBtn.disabled = true;
  submitBtn.classList.add('is-disabled');
  submitBtn.classList.remove('is-primary');
  addCategoryInput.parentNode.classList.remove('is-hidden');
}

function hideCategoryInput() {
  submitBtn.disabled = false;
  submitBtn.classList.add('is-primary');
  submitBtn.classList.remove('is-disabled');
  if (!addCategoryInput.parentNode.classList.contains('is-hidden'))
    addCategoryInput.parentNode.classList.add('is-hidden');
}

function updateCategoryOptions(catInput) {
  selectCategory.innerHTML =
    store.categories.reduce(
      (a, c) => `<option value="${c.name}">${c.name}</option>` + a,
      ``
    ) +
    `<option value="addCategory" style="color: orange">
  Add Category
</option>`;
  selectCategory.value = catInput;
}

function removeCategories() {
  const el = document.querySelectorAll(`.link-container`);
  Array.from(el).forEach((el) => el.remove());
}

function renderCategory(category) {
  var random_color = colors[Math.floor(Math.random() * colors.length)];

  document.getElementById('form-outer-wrapper').insertAdjacentHTML(
    'afterend',
    `
    <div style="background-color:${random_color}" class="nes-container with-title" data-category="${category.name}">
    <button onclick="removeCollection(this)" id="remove-collection" class="nes-btn is-error">Drop</button>
    <h2 class="title">${category.name}</h2>
    </div>
    `
  );
}

function insertLink(linkObj) {
  const el = document.querySelector(`[data-category=${linkObj.category}]`);
  el.append(returnLink(linkObj));
}

function removeCollection(el) {
  el.parentNode.remove();
  const filtedCategory = store.categories.filter(
    (i) => i.name != el.parentNode.getAttribute('data-category')
  );
  const filteredLinks = store.links.filter(
    (i) => i.category != el.parentNode.getAttribute('data-category')
  );
  store.categories = filtedCategory;
  store.categories.forEach((cat) => updateCategoryOptions(cat));
  store.links = filteredLinks;
  updateLocalStorageStore();
}

function returnLink(linkObj) {
  const div = document.createElement('div');
  // <li class="item"> </li>
  div.setAttribute('class', 'nes-container is-dark link-container is-rounded');
  div.innerHTML = `
        <a href="${
          linkObj.url.indexOf('http') > -1
            ? linkObj.url
            : 'http://' + linkObj.url
        }" class="link-name" target="_blank" rel="noopener noreferrer">${
    linkObj.name
  }</a>
        <div class="link-action">
          <button
            type="button"
            class="action-btn nes-btn is-success is-small"
            data-id="${linkObj.id}"
            id="link-edit"
            onClick="editLink(this)"
          >
            e
          </button>
          <button type="button" id="link-delete" data-id="${
            linkObj.id
          }" class="action-btn nes-btn is-warning"
          onclick="removeLink(this)"
          >
            X
          </button>
        </div>
        `;
  return div;
}

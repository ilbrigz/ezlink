let links = [];
let editingIdx = -1;
const form = document.querySelector('#link-form');
const nameInput = document.getElementById('name-input');
const urlInput = document.getElementById('url-input');
const selectCategory = document.getElementById('select-category');
const codingLinks = document.getElementById('coding-links');
const laterLinks = document.getElementById('later-links');
const goodToKnowLinks = document.getElementById('good-to-know-links');
const quoteEl = document.getElementById('quote');

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
    links[editingIdx].name = name;
    links[editingIdx].url = url;
    links[editingIdx].category = category;
    codingLinks.innerText = '';
    laterLinks.innerText = '';
    goodToKnowLinks.innerText = '';
    links.forEach((link) => {
      renderLink(link);
    });
    editingIdx = -1;
  } else {
    addLink(link);
  }
  if (!codingLinks.children.length) {
    codingLinks.parentNode.classList.add('hidden');
  } else {
    codingLinks.parentNode.classList.remove('hidden');
  }
  if (!laterLinks.children.length) {
    laterLinks.parentNode.classList.add('hidden');
  } else {
    laterLinks.parentNode.classList.remove('hidden');
  }
  if (!goodToKnowLinks.children.length) {
    goodToKnowLinks.parentNode.classList.add('hidden');
  } else {
    goodToKnowLinks.parentNode.classList.remove('hidden');
  }
  updateLocalStorage(links);
  if (nameInput.value || urlInput.value || selectCategory.value) {
    nameInput.value = '';
    urlInput.value = '';
    selectCategory.value = '';
  }
});

function addLink(link) {
  links.push(link);
  renderLink(link);
}

function updateLocalStorage() {
  localStorage.setItem('links', JSON.stringify(links));
}

function getLocalStorage(name) {
  return JSON.parse(localStorage.getItem(name));
}

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
  links = getLocalStorage('links');
  if (!links) {
    links = [];
  }
  links.forEach((link) => {
    renderLink(link);
  });
  if (!codingLinks.children.length) {
    codingLinks.parentNode.classList.add('hidden');
  }
  if (!laterLinks.children.length) {
    laterLinks.parentNode.classList.add('hidden');
  }
  if (!goodToKnowLinks.children.length) {
    goodToKnowLinks.parentNode.classList.add('hidden');
  }
  updateQuote();
});

function removeLink(el) {
  links = links.filter((item) => item.id != el.getAttribute('data-id'));
  updateLocalStorage();
  el.parentNode.parentNode.remove();
  if (!codingLinks.children.length) {
    codingLinks.parentNode.classList.add('hidden');
  }
  if (!laterLinks.children.length) {
    laterLinks.parentNode.classList.add('hidden');
  }
  if (!goodToKnowLinks.children.length) {
    goodToKnowLinks.parentNode.classList.add('hidden');
  }
}

function editLink(el) {
  console.log(el.parentNode.parentNode.classList.contains('is-editing'));
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
  editingIdx = links.findIndex((item) => item.id == el.getAttribute('data-id'));
  nameInput.value = links[editingIdx].name;
  urlInput.value = links[editingIdx].url;
  selectCategory.value = links[editingIdx].category;
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

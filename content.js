// content.js

let selectedInput = null;

// Fonction pour créer l'icône flottante
function createFloatingIcon() {
  const icon = document.createElement('div');
  icon.id = 'floating-tag-icon';
  icon.style.position = 'fixed';
  icon.style.bottom = '20px';
  icon.style.right = '20px';
  icon.style.width = '50px';
  icon.style.height = '50px';
  icon.style.backgroundColor = '#007bff';
  icon.style.borderRadius = '50%';
  icon.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
  icon.style.cursor = 'pointer';
  icon.style.zIndex = '1000';
  icon.style.display = 'flex';
  icon.style.alignItems = 'center';
  icon.style.justifyContent = 'center';
  icon.style.color = '#fff';
  icon.style.fontSize = '24px';
  icon.textContent = '+';
  document.body.appendChild(icon);

  icon.addEventListener('click', () => {
    toggleTagList();
  });
}

// Fonction pour créer la liste des tags
function createTagList(tags) {
  const tagListContainer = document.createElement('div');
  tagListContainer.id = 'tag-list-container';
  tagListContainer.style.position = 'fixed';
  tagListContainer.style.bottom = '80px';
  tagListContainer.style.right = '20px';
  tagListContainer.style.width = '200px';
  tagListContainer.style.maxHeight = '300px';
  tagListContainer.style.overflowY = 'auto';
  tagListContainer.style.backgroundColor = '#fff';
  tagListContainer.style.border = '1px solid #ddd';
  tagListContainer.style.borderRadius = '5px';
  tagListContainer.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
  tagListContainer.style.zIndex = '1000';
  tagListContainer.style.display = 'none';

  const tagList = document.createElement('ul');
  tagList.style.listStyle = 'none';
  tagList.style.padding = '10px';
  tagList.style.margin = '0';

  for (const [key, value] of Object.entries(tags)) {
    const tagItem = document.createElement('li');
    tagItem.style.marginBottom = '10px';
    tagItem.style.cursor = 'pointer';
    tagItem.textContent = key;
    tagItem.addEventListener('click', () => {
      insertTag(value);
    });
    tagList.appendChild(tagItem);
  }

  const manageTagsButton = document.createElement('button');
  manageTagsButton.textContent = 'Manage Tags';
  manageTagsButton.style.display = 'block';
  manageTagsButton.style.margin = '10px auto';
  manageTagsButton.style.backgroundColor = '#007bff';
  manageTagsButton.style.color = '#fff';
  manageTagsButton.style.border = 'none';
  manageTagsButton.style.padding = '10px';
  manageTagsButton.style.borderRadius = '5px';
  manageTagsButton.style.cursor = 'pointer';
  manageTagsButton.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  tagListContainer.appendChild(tagList);
  tagListContainer.appendChild(manageTagsButton);
  document.body.appendChild(tagListContainer);
}

// Fonction pour basculer la visibilité de la liste des tags
function toggleTagList() {
  const tagListContainer = document.getElementById('tag-list-container');
  if (tagListContainer.style.display === 'none' || !tagListContainer.style.display) {
    tagListContainer.style.display = 'block';
  } else {
    tagListContainer.style.display = 'none';
  }
}

// Fonction pour insérer un tag dans le champ de saisie sélectionné
function insertTag(value) {
  if (selectedInput) {
    const start = selectedInput.selectionStart;
    const end = selectedInput.selectionEnd;
    selectedInput.value = selectedInput.value.substring(0, start) + value + selectedInput.value.substring(end);
    selectedInput.focus();
    selectedInput.selectionEnd = start + value.length;
  }
}

// Fonction pour injecter les tags et créer l'icône flottante
function injectTags() {
  chrome.storage.sync.get(['tags'], (result) => {
    const tags = result.tags || {};

    createFloatingIcon();
    createTagList(tags);
  });
}

// Événement pour détecter le champ de saisie sélectionné
document.addEventListener('focusin', (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    selectedInput = event.target;
  } else {
    selectedInput = null;
  }
});

// Injecter les tags et l'icône flottante lors du chargement du script de contenu
injectTags();

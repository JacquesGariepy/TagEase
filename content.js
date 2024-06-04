// content.js

let selectedInput = null;
let isDragging = false;
let offset = { x: 0, y: 0 };

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

  // Ajouter des événements pour permettre le déplacement de l'icône
  icon.addEventListener('mousedown', (e) => {
    isDragging = true;
    offset.x = e.clientX - icon.getBoundingClientRect().left;
    offset.y = e.clientY - icon.getBoundingClientRect().top;
    icon.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      icon.style.left = `${e.clientX - offset.x}px`;
      icon.style.top = `${e.clientY - offset.y}px`;
      icon.style.bottom = 'auto';
      icon.style.right = 'auto';
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      icon.style.transition = 'all 0.2s ease';
    }
  });

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
    tagItem.style.display = 'flex';
    tagItem.style.alignItems = 'center';
    tagItem.style.borderBottom = '1px solid #ddd'; // Ligne de séparation grise pâle
    tagItem.style.padding = '5px 0'; // Espacement entre les éléments

    const icon = document.createElement('span');
    icon.textContent = '🏷'; // Caractère Unicode pour l'icône de tag
    icon.style.marginRight = '10px';

    const tagText = document.createElement('span');
    tagText.textContent = key;
    tagText.addEventListener('click', () => {
      insertTag(value);
    });

    tagItem.appendChild(icon);
    tagItem.appendChild(tagText);
    tagList.appendChild(tagItem);
  }

  const manageTagsButton = document.createElement('button');
  manageTagsButton.textContent = chrome.i18n.getMessage('manageTags');
  manageTagsButton.style.display = 'block';
  manageTagsButton.style.margin = '10px auto';
  manageTagsButton.style.backgroundColor = '#007bff';
  manageTagsButton.style.color = '#fff';
  manageTagsButton.style.border = 'none';
  manageTagsButton.style.padding = '10px';
  manageTagsButton.style.borderRadius = '5px';
  manageTagsButton.style.cursor = 'pointer';
  manageTagsButton.addEventListener('click', () => {
    openManageTagsPopup();
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

// Fonction pour ouvrir le popup de gestion des tags
function openManageTagsPopup() {
  chrome.runtime.sendMessage({ action: 'openManageTagsPopup' });
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

// Injecter les tags, l'icône flottante et le modal lors du chargement du script de contenu
injectTags();

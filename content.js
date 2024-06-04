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
    toggleManageTagsModal();
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
    createManageTagsModal();
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

// Fonction pour créer un modal pour gérer les tags
function createManageTagsModal() {
  const modal = document.createElement('div');
  modal.id = 'manage-tags-modal';
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.width = '400px';
  modal.style.maxHeight = '80vh';
  modal.style.overflowY = 'auto';
  modal.style.backgroundColor = '#fff';
  modal.style.border = '1px solid #ddd';
  modal.style.borderRadius = '5px';
  modal.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
  modal.style.zIndex = '1001';
  modal.style.display = 'none';

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.backgroundColor = '#007bff';
  closeButton.style.color = '#fff';
  closeButton.style.border = 'none';
  closeButton.style.padding = '5px 10px';
  closeButton.style.borderRadius = '5px';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => {
    toggleManageTagsModal();
  });

  const modalContent = document.createElement('div');
  modalContent.id = 'modal-content';
  modalContent.style.padding = '20px';

  // Créer le contenu du modal ici
  const modalTitle = document.createElement('h1');
  modalTitle.textContent = 'Manage Tags';
  modalContent.appendChild(modalTitle);

  const tagForm = document.createElement('form');
  tagForm.id = 'tagForm';
  tagForm.innerHTML = `
    <div class="form-group">
      <textarea id="key" class="form-control" placeholder="Tag" required></textarea>
    </div>
    <div class="form-group">
      <textarea id="value" class="form-control" placeholder="Value" required></textarea>
    </div>
    <div class="d-flex justify-content-between mb-3">
      <button type="button" id="addButton" class="btn btn-primary">Add</button>
      <button type="button" id="editButton" class="btn btn-warning" style="display:none;">Edit</button>
    </div>
  `;
  modalContent.appendChild(tagForm);

  const tagList = document.createElement('ul');
  tagList.id = 'tagList';
  tagList.className = 'list-group';
  modalContent.appendChild(tagList);

  modal.appendChild(closeButton);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Initialiser les événements et le contenu du modal
  initializeModal();
}

// Fonction pour initialiser les événements et le contenu du modal
function initializeModal() {
  const tagForm = document.getElementById('tagForm');
  const keyInput = document.getElementById('key');
  const valueInput = document.getElementById('value');
  const addButton = document.getElementById('addButton');
  const editButton = document.getElementById('editButton');
  let editingKey = null;

  addButton.addEventListener('click', () => {
    const key = keyInput.value.trim();
    const value = valueInput.value.trim();

    if (key && value) {
      chrome.storage.sync.get(['tags'], (result) => {
        const tags = result.tags || {};
        tags[key] = value;
        chrome.storage.sync.set({ tags }, () => {
          displayTags();
          keyInput.value = '';
          valueInput.value = '';
        });
      });
    }
  });

  editButton.addEventListener('click', () => {
    const key = keyInput.value.trim();
    const value = valueInput.value.trim();

    if (key && value && editingKey) {
      chrome.storage.sync.get(['tags'], (result) => {
        const tags = result.tags || {};
        delete tags[editingKey]; // Remove old key if it was edited
        tags[key] = value;
        chrome.storage.sync.set({ tags }, () => {
          displayTags();
          keyInput.value = '';
          valueInput.value = '';
          editButton.style.display = 'none';
          addButton.style.display = 'inline';
          editingKey = null;
        });
      });
    }
  });

  function displayTags() {
    chrome.storage.sync.get(['tags'], (result) => {
      const tags = result.tags || {};
      const tagList = document.getElementById('tagList');
      tagList.innerHTML = '';

      for (const [key, value] of Object.entries(tags)) {
        const li = document.createElement('li');
        li.className = 'list-group-item';

        const keyTextarea = document.createElement('textarea');
        const valueTextarea = document.createElement('textarea');
        keyTextarea.value = key;
        valueTextarea.value = value;
        keyTextarea.disabled = true;
        valueTextarea.disabled = true;
        keyTextarea.classList.add('tag-key', 'form-control', 'mb-2');
        valueTextarea.classList.add('tag-value', 'form-control', 'mb-2');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'btn btn-warning mb-2 mr-2';
        editButton.addEventListener('click', () => {
          keyInput.value = key;
          valueInput.value = value;
          editButton.style.display = 'inline';
          addButton.style.display = 'none';
          editingKey = key;
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn btn-danger mb-2';
        deleteButton.addEventListener('click', () => {
          deleteTag(key);
        });

        li.appendChild(keyTextarea);
        li.appendChild(valueTextarea);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        tagList.appendChild(li);
      }
    });
  }

  function deleteTag(key) {
    chrome.storage.sync.get(['tags'], (result) => {
      const tags = result.tags || {};
      delete tags[key];
      chrome.storage.sync.set({ tags }, () => {
        displayTags();
      });
    });
  }

  displayTags();
}

// Fonction pour basculer la visibilité du modal de gestion des tags
function toggleManageTagsModal() {
  const modal = document.getElementById('manage-tags-modal');
  if (modal.style.display === 'none' || !modal.style.display) {
    modal.style.display = 'block';
  } else {
    modal.style.display = 'none';
  }
}

// Injecter les tags, l'icône flottante et le modal lors du chargement du script de contenu
injectTags();

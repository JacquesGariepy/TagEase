document.addEventListener('DOMContentLoaded', function () {
  let editingKey = null;

  // Fonction pour initialiser les éléments de la page
  function initializePage() {
    document.getElementById('manageTagsHeader').textContent = chrome.i18n.getMessage('manageTags');
    document.getElementById('addButton').textContent = chrome.i18n.getMessage('addTag');
    document.getElementById('editButton').textContent = chrome.i18n.getMessage('editTag');
    document.getElementById('footerTitle').textContent = chrome.i18n.getMessage('footerTitle');
  }

  initializePage();

  const keyInput = document.getElementById('key');
  const valueInput = document.getElementById('value');
  const typeInput = document.getElementById('type');
  const variablesInput = document.getElementById('variables');
  const addButton = document.getElementById('addButton');
  const editButton = document.getElementById('editButton');

  addButton.addEventListener('click', () => {
    const key = keyInput.value.trim();
    const value = valueInput.value.trim();
    const type = typeInput.value;
    const variables = variablesInput.value.trim().split(',').map(v => v.trim()).filter(v => v);

    if (key && value) {
      chrome.storage.sync.get(['tags'], (result) => {
        const tags = result.tags || {};
        tags[key] = { value: value, type: type, variables: variables };
        chrome.storage.sync.set({ tags }, () => {
          displayTags();
          keyInput.value = '';
          valueInput.value = '';
          typeInput.value = 'text';
          variablesInput.value = '';
        });
      });
    }
  });

  editButton.addEventListener('click', () => {
    const key = keyInput.value.trim();
    const value = valueInput.value.trim();
    const type = typeInput.value;
    const variables = variablesInput.value.trim().split(',').map(v => v.trim()).filter(v => v);

    if (key && value && editingKey) {
      chrome.storage.sync.get(['tags'], (result) => {
        const tags = result.tags || {};
        delete tags[editingKey]; // Remove old key if it was edited
        tags[key] = { value: value, type: type, variables: variables };
        chrome.storage.sync.set({ tags }, () => {
          displayTags();
          keyInput.value = '';
          valueInput.value = '';
          typeInput.value = 'text';
          variablesInput.value = '';
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

      for (const [key, tag] of Object.entries(tags)) {
        const li = document.createElement('li');
        li.className = 'list-group-item';

        const keyTextarea = document.createElement('textarea');
        const valueTextarea = document.createElement('textarea');
        const variablesTextarea = document.createElement('textarea');
        keyTextarea.value = key;
        valueTextarea.value = tag.value;
        variablesTextarea.value = (tag.variables || []).join(', ');
        keyTextarea.disabled = true;
        valueTextarea.disabled = true;
        variablesTextarea.disabled = true;
        keyTextarea.classList.add('tag-key', 'form-control', 'mb-2');
        valueTextarea.classList.add('tag-value', 'form-control', 'mb-2');
        variablesTextarea.classList.add('tag-variables', 'form-control', 'mb-2');

        const editBtn = document.createElement('button');
        editBtn.textContent = chrome.i18n.getMessage('editTag');
        editBtn.className = 'btn btn-warning mb-2 mr-2';
        editBtn.addEventListener('click', () => {
          keyInput.value = key;
          valueInput.value = tag.value;
          typeInput.value = tag.type;
          variablesInput.value = (tag.variables || []).join(', ');
          editButton.style.display = 'inline';
          addButton.style.display = 'none';
          editingKey = key;
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = chrome.i18n.getMessage('deleteTag');
        deleteBtn.className = 'btn btn-danger mb-2';
        deleteBtn.addEventListener('click', () => {
          deleteTag(key);
        });

        li.appendChild(keyTextarea);
        li.appendChild(valueTextarea);
        li.appendChild(variablesTextarea);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
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
});

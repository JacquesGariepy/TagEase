// options.js

let editingKey = null;

// Fonction pour initialiser les éléments de la page
function initializePage() {
  displayTags();
}

// Fonction pour afficher les tags
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
        document.getElementById('key').value = key;
        document.getElementById('value').value = value;
        document.getElementById('editButton').style.display = 'inline';
        document.getElementById('addButton').style.display = 'none';
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

// Fonction pour supprimer un tag
function deleteTag(key) {
  chrome.storage.sync.get(['tags'], (result) => {
    const tags = result.tags || {};
    delete tags[key];
    chrome.storage.sync.set({ tags }, () => {
      displayTags();
    });
  });
}

// Événements pour les boutons "Add" et "Edit"
document.getElementById('addButton').addEventListener('click', () => {
  const key = document.getElementById('key').value.trim();
  const value = document.getElementById('value').value.trim();

  if (key && value) {
    chrome.storage.sync.get(['tags'], (result) => {
      const tags = result.tags || {};
      tags[key] = value;
      chrome.storage.sync.set({ tags }, () => {
        displayTags();
        document.getElementById('key').value = '';
        document.getElementById('value').value = '';
      });
    });
  }
});

document.getElementById('editButton').addEventListener('click', () => {
  const key = document.getElementById('key').value.trim();
  const value = document.getElementById('value').value.trim();

  if (key && value && editingKey) {
    chrome.storage.sync.get(['tags'], (result) => {
      const tags = result.tags || {};
      delete tags[editingKey]; // Remove old key if it was edited
      tags[key] = value;
      chrome.storage.sync.set({ tags }, () => {
        displayTags();
        document.getElementById('key').value = '';
        document.getElementById('value').value = '';
        document.getElementById('editButton').style.display = 'none';
        document.getElementById('addButton').style.display = 'inline';
        editingKey = null;
      });
    });
  }
});

// Initialiser la page
initializePage();

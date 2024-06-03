// content.js

// Fonction pour injecter l'icône dans les champs de saisie
function injectIcon(element) {
  const icon = document.createElement('span');
  icon.textContent = '🔍'; // Utilisez l'icône de votre choix
  icon.style.cursor = 'pointer';
  icon.style.marginLeft = '5px';
  icon.classList.add('tag-icon');

  element.parentNode.insertBefore(icon, element.nextSibling);

  icon.addEventListener('click', () => {
    showTagSuggestions(element);
  });
}

// Fonction pour afficher les suggestions de tags
function showTagSuggestions(inputElement) {
  chrome.storage.sync.get(['tags'], (result) => {
    const tags = result.tags || {};
    const tagList = document.createElement('ul');
    tagList.classList.add('tag-suggestions');

    for (const [key, value] of Object.entries(tags)) {
      const tagItem = document.createElement('li');
      tagItem.textContent = `${key}: ${value}`;
      tagItem.style.cursor = 'pointer';
      tagItem.addEventListener('click', () => {
        inputElement.value = value;
        document.body.removeChild(tagList);
      });
      tagList.appendChild(tagItem);
    }

    document.body.appendChild(tagList);
    positionTagList(tagList, inputElement);
  });
}

// Fonction pour positionner la liste des suggestions de tags
function positionTagList(tagList, inputElement) {
  const rect = inputElement.getBoundingClientRect();
  tagList.style.position = 'absolute';
  tagList.style.top = `${rect.bottom + window.scrollY}px`;
  tagList.style.left = `${rect.left + window.scrollX}px`;
  tagList.style.backgroundColor = 'white';
  tagList.style.border = '1px solid #ccc';
  tagList.style.listStyleType = 'none';
  tagList.style.padding = '5px';
  tagList.style.margin = '0';
  tagList.style.zIndex = '1000';
}

// Parcourir tous les champs de saisie et textarea et injecter l'icône
document.querySelectorAll('input[type="text"], textarea').forEach(injectIcon);

// Fonction pour gérer l'autocomplétion des tags
function handleAutoComplete(event) {
  chrome.storage.sync.get(['tags'], (result) => {
    const tags = result.tags || {};
    const words = event.target.value.split(' ');
    const lastWord = words[words.length - 1];

    if (tags[lastWord]) {
      words[words.length - 1] = tags[lastWord];
      event.target.value = words.join(' ');
    }
  });
}

// Ajouter un écouteur d'événement pour l'autocomplétion des tags
document.addEventListener('input', (event) => {
  if (event.target.matches('input[type="text"], textarea')) {
    handleAutoComplete(event);
  }
});

// content.js

// Fonction pour créer un conteneur
function createContainer() {
  const container = document.createElement('div');
  container.style.marginTop = '20px';
  container.style.padding = '10px';
  container.style.border = '1px solid #ddd';
  container.style.borderRadius = '5px';
  container.style.backgroundColor = '#f9f9f9';
  container.style.maxWidth = '600px';
  container.style.margin = '20px auto';
  return container;
}

// Fonction pour créer une carte
function createCard(key, value) {
  const card = document.createElement('div');
  card.style.border = '1px solid #ddd';
  card.style.borderRadius = '5px';
  card.style.padding = '10px';
  card.style.marginBottom = '10px';
  card.style.backgroundColor = '#fff';
  card.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';

  const cardTitle = document.createElement('h5');
  cardTitle.style.marginTop = '0';
  cardTitle.textContent = key;

  const cardText = document.createElement('p');
  cardText.style.display = 'none';
  cardText.textContent = value;

  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Show';
  toggleButton.style.marginBottom = '10px';
  toggleButton.style.background = 'none';
  toggleButton.style.border = 'none';
  toggleButton.style.color = '#007bff';
  toggleButton.style.cursor = 'pointer';
  toggleButton.addEventListener('click', () => {
    if (cardText.style.display === 'none' || !cardText.style.display) {
      cardText.style.display = 'block';
      toggleButton.textContent = 'Hide';
    } else {
      cardText.style.display = 'none';
      toggleButton.textContent = 'Show';
    }
  });

  card.appendChild(cardTitle);
  card.appendChild(cardText);
  card.appendChild(toggleButton);

  return card;
}

// Fonction pour afficher un message lorsqu'il n'y a pas de tags
function displayNoTagsMessage(container) {
  const noTagsMessage = document.createElement('p');
  noTagsMessage.textContent = 'No tags available. Click here to manage tags.';
  noTagsMessage.style.textAlign = 'center';
  noTagsMessage.style.color = '#555';
  noTagsMessage.style.cursor = 'pointer';
  noTagsMessage.addEventListener('click', () => {
    // Logic to open the tag management interface
    chrome.runtime.openOptionsPage(); // Assuming this opens the management interface
  });
  container.appendChild(noTagsMessage);
}

// Fonction pour injecter les tags dans la page web
function injectTags() {
  chrome.storage.sync.get(['tags'], (result) => {
    const tags = result.tags || {};
    const existingContainer = document.getElementById('chrome-extension-tags-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    const container = createContainer();
    container.id = 'chrome-extension-tags-container';

    if (Object.keys(tags).length === 0) {
      displayNoTagsMessage(container);
    } else {
      for (const [key, value] of Object.entries(tags)) {
        const card = createCard(key, value);
        container.appendChild(card);
      }
    }

    document.body.prepend(container); // Inject the container at the top of the body
  });
}

// Inject tags when the content script is loaded
injectTags();

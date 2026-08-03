const modal = document.getElementById('notesModal');
const modalTitle = document.getElementById('notesModalTitle');
const notesText = document.getElementById('notesText');
const closeModalButton = document.getElementById('closeModal');
const cancelNotesButton = document.getElementById('cancelNotes');
const saveNotesButton = document.getElementById('saveNotes');
const savedIndicator = document.getElementById('savedIndicator');
const helpfulLinksList = document.getElementById('helpfulLinksList');
const noHelpfulLinks = document.getElementById('noHelpfulLinks');

// Add or amend product-specific resources here. Product keys must match the
// data-product-id value on the related card in index.html.
const productResources = {
  core: [
    {
      title: 'Core support documentation',
      description: 'Add the main Core support or knowledge-base link here.',
      url: '#'
    }
  ],
  'integration-products': [
    {
      title: 'Integration Products guidance',
      description: 'Add documentation covering Open Word, Open Attach, Open Print Manager and related tools.',
      url: '#'
    }
  ],
  'active-quote': [],
  'add-on-marketplace': [],
  sme: [],
  'document-portal': [],
  'mobius-ui': [
    {
      title: 'Mobius Support Centre',
      description: 'Guides and supporting information for Mobius users.',
      url: 'https://supportcentre.opengi.co.uk/mobiusguides/'
    }
  ],
  'configuration-hub': [
    {
      title: 'Mobius Support Centre',
      description: 'Browse Mobius guidance that may support Configuration Hub exploration.',
      url: 'https://supportcentre.opengi.co.uk/mobiusguides/'
    }
  ],
  'dynamic-pricing-tool': [
    {
      title: 'Mobius Support Centre',
      description: 'Browse available Mobius guidance and related product documentation.',
      url: 'https://supportcentre.opengi.co.uk/mobiusguides/'
    },
    {
      title: 'Dynamic Pricing Tool Fact Sheet',
      description: 'Browse Dynamic Pricing product documentation.',
      url: 'https://supportcentre.opengi.co.uk/index.php/component/remository/Fact-Sheets/Dynamic-Pricing-Tool-Fact-Sheet'
    }
  ],
  'rd-apps': [
    {
      title: 'Mobius Support Centre',
      description: 'Guides and supporting information for Mobius and related RD applications.',
      url: 'https://supportcentre.opengi.co.uk/mobiusguides/'
    }
  ],
  'ratings': [
    {
      title: 'Ratings Reference',
      description: 'Guides and supporting information for Ratings and related applications.',
      url: 'https://supportcentre.opengi.co.uk/mobiusguides/Ratings_IHPPlus/RatingsFull/index.htm'
    },
    {
      title: 'Ratings Quick Reference',
      description: 'Guides and supporting information for Ratings and related applications.',
      url: 'https://supportcentre.opengi.co.uk/mobiusguides/Ratings_IHPPlus/RatingsQRG/'
    }
  ]
};

let activeProductId = null;
let lastFocusedElement = null;

function storageKey(productId) {
  return `ogi-product-lab-notes-${productId}`;
}

function renderHelpfulLinks(productId) {
  const resources = productResources[productId] || [];
  helpfulLinksList.replaceChildren();

  resources.forEach(resource => {
    const listItem = document.createElement('li');
    listItem.className = 'helpful-link';

    const link = document.createElement('a');
    link.href = resource.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const title = document.createElement('span');
    title.className = 'helpful-link-title';
    title.textContent = resource.title;
    link.appendChild(title);

    if (resource.description) {
      const description = document.createElement('span');
      description.className = 'helpful-link-description';
      description.textContent = resource.description;
      link.appendChild(description);
    }

    listItem.appendChild(link);
    helpfulLinksList.appendChild(listItem);
  });

  noHelpfulLinks.hidden = resources.length > 0;
  helpfulLinksList.hidden = resources.length === 0;
}

function openNotesModal(card, trigger) {
  activeProductId = card.dataset.productId;
  lastFocusedElement = trigger;
  const productName = card.dataset.productName;

  modalTitle.textContent = `${productName} information`;
  notesText.value = localStorage.getItem(storageKey(activeProductId)) || '';
  savedIndicator.classList.remove('is-visible');
  renderHelpfulLinks(activeProductId);

  modal.classList.add('is-open');
  document.body.classList.add('modal-open');
  notesText.focus();
}

function closeNotesModal() {
  modal.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  activeProductId = null;

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function saveNotes() {
  if (!activeProductId) return;

  localStorage.setItem(storageKey(activeProductId), notesText.value);
  savedIndicator.classList.add('is-visible');

  window.setTimeout(() => {
    savedIndicator.classList.remove('is-visible');
  }, 1600);
}

document.querySelectorAll('.notes-button').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.card');
    openNotesModal(card, button);
  });
});

closeModalButton.addEventListener('click', closeNotesModal);
cancelNotesButton.addEventListener('click', closeNotesModal);
saveNotesButton.addEventListener('click', saveNotes);

modal.addEventListener('click', event => {
  if (event.target === modal) {
    closeNotesModal();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) {
    closeNotesModal();
  }

  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && modal.classList.contains('is-open')) {
    saveNotes();
  }
});

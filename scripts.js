
    const modal = document.getElementById('notesModal');
    const modalTitle = document.getElementById('notesModalTitle');
    const notesText = document.getElementById('notesText');
    const closeModalButton = document.getElementById('closeModal');
    const cancelNotesButton = document.getElementById('cancelNotes');
    const saveNotesButton = document.getElementById('saveNotes');
    const savedIndicator = document.getElementById('savedIndicator');

    let activeProductId = null;
    let lastFocusedElement = null;

    function storageKey(productId) {
      return `ogi-product-lab-notes-${productId}`;
    }

    function openNotesModal(card, trigger) {
      activeProductId = card.dataset.productId;
      lastFocusedElement = trigger;
      const productName = card.dataset.productName;

      modalTitle.textContent = `Notes for ${productName}`;
      notesText.value = localStorage.getItem(storageKey(activeProductId)) || '';
      savedIndicator.classList.remove('is-visible');

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
  
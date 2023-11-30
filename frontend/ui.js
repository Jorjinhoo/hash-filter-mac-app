

const addMessageBanner = (text, color) => {
  let div = window.document.createElement('div');
  div.className = 'message-banner';
  div.textContent = text;

  window.document.querySelector('.app').appendChild(div);

  setTimeout(function () {
    div.classList.add(color == 'green' ? 'message-active-green' : 'message-active-red');
  }, 0);

  setTimeout(function() {

    div.classList.add('message-hide');

    setTimeout(function() {
      let bannerToRemove = window.document.querySelector('.message-banner');
      if (bannerToRemove) {
        bannerToRemove.parentNode.removeChild(bannerToRemove);
      }
    }, 1000);
  }, 3000);
}


const addDeleteBtn = () => {
  let div = window.document.createElement('div');

  div.className = 'btn';
  div.id = 'delete-sf-btn';
  div.textContent = 'delete';
  div.onclick = deleteSelectedFile;

  window.document.querySelector('#file-input-wrapper').appendChild(div);
}

const addFileIcon = (type, labelText) => {
  let fileInputLabel = window.document.querySelector('#fileInput-label');
  
  let addFileIcon = document.createElement('div');
  addFileIcon.id = 'add-file-icon';
  addFileIcon.className = 'material-symbols-outlined';
  addFileIcon.textContent = type;

  fileInputLabel.innerHTML = null;

  fileInputLabel.appendChild(addFileIcon);

  fileInputLabel.innerHTML += labelText;
}

const addLoadSpinner = (processingBttn) => {
  let spinner = document.createElement('div');
  spinner.className = 'loader';

  processingBttn.textContent = null;
  processingBttn.onclick = null;
  processingBttn.appendChild(spinner);
}



const addSelectedFile = () => {
    const fileInput = document.querySelector('#file');
    const selectedFile = fileInput.files[0];
    
    if (selectedFile) {
      window.electron.addFile(selectedFile, '../../../../../../../inputFile');
      selectedFileName = `../../../../../../../inputFile/${selectedFile.name}`;
      console.log(selectedFile.name);
      console.log(selectedFileName);
    }
    addFileIcon('task', selectedFile.name);
    addDeleteBtn();
};
  
const deleteSelectedFile = () => {
    const fileNameOnly = selectedFileName.split('/').pop();
    window.electron.deleteFile(fileNameOnly, '../../../../../../../inputFile');
    window.document.querySelector('#file').value = null;
    let deleteBtn = window.document.querySelector('#delete-sf-btn');
    if (deleteBtn) {
      deleteBtn.remove();
    }
    selectedFileName = null;

    addFileIcon('note_add', 'Upload your .csv file')
}
  
const startProcessing = () => {
  
    let usdtMin = parseFloat(window.document.querySelector('#usdtMin').value);
    let usdtMax = parseFloat(window.document.querySelector('#usdtMax').value);
  
    if(selectedFileName && usdtMin && usdtMax && usdtMax >= usdtMin) {

      let processingBttn = window.document.querySelector('#start-processing-btn');

      addLoadSpinner(processingBttn);
  
      let calcResult = window.electron.doFileParsing(selectedFileName, usdtMin, usdtMax);
  
      setTimeout(function() {
        calcResult == 'true' ? addMessageBanner('Successfully!', 'green') : addMessageBanner(`${calcResult}`, 'red');
  
        processingBttn.textContent = 'Start Processing';
        processingBttn.onclick = startProcessing;
      }, 500);
    }else{
      if(!selectedFileName){addMessageBanner(`File upload required`, 'red')}
      else if(!usdtMin){addMessageBanner(`USDT MIN value required`, 'red')}
      else if(!usdtMax){addMessageBanner(`USDT MAX value required`, 'red')}
      else if(!(usdtMax >= usdtMin)){addMessageBanner(`USDT MAX should be >= USDT MIN`, 'red')}
    }
}
  
const getFile = () => {
    window.electron.getReadyFIle();
}
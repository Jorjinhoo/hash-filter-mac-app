const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { contextBridge, ipcRenderer } = require('electron');
const { exec } = require('child_process');
const { error } = require('console');

contextBridge.exposeInMainWorld('electron', {
    addFile: (file, folder) => {
        const reader = new FileReader();
        try{
            reader.onload = (event) => {
                const fileContent = event.target.result;
    
                const fileName = file.name;
                const destinationPath = path.join(__dirname, folder, fileName);
    
                fs.writeFileSync(destinationPath, fileContent);
    
                console.log(`File ${fileName} has been added`);
            };
            reader.readAsText(file);
        }catch(e){
            console.error(e);
            addMessageBanner(e, 'red');
        }
    },
    deleteFile: (fileName, folder) => {
        const filePath = path.join(__dirname, folder, fileName);
        fs.unlink(filePath, (e) => {
            if (e) {
                console.error(`Error deleting file ${fileName}:`, e);
                addMessageBanner(e, 'red');
            } else {
                console.log(`File ${fileName} has been deleted.`);
            }
        });
    },
    getReadyFIle: () => {
        const folderPath = path.resolve(__dirname, '../../../../../../../readyFile');
        try{
            if (fs.existsSync(folderPath)) {
                const openCommand = process.platform === 'win32' ? 'explorer' : 'open';
                exec(`${openCommand} "${folderPath}"`);
            } else {
                console.error('Папка не существует');
                addMessageBanner('Папка не существует', 'red')
            }
        }catch(e){
            console.error(e);
            addMessageBanner(e, 'red');
        }
    },
    doFileParsing: (filePath, usdtMin, usdtMax) => {

        const inputFilePath = path.resolve(__dirname, filePath);
        const outputFilePath = path.resolve(__dirname, '../../../../../../../readyFile/filtered_data.csv');

        try{
            const readStream = fs.createReadStream(inputFilePath);
            const writeStream = fs.createWriteStream(outputFilePath);

            const rl = readline.createInterface({
                input: readStream,
                crlfDelay: Infinity,
            });

            writeStream.write('Txn Hash,Block,Time (UTC),Type,Method ID,Method Name,From,To,Token,Token Symbol,Amount,Token ID(1155)\n');

            rl.on('line', (line) => {
               
                const fields = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                
                const usdtValue = parseFloat(fields[fields.length - 2]);

                if (!isNaN(usdtValue) && usdtValue >= usdtMin && usdtValue <= usdtMax) {

                    writeStream.write(`${fields[fields.length - 12]} 
                                        + ${fields[fields.length - 6]} 
                                        + ${fields[fields.length - 5]} 
                                        + ${fields[fields.length - 2]}
                                        + ${fields[fields.length - 10]} 
                                    \n`);
                }
            });

            rl.on('close', () => {
                console.log('Фильтрация завершена. Результат записан в файл:', outputFilePath);
                writeStream.end();
            });
            
            return 'true';

        }catch(e){
            console.error(e);
            return e;
        }
    }
})
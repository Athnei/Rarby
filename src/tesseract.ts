import { createWorker } from 'tesseract.js';

const worker = createWorker({
    //   logger: m => console.log(m)
});

export async function GetCaptcha(location: string = 'images/code.png') {

    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(location);
    // console.log(text);
    await worker.terminate();

    return text;
}
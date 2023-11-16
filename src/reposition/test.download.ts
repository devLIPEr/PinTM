import {Injectable, Options} from '@nestjs/common';
const PDFDocument = require('pdfkit-table');

@Injectable()
export class PdfGenerator{
    async generatePDF(): Promise<Buffer>{
        const pdfBuffer : Buffer = await new Promise(resolve => {
            // const options = new Options
            const doc = new PDFDocument({
                font: "K2D",
                bufferPages : true
            })

            //pdf
            doc.text("No alto daquele cume plantei uma roseira");
            doc.moveDown();
            doc.text("O vento no cume bate, a rosa no cume cheira");

            const buffer = []
            doc.on('data', buffer.push.bind(buffer))
            doc.on('end', () => {
                const data = Buffer.concat(buffer)
                resolve(data)
            })
            doc.end()
        })
        return pdfBuffer;
    }
}
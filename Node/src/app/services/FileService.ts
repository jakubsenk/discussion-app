import { Injectable } from "@angular/core";
import { Guard } from "../providers/Guard";

@Injectable()
export class FileService
{
    public resizeFile(file: File, width: number, height: number): Promise<File>
    {
        const promise = new Promise<File>((resolve, reject) =>
        {
            if(file.type.match(/image.*/))
            {
                const reader = new FileReader();
                reader.onload = (readerEvent) =>
                {
                    const image = new Image();
                    image.onload = (_e) =>
                    {
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;

                        Guard.SafeGetObject(canvas.getContext('2d')).drawImage(image, 0, 0, width, height);

                        const resizedImage = this.dataURLToBlob(canvas.toDataURL());

                        resolve(this.blobToFile(resizedImage, file.name, file.lastModified));
                    }
                    image.onerror = (err) => reject(err);
                    image.src = Guard.SafeGetObject(readerEvent.target).result as string;
                }
                reader.onerror = (err) => reject(err);
                reader.readAsDataURL(file);
            }
            else
            {
                reject("Not an image.");
            }
        });
        return promise;
    }

    public base64ToDataURL(str: string): string
    {
        return "data:image/png;base64," + str;
    }

    private dataURLToBlob(dataURL: string): Blob
    {
        const BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1)
        {
            const parts = dataURL.split(',');
            const contentType = parts[0].split(':')[1];
            const raw = parts[1];

            return new Blob([raw], {type: contentType});
        }

        const parts = dataURL.split(BASE64_MARKER);
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;

        const uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; i++)
        {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
    }

    private blobToFile(blob: Blob, fileName: string, modified: number): File
    {
        const b: any = blob;
        b.lastModifiedDate = modified;
        b.name = fileName;
    
        return blob as File;
    }
}
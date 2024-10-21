import imageCompression from 'browser-image-compression';
import Resizer from 'react-image-file-resizer';

const compressImage = async (file) => {
  try {
    // Resize the image
    const resizedImage = await new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300, // max width
        300, // max height
        'JPEG', // format
        100, // quality
        0, // rotation
        (uri) => {
          resolve(uri);
        },
        'blob' // output type
      );
    });
    const resizedImage1 = await new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300, // max width
        300, // max height
        'JPEG', // format
        100, // quality
        0, // rotation
        (uri) => {
          resolve(uri);
        },
        'base64' // output type
      );
    });

    console.log('resizedImage', resizedImage);

    console.log('resizedImage1', resizedImage1);

    // Create a File from the resized image blob
    const resizedFile = new File([resizedImage], file.name, {
      type: 'image/jpeg',
    });

    // Compress the resized image
    const options = {
      maxSizeMB: 0.05, // Maximum file size you want after compression
      maxWidthOrHeight: 300, // Maximum size of the width or height of the image
      useWebWorker: true, // Utilize Web Worker for performance improvement
    };
    const compressedBlob = await imageCompression(resizedFile, options);

    // Create a File from the compressed blob
    const compressedFile = new File([compressedBlob], file.name, {
      type: 'image/jpeg',
    });

    console.log('Resized and Compressed File:', compressedFile); // Debugging line, can be commented out

    return compressedFile;
  } catch (error) {
    console.error('Error resizing and compressing image:', error);
    throw error;
  }
};

export default compressImage;

export const blobToVecNat8 = async (blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  return Array.from(uint8Array); // Convert Uint8Array to regular array
};

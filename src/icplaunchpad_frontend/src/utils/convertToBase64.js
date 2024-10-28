// // utils/convertFileToBase64.js

// export const convertFileToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const arrayBuffer = event.target.result;
//       const uint8Array = new Uint8Array(arrayBuffer);

//       // Convert in chunks to avoid exceeding call stack
//       const CHUNK_SIZE = 8192;
//       let result = "";
//       for (let i = 0; i < uint8Array.length; i += CHUNK_SIZE) {
//         result += String.fromCharCode.apply(
//           null,
//           uint8Array.subarray(i, i + CHUNK_SIZE)
//         );
//       }

//       const base64String = btoa(result);
//       resolve(`data:image/jpeg;base64,${base64String}`);
//     };
//     reader.onerror = (error) => {
//       reject(error);
//     };
//     reader.readAsArrayBuffer(file);
//   });
// };
// utils/convertToBase64.js
// Ensures compatibility with both File and Uint8Array inputs
export const convertFileToBase64 = (input) => {
  return new Promise((resolve, reject) => {
    if (input instanceof File) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);

        // Convert to Base64 for display only
        const base64String = btoa(String.fromCharCode(...uint8Array));
        resolve(`data:image/jpeg;base64,${base64String}`);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(input);
    } else if (input instanceof Uint8Array) {
      // Direct Uint8Array to Base64 for display
      const base64String = btoa(String.fromCharCode(...input));
      resolve(`data:image/jpeg;base64,${base64String}`);
    } else {
      reject(new Error("Unsupported input type"));
    }
  });
};



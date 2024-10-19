const secretKey = 'kCNOkp6T1pBMWjO9NBnqIEHyjVZfug6s';
const halpers = {
  encryptData: async function encryptData(data) {
    const encoder = new TextEncoder();

    // Menggunakan PBKDF2 untuk menghasilkan kunci AES dengan panjang yang valid
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secretKey),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new Uint8Array(16), // Salt untuk memastikan kunci berbeda di setiap enkripsi
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 }, // Menggunakan AES-256
      false,
      ["encrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector (IV)

    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encoder.encode(JSON.stringify(data)) // Mengubah objek ke string dan mengenkripsi
    );

    // Gabungkan IV dan ciphertext untuk disimpan
    const combinedData = new Uint8Array(iv.byteLength + encryptedData.byteLength);
    combinedData.set(iv);
    combinedData.set(new Uint8Array(encryptedData), iv.byteLength);

    // Konversi menjadi string base64 untuk disimpan di localStorage
    return btoa(String.fromCharCode(...combinedData));
  },
  
  decryptData: async function decryptData(encryptedData) {
    const decoder = new TextDecoder();

    // Menggunakan PBKDF2 untuk menghasilkan kunci AES dengan panjang yang valid
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secretKey),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new Uint8Array(16), // Salt yang sama digunakan untuk dekripsi
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 }, // Menggunakan AES-256
      false,
      ["decrypt"]
    );

    // Decode base64 menjadi array byte
    const dataBuffer = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)));

    const iv = dataBuffer.slice(0, 12); // IV disimpan di awal data
    const cipherText = dataBuffer.slice(12); // Sisanya adalah ciphertext

    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      cipherText
    );

    return JSON.parse(decoder.decode(decryptedData)); // Mengembalikan objek asli
  },
};

export default halpers;
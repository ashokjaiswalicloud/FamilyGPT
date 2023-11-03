const projectId = "gns-gpt-bot";
const location = "us"; // Format is 'us' or 'eu'
const { appendRow } = require("@/utils/gsheet");
// const processorId = "e7a923443fcb4ffb"; // form parser id
const processorId = "1af71b78f04c04c3"; // form processor trained for surge fee
const { getReceiptData } = require("@/utils/openai");

const { DocumentProcessorServiceClient } =
  require("@google-cloud/documentai").v1;

const client = new DocumentProcessorServiceClient();

const fs = require("fs");
const path = require("path");

let counter = 0;
let total = 0;
async function parseImagesInFolder(folderPath) {
  // Read the contents of the folder
  const files = await fs.promises.readdir(folderPath, { withFileTypes: true });

  // Loop through each file/directory in the folder
  for (const file of files) {
    const filePath = path.join(folderPath, file.name);

    // If the item is a directory, recursively parse its contents
    if (file.isDirectory()) {
      await parseImagesInFolder(filePath);
      continue;
    }

    // If the file is not a PNG, JPEG or JPG file, skip it
    if (
      ![".png", ".jpeg", ".jpg"].includes(path.extname(filePath).toLowerCase())
    ) {
      continue;
    }

    // Read the file data
    const fileData = await fs.promises.readFile(filePath);

    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
    const request = {
      name,
      rawDocument: {
        content: fileData,
        mimeType: "image/png",
      },
    };
    // Parse the document using Document AI
    const [result] = await client.processDocument(request);
    const { document } = result;

    if (
      (document.text.includes("GrabFood") ||
        document.text.includes("GrabPay")) &&
      document.text.includes("Total net earnings")
    ) {
      // Log the text extracted from the document
      let receiptText = await getReceiptData(document.text);
      // receiptText.telegramId = ctx.user.telegramId;
      // receiptText.userId = ctx.user.id;
      receiptText.company = "grab";
      receiptText.vehicle = "motorbike";
      // receiptText.name = ctx.user.first_name;
      // receiptText.zone = ctx.user.zone;
      // receiptText.downloadUrl = photoFirestoreUrl;

      console.log(Object.values(receiptText));

      const rows = await appendRow(
        process.env.GOOGLE_SHEET_SURVEY_RECEIPT_ID,
        1,
        // Object.values(receiptText)
        [
          counter + 1,
          receiptText.time,
          receiptText.date,
          receiptText.startLocation,
          receiptText.endLocation,
          receiptText.stops,
          receiptText.distance,
          receiptText.payment,
          receiptText.method,
          receiptText.netEarnings,
          receiptText.deliveryFee,
          receiptText.totalEarnings,
          receiptText.tips,
          "ctx.user.id",
          "grab",
          "motorbike",
          "ctx.user.zone",
          "photoFirestoreUrl",
        ]
      );

      console.log("-------- name value pair is------");
      console.log(receiptText, typeof receiptText);
      console.log("--------------------------------");

      console.log(`------------Text from file ${filePath}:----------`);
      console.log(document.text);
      console.log(
        `-----------------${counter++}--------------------------------`
      );
    }
  }
}

const images = "/Users/ashokjaiswal/Downloads/Receipts";

// Example usage: parse all PNG, JPEG and JPG files in the "images" folder
parseImagesInFolder(images);

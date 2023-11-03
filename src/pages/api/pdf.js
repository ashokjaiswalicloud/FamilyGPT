const pdfParse = require("pdf-parse");
import multer from "multer";
import nextConnect from "next-connect";
let upload = multer({
  storage: multer.memoryStorage(),
}).fields([
  { name: "logo", maxCount: 1 },
  { name: "content", maxCount: 250 },
]);

const handler = nextConnect()
  .use(upload)
  .post(async (req, res) => {
    try {
      let reply = "";
      if (req.files.content) {
        for (let i = 0; i < req.files.content.length; i++) {
          reply += "File " + req.files.content[i].originalname + "\n";
          console.log(i, req.files.content[i].originalname);
          const pdfData = await pdfParse(req.files.content[i].buffer);
          const lines = pdfData.text.split("\n").map((line) => line.trim());

          const extra = [
            "Tips",
            "Miscellaneous Payments",
            "Rental Fees",
            "Adjustments",
          ];
          let Tips = 0;
          let Miscellaneous = 0;
          let Rental = 0;
          let Adjustments = 0;

          for (let j = 0; j < 35; j++) {
            // console.log(j, lines[j]);
            if (lines[j] === extra[0] && Tips === 0) Tips++;
            if (lines[j] === extra[1] && Miscellaneous === 0) Miscellaneous++;
            if (lines[j] === extra[2] && Rental === 0) Rental++;
            if (lines[j] === extra[3] && Adjustments === 0) Adjustments++;
          }

          let top = 2;
          const starts = lines.reduce(function (a, e, i) {
            if (e === "Weekly Total") a.push(i);
            return a;
          }, []);

          if (starts.length >= 2) {
            reply = reply + "Name" + "\t" + lines[starts[1] + 2].trim() + "\n";
            let start = starts[0];
            reply = reply + lines[start] + "\t" + lines[++start].trim() + "\n";
            // console.log(lines[start], "\t", lines[++start].trim());
            //skip next 2 lines
            start += 2;
            //now go through all the items starting from top until weekly total
            let offset = Tips + Miscellaneous + Rental + Adjustments;
            for (let j = 0; j < 7 + offset; j++) {
              reply =
                reply + lines[++start] + "\t" + lines[++top].trim() + "\n";
              // console.log(lines[++start], "\t", lines[++top].trim());
            }
          }
          let start = lines.indexOf("Driver Statement");
          //now get week and name
          if (start > 1) {
            const weekDates = lines[start + 1].trim().split(" - ");

            const startDate = new Date(weekDates[0]);
            const endDate = new Date(weekDates[1]);

            const startDateFormat = `${startDate.getDate()}/${
              startDate.getMonth() + 1
            }/${startDate.getFullYear()}`;
            const endDateFormat = `${endDate.getDate()}/${
              endDate.getMonth() + 1
            }/${endDate.getFullYear()}`;

            reply += "Start date: " + startDateFormat + "\n";
            reply += "End date: " + endDateFormat + "\n";
            console.log("Start date: " + startDateFormat);
            console.log("End date: " + endDateFormat);
          }
          console.log("\n\n");
        }
      }
      return res.send(reply);
      // return res.status(200).json({ result: "OK" });
    } catch (error) {
      return res.status(200).json({ error: error.message });
    }
  });

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};

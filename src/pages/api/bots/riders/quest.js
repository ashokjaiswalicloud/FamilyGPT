const { GoogleSpreadsheet } = require("google-spreadsheet");

const sheetIdFromCompany = (company) => {
  if (company.toLowerCase().includes("grab"))
    return process.env.GRAB_GOOGLE_SHEET_QUEST_DATA_ID;
  if (company.toLowerCase().includes("foodpanda"))
    return process.env.FOODPANDA_GOOGLE_SHEET_QUEST_DATA_ID;
  if (company.toLowerCase().includes("deliveroo"))
    return process.env.DELIVERLOO_GOOGLE_SHEET_QUEST_DATA_ID;
};

export async function getQuestData(company, zone, vehicle, period) {
  console.log("getQuestData", company, zone, vehicle, period);
  const sheetIndex = period === "Next Week" ? 1 : 0;
  let message = `${zone} incentive for ${vehicle} ${period}:\n`;
  let found = false;
  try {
    const private_key = process.env.GOOGLE_PRIVATE_KEY;
    const doc = new GoogleSpreadsheet(sheetIdFromCompany(company));
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: private_key.replace(/\\n/gm, "\n"),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[sheetIndex];
    const rows = await sheet.getRows();

    const foundRows = [];

    rows.forEach((row, index) => {
      if (row._rawData[0]) {
        const vehicles = row._rawData[0].trim().split(",");
        if (vehicles.includes(vehicle)) {
          foundRows.push(index);
        }
      }
    });

    foundRows.forEach((row) => {
      const zone1 = rows[row - 1]._rawData[3]
        .trim()
        .split(",")
        .map((v) => v.trim());

      const zone2 = rows[row - 1]._rawData[4]
        .trim()
        .split(",")
        .map((v) => v.trim());

      if (zone1.includes(zone) || zone2.includes(zone)) {
        found = true;
        message += `\n📅 ${rows[row]._rawData[1]} 📅\n`;
        for (let i = row; i < row + 5; i++) {
          message += `Make ${rows[i]._rawData[2]} orders 👉 receive ${rows[i]._rawData[4]}\n`;
        }
      }
    });
  } catch (e) {
    found = true;
    message = e.message;
    console.log(e);
  }

  return found
    ? message
    : `I don't see any Quest Incentives, for this period 🤔`;
}

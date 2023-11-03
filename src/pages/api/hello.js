// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  console.log("Hello world");
  let lines = req.body.trim().split("\n");
  // Remove empty lines and empty spaces at the beginning and end of each line
  lines = lines.filter((row) => row != "").map((line) => line.trim());

  console.log(lines);
  // return res.status(200).json({ answer: lines });

  res.status(200).json({ name: "How are you?" });
}

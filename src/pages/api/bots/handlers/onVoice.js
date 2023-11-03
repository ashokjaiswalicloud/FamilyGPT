const speech = require("@google-cloud/speech");
import axios from "axios";

export const handleVoice = async (ctx, bot, docName) => {
  console.log("Handle Voice", ctx);
  const client = new speech.SpeechClient({
    credentials: {
      private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9gTCrAJAWplPW\nlwo+RxYcucEnyBWA86Ji8C3mm2ylLp082l/czyaJOm+cUdlsyeqekcPyrKKrFjge\nirkjf6OkDyh/UpfsFfBymSkFPD/uN3ym2f72TE15NKib4YL7bBx8M6ZQqr5yPvW3\nlv4iZQF1WsGpyFKEXQ0eksM5QQ1eOxyytNE3Uj9BYcXe9YnYCRzwzAXQ8T97L+Yb\nar4iKyGrlBphssbsPwoQYJfp7VhJ8S+bDsBU1m0X/7hfEbLJKqcnYpVZw5z2/mYB\nkqJnwJRohWrAlGsFtEZ/77J1cRsHRpV5TKzcCb3NmAqbwql32jWcsAZHG6hgDJ3u\nryLMttnJAgMBAAECggEAB6GW00IM616UEHeJXe/opew8iSSzafuVqdiMbqWKYt39\nTryoANk2Lu9DnJbGs8zvReaujnyReeSFisRRF4r9rN7/5V2u+L667bB5gIiYNfh1\nzHXJoMM6mPOMCSf0CXolbQJ683NmwyzCIhwiXIH3BLHsi9DhcstY+obUNf9mwYk7\nyPnYUtDVa5EKYYq3vjoQVEkWo3RsEmsnjugZxKWJ49NveLL149P6SruZmnPrMOKd\n3tu5nJqgsIgUgUlXE+pF+f1wdVCgYhv/GOQNfeZCIVoSwyV6KmwTCpU91ttQpLfk\nHhcInTIcG6E8WundPqoah+3ZcE018AyiQWDNxsbg4QKBgQDyU2g4YJDBD5MlUwpr\nyc8th5NaFrZtdcAX3gKxcSLIAOwsjVi7z0cXku6R2Ovlj7W0F3A5RlLSZ6xtTcbX\no43iYYo/daXM9Y0FxyHBCKRjopsQfqCuNNBI0VIlmTHi3fCUEZYh2n4qBbtiZIYl\nOFmFpRyzW9yjBeNL93v3BVqHaQKBgQDIMr0Nwk9AGUsx2OqLTBJUKXytLaTaWsbC\nBhmYMUzIEV+lWyeOtF1pYbm5VTU7sqw46aTPtBKwm50SW9Ek3ikkDTXQXhzAIpSn\nA6Hp/0jO+PFi4bDffeTzzxucluArcFmfYvg0oL1rPCVchxicTT4/E/jlzSxZXfAC\n0rWWTZ7TYQKBgHCQdAo0OSmlPXoKD/4v+ZAxuS4Q/N7t4rRziZa5cimr3Al6Ay0C\nxQhbVXzkYff6ALLObG/+jbx1MjB3/5TtwZvWKWz/Dmyd58s2TCSqCgrKXvOTjro9\niD87FMioV/cFl5qAbNf+8bo9fWTgQzwI5/Tf1OwwENadho8kQC5oCzx5AoGAGq4Y\nX+MLaMF2Mfh0mYfT0X+N7A5vL+J1JpplgtDfKLKYCpNxXCVRZZ/ufnKKm6AeL5+D\npWKcMwkqD65I2x74YKOaDmDceAajxPZI98Rb0al/kev+BGrkvlFVnrLEwUVBzGoG\nJg1d8RKc8A3ZC8uHhiSFQSrsxCQuvlGSfatuhUECgYEAqjYcDZx6AKf1Pp2+Qumc\nur/VbyLwYm/IFHw8MSJu00hyOwxgJ6Q3iwA+p5RfX4O/XZmBByuNTj+cv+fhQHcJ\nn/ROPP+vjZieMYjtogVv7c2GjPOLhPW9U/LRKTzuYElC+W8tnvjBl+Mr9s1YMZJe\nFqld5Mp1b0pQNaU/bs31Kts=\n-----END PRIVATE KEY-----\n`,
      client_email: "my-speech-to-text-sa@gns-gpt-bot.iam.gserviceaccount.com",
    },
  });

  const fileUrl = `https://api.telegram.org/bot${bot.token}/getFile?file_id=${ctx.voice.file_id}`;
  const urlRes = await axios.get(fileUrl);
  const { file_path } = urlRes.data.result;
  const url = `https://api.telegram.org/file/bot${bot.token}/${file_path}`;
  console.log("The ogg file", url);
  const download = await axios.get(url, {
    responseType: "arraybuffer",
  });

  console.log(download.data);
  const buffer = new Uint8Array(download.data);
  const gcsUri = "gs://gns-gpt-bot.appspot.com/audio-files/file_56.oga";

  const config = {
    encoding: "OGG_OPUS",
    sampleRateHertz: 48000,
    languageCode: "zh-CN", //"hi",
    model: "default",
    enableSeparateRecognitionPerChannel: true,
    audioChannelCount: 1,
    enableWordTimeOffsets: true,
  };

  const audio = {
    content: buffer, //fs.readFileSync(filename).toString("base64"),
  };

  const request = {
    config: config,
    audio: audio,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);
  return transcription;
};

export default handleVoice;

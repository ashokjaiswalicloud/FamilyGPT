const speech = require("@google-cloud/speech");
const projectId = "gns-gpt-bot";
const location = "us"; // Format is 'us' or 'eu'

// const client = new speech.SpeechClient();

/**
 * Calls the Speech-to-Text API on a demo audio file.
 */

// Creates a Recognizer:
async function createRecognizer() {
  const recognizerRequest = {
    parent: `projects/${projectId}/locations/global`,
    recognizerId: recognizerId,
    recognizer: {
      languageCodes: ["en-US"],
      model: "latest_long",
    },
  };

  const operation = await client.createRecognizer(recognizerRequest);
  const recognizer = operation[0].result;
  const recognizerName = recognizer.name;
  console.log(`Created new recognizer: ${recognizerName}`);
}

async function transcribeFile() {
  // audioFilePath = 'path/to/file/brooklyn.flac'
  // const recognizerName= "projects/[PROJECT_ID]/locations/[LOCATION]/recognizers/[RECOGNIZER_ID]";

  const content = fs.readFileSync(audioFilePath).toString("base64");
  const transcriptionRequest = {
    recognizer: recognizerName,
    config: {
      // Automatically detects audio encoding
      autoDecodingConfig: {},
    },
    content: content,
  };

  const response = await client.recognize(transcriptionRequest);
  for (const result of response[0].results) {
    console.log(`Transcript: ${result.alternatives[0].transcript}`);
  }
}

await createRecognizer();
-(await transcribeFile());

async function quickstart() {
  console.log(process.env.GOOGLE_PRIVATE_KEY);
  console.log("the key is ");

  const client = new speech.SpeechClient({
    credentials: {
      private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9gTCrAJAWplPW\nlwo+RxYcucEnyBWA86Ji8C3mm2ylLp082l/czyaJOm+cUdlsyeqekcPyrKKrFjge\nirkjf6OkDyh/UpfsFfBymSkFPD/uN3ym2f72TE15NKib4YL7bBx8M6ZQqr5yPvW3\nlv4iZQF1WsGpyFKEXQ0eksM5QQ1eOxyytNE3Uj9BYcXe9YnYCRzwzAXQ8T97L+Yb\nar4iKyGrlBphssbsPwoQYJfp7VhJ8S+bDsBU1m0X/7hfEbLJKqcnYpVZw5z2/mYB\nkqJnwJRohWrAlGsFtEZ/77J1cRsHRpV5TKzcCb3NmAqbwql32jWcsAZHG6hgDJ3u\nryLMttnJAgMBAAECggEAB6GW00IM616UEHeJXe/opew8iSSzafuVqdiMbqWKYt39\nTryoANk2Lu9DnJbGs8zvReaujnyReeSFisRRF4r9rN7/5V2u+L667bB5gIiYNfh1\nzHXJoMM6mPOMCSf0CXolbQJ683NmwyzCIhwiXIH3BLHsi9DhcstY+obUNf9mwYk7\nyPnYUtDVa5EKYYq3vjoQVEkWo3RsEmsnjugZxKWJ49NveLL149P6SruZmnPrMOKd\n3tu5nJqgsIgUgUlXE+pF+f1wdVCgYhv/GOQNfeZCIVoSwyV6KmwTCpU91ttQpLfk\nHhcInTIcG6E8WundPqoah+3ZcE018AyiQWDNxsbg4QKBgQDyU2g4YJDBD5MlUwpr\nyc8th5NaFrZtdcAX3gKxcSLIAOwsjVi7z0cXku6R2Ovlj7W0F3A5RlLSZ6xtTcbX\no43iYYo/daXM9Y0FxyHBCKRjopsQfqCuNNBI0VIlmTHi3fCUEZYh2n4qBbtiZIYl\nOFmFpRyzW9yjBeNL93v3BVqHaQKBgQDIMr0Nwk9AGUsx2OqLTBJUKXytLaTaWsbC\nBhmYMUzIEV+lWyeOtF1pYbm5VTU7sqw46aTPtBKwm50SW9Ek3ikkDTXQXhzAIpSn\nA6Hp/0jO+PFi4bDffeTzzxucluArcFmfYvg0oL1rPCVchxicTT4/E/jlzSxZXfAC\n0rWWTZ7TYQKBgHCQdAo0OSmlPXoKD/4v+ZAxuS4Q/N7t4rRziZa5cimr3Al6Ay0C\nxQhbVXzkYff6ALLObG/+jbx1MjB3/5TtwZvWKWz/Dmyd58s2TCSqCgrKXvOTjro9\niD87FMioV/cFl5qAbNf+8bo9fWTgQzwI5/Tf1OwwENadho8kQC5oCzx5AoGAGq4Y\nX+MLaMF2Mfh0mYfT0X+N7A5vL+J1JpplgtDfKLKYCpNxXCVRZZ/ufnKKm6AeL5+D\npWKcMwkqD65I2x74YKOaDmDceAajxPZI98Rb0al/kev+BGrkvlFVnrLEwUVBzGoG\nJg1d8RKc8A3ZC8uHhiSFQSrsxCQuvlGSfatuhUECgYEAqjYcDZx6AKf1Pp2+Qumc\nur/VbyLwYm/IFHw8MSJu00hyOwxgJ6Q3iwA+p5RfX4O/XZmBByuNTj+cv+fhQHcJ\nn/ROPP+vjZieMYjtogVv7c2GjPOLhPW9U/LRKTzuYElC+W8tnvjBl+Mr9s1YMZJe\nFqld5Mp1b0pQNaU/bs31Kts=\n-----END PRIVATE KEY-----\n`,
      client_email: "my-speech-to-text-sa@gns-gpt-bot.iam.gserviceaccount.com",
    },
  });

  // The path to the remote LINEAR16 file stored in Google Cloud Storage
  const gcsUri = "gs://cloud-samples-data/speech/brooklyn_bridge.raw";

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    uri: gcsUri,
  };
  const config = {
    encoding: "LINEAR16",
    sampleRateHertz: 16000,
    languageCode: "en-US",
    enableWordTimeOffsets: true,
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  response.results.forEach((result) => {
    result.alternatives.forEach((alternative) => {
      console.log(`Transcript: ${alternative.transcript}`);
      console.log(`Word details:`);
      console.log(` Word count ${alternative.words.length}`);
      alternative.words.forEach((item) => {
        console.log(`  ${item.word}`);
        const s =
          parseInt(item.startTime.seconds) + item.startTime.nanos / 1000000000;
        console.log(`   WordStartTime: ${s}s`);
        const e =
          parseInt(item.endTime.seconds) + item.endTime.nanos / 1000000000;
        console.log(`   WordEndTime: ${e}s`);
      });
    });
  });
}

quickstart();

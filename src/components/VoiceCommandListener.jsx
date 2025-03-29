// import React, { useEffect } from 'react';
// import * as tmAudio from '@teachablemachine/audio';

// const VoiceCommandListener = ({ onCommandRecognized }) => {
//   const URL = 'https://teachablemachine.withgoogle.com/models/'; // 

//   useEffect(() => {
//     let model, mic;

//     const init = async () => {
//       model = await tmAudio.load(URL + 'model.json', URL + 'metadata.json');
//       mic = new tmAudio.AudioModel(model);

//       await mic.listen(result => {
//         const highest = result.sort((a, b) => b.probability - a.probability)[0];
//         console.log('Recognized:', highest.className, highest.probability);

//         if (highest.probability > 0.85) {
//           onCommandRecognized(highest.className);
//         }
//       }, {
//         probabilityThreshold: 0.85
//       });
//     };

//     init();

//     return () => {
//       if (mic) mic.stopListening();
//     };
//   }, []);

//   return null; // No UI
// };

// export default VoiceCommandListener;

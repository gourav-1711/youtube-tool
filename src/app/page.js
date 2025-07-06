import React from 'react'
import HomeComponent from './HomeComponent';



// const options = {
//   method: 'GET',
//   url: 'https://youtube-to-mp315.p.rapidapi.com/status/3168b52c-ba6e-45d8-bc58-014ad0a5a5d6',
//   headers: {
//     'x-rapidapi-key': '5f0323ef84msh745b88c630bfac5p1485abjsn7b94adffcce0',
//     'x-rapidapi-host': 'youtube-to-mp315.p.rapidapi.com'
//   }
// };

// try {
// 	const response = await axios.request(options);
// 	console.log(response.data);
// } catch (error) {
// 	console.error(error);
// }



export default function Home() {
  return (
    <>
    <HomeComponent/>
    </>
  );
}

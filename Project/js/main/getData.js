// // Set up our HTTP request
// var xhr = new XMLHttpRequest();
//
// // Setup our listener to process completed requests
// xhr.onload = function () {
//
//   // Process our return data
//   if (xhr.status >= 200 && xhr.status < 300) {
//     // What do when the request is successful
//     console.log('success!', xhr);
//     console.log('responseText:' + xhr.responseText);
//   } else {
//     // What do when the request fails
//     console.log('The request failed!');
//   }
//
//   // Code that should run regardless of the request status
//   console.log('This always runs...');
// };
//
// // Create and send a GET request
// // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
// // The second argument is the endpoint URL
// xhr.open('GET', 'https://lyceumexams.herokuapp.com/api/corpses');
// xhr.send();


// function ajax_get(url, callback) {
//   let xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = function () {
//     let data = JSON.parse(xhr.responseText);
//     if (xhr.readyState === 4 && xhr.status === 200) {
//       console.log('responseText:' + xhr.responseText);
//       try {
//       } catch (err) {
//         console.log(err.message + " in " + xhr.responseText);
//         return;
//       }
//       callback(data);
//     }
//   };
//
//   xhr.open("GET", url, true);
//   xhr.send();
// }

// ajax_get('https://lyceumexams.herokuapp.com/api/corpses', function (data) {
//   for (let i = 0; i < data.length; i++) {
//     //console.log(data[i]["name"]);
//     buildings.push(data[i]["name"]);
//   }
// });



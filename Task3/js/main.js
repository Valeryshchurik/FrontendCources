//1.
//listen for window resize event
window.addEventListener('resize', function(event){
  var newWidth = window.innerWidth;
  var newHeight = window.innerHeight;
  console.log(newWidth)
  console.log(newHeight)
});

//2.
//Change URL params
// Construct URLSearchParams object instance from current URL querystring.
function setUrlParameter(param_name, param_value){
  let theURL              = new URL('https://dummy.com');
  theURL.searchParams.set(param_name, param_value);
  console.log(theURL.href)
}

//3.
//Change hash URL params
// Construct URLSearchParams object instance from current URL querystring.
function setUrlHashParameter(param_name, param_value){
  let theURL              = new URL('https://dummy.com');             // create dummy url
  theURL.search           = window.location.hash.substring(1);        // copy current hash-parameters without the '#' AS search-parameters
  theURL.searchParams.set(param_name, param_value);   // set or update value with the searchParams-API
  window.location.hash    = theURL.searchParams;                     // Write back as hashparameters
  console.log(window.location.hash)
}

//4.
//Create custom previous and next pages buttons on your page

//5.
//Browser info
function printBrowserInfoStack(){
  console.log('Here goes some of the info')
  console.log('Browser user-agent is ' + navigator.userAgent)
  console.log('Are cookies enabled? ' + navigator.cookieEnabled)
  console.log('User preference of doNotTrack: ' + navigator.doNotTrack)
  console.log('Number of processor cores of the device: ' + navigator.hardwareConcurrency)
  console.log('Browser’s primary language - ' + navigator.language)
  console.log('Browser’s preferred languages: ' + navigator.languages)
  console.log('Is currently controlled by automation? ' + navigator.webdriver)
  console.log('Currently you are on ' + location.href)
}

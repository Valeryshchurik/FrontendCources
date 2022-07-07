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
  searchParams = new URLSearchParams(window.location.search)
  searchParams.set(param_name, param_value);
  history.pushState(null, null, "?"+searchParams.toString());
}

//3.
//Change hash URL params
// Construct URLSearchParams object instance from current URL querystring.
function setUrlHashParameter(param_name, param_value){
  searchParams = new URLSearchParams()
  searchParams.set(param_name, param_value);
  window.location.hash = searchParams;
}



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

//4.
//Create custom previous and next pages buttons on your page
//You can see that it works as it keep the params from 2 and 3 task

function customBack(){
  history.back()
}

function customForward(){
  history.forward()
}

window.onload = function() {
  const buttonSetUrlParamButton = document.getElementById('setUrlParam')
  buttonSetUrlParamButton.addEventListener('click', setUrlParameter.bind(null, 'x', 6))
  const buttonSetHashParamButton = document.getElementById('setHashParam')
  buttonSetHashParamButton.addEventListener('click', setUrlHashParameter.bind(null, 'x', 6))
  const printBrowserInfoStackButton = document.getElementById('printBrowserInfoStack')
  printBrowserInfoStackButton.addEventListener('click', printBrowserInfoStack)
  const backButton = document.getElementById('customBack')
  backButton.addEventListener('click', customBack)
  const forwardButton = document.getElementById('customForward')
  forwardButton.addEventListener('click', customForward)
};

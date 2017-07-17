import '../sass/content.scss'

var hamburgerButton = document.querySelector('.hamburger-open');
var closeButton = document.querySelector('.sidebar .closebtn');

hamburgerButton.addEventListener('click', () =>{
  document.getElementById('sidebar').classList.add('active');
});

closeButton.addEventListener('click', () =>{
  document.getElementById('sidebar').classList.remove('active');
})
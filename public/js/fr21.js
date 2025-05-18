// === Original Toggle Logic ===
var clients = document.getElementById('clients');
var services = document.getElementById('services');

if (clients && services) {
  clients.addEventListener('click', function () {
    $(clients).toggleClass("active");
    $(".parent:not(#clients)").toggleClass("invisible");
  }, false);

  services.addEventListener('click', function () {
    $(services).toggleClass("active");
    $(".parent:not(#services)").toggleClass("invisible");
  }, false);
}

// === Carousel Logic for Features Section ===
document.addEventListener('DOMContentLoaded', function () {
  var track = document.querySelector('.carousel-track');
  var slides = Array.from(track?.children || []);
  var nextButton = document.querySelector('.right-arrow');
  var prevButton = document.querySelector('.left-arrow');
  var currentIndex = 0;

  function updateSlidePosition() {
    if (track) {
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    }
  }

  if (nextButton && prevButton && track && slides.length > 0) {
    nextButton.addEventListener('click', function () {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlidePosition();
    });

    prevButton.addEventListener('click', function () {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlidePosition();
    });
  }
});


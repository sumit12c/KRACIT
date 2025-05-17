document.addEventListener("DOMContentLoaded", function () {
  const avatar = document.getElementById("profileAvatar");
  const dropdown = document.getElementById("profileDropdown");
  const navbar = document.querySelector(".navigationWrapper");

  let lastScrollTop = 0;

  avatar.addEventListener("click", function (e) {
      e.stopPropagation();
      // Toggle dropdown visibility
      if (dropdown.style.display === "block") {
          dropdown.style.display = "none";
      } else {
          dropdown.style.display = "block";
      }
  });

  document.addEventListener("click", function (e) {
      // Close dropdown if clicked outside
      if (!avatar.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.style.display = "none";
      }
  });

  window.addEventListener("scroll", function () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
          // Scrolling down
          navbar.style.top = "-80px"; // Hide navbar
      } else {
          // Scrolling up
          navbar.style.top = "0";
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Avoid negative scroll
  });
});

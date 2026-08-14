/**
 * @Author: rogue-dev-studio
 * @Date: 2026-08-14 16:50:00
 * @Last Modified by: rogue-dev-studio
 * @Last Modified time: 2026-08-14 16:50:00
 */

(function () {
  var CATALOG_URL = "https://rogue-dev-studio.github.io/data/catalog.json";
  var AVATAR = "https://avatars.githubusercontent.com/u/47584746?v=4";
  var BADGES = [
    "badge-primary",
    "badge-secondary",
    "badge-success",
    "badge-danger",
    "badge-warning",
    "badge-info",
    "badge-light",
    "badge-dark"
  ];

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[ch];
    });
  }

  function badgeClass() {
    return BADGES[Math.floor(Math.random() * BADGES.length)];
  }

  function thumb(repo) {
    if (repo.images && repo.images.length) {
      return '<img src="' + esc(repo.images[0]) + '" class="img-fluid rounded" alt="">';
    }
    return '<img src="assets/images/error/error-404.png" class="img-fluid rounded" alt="">';
  }

  function card(repo) {
    var name = esc((repo.name || "").slice(0, 20)) + ((repo.name || "").length > 20 ? " ..." : "");
    var lang = repo.language
      ? '<a href="#" class="mb-1 mt-1 badge ' + badgeClass() + '">' + esc(repo.language) + "</a>"
      : "";
    var when = repo.updated_at && window.moment
      ? window.moment(repo.updated_at).fromNow()
      : "";
    return (
      '<div class="col-lg-4 col-md-6 item-recent" data-category="github">' +
      '<div class="card card-block card-stretch card-height">' +
      '<div class="card-header">' +
      '<h5 class="float-left"><a href="' + esc(repo.html_url) + '" class="repo-name">' + name + "</a></h5>" +
      "</div>" +
      '<div class="card-body">' +
      thumb(repo) +
      '<p class="mb-1">' + esc(repo.description) + "</p>" +
      '<p class="mb-1 mt-1">Languages :</p>' +
      lang +
      '<div class="d-flex align-items-center justify-content-between pt-3 border-top">' +
      '<div class="iq-media-group"><a href="#" class="iq-media">' +
      '<img class="img-fluid avatar-40 rounded-circle" src="' + AVATAR + '" alt="">' +
      "</a></div>" +
      '<small class="text-muted">' + esc(when) + "</small>" +
      "</div></div></div></div>"
    );
  }

  function bindCategories() {
    var folderList = document.getElementById("folderList");
    var selectedCategory = document.getElementById("selected-category");
    if (!folderList) {
      return;
    }
    ["all", "github", "youtube"].forEach(function (name) {
      var link = document.createElement("a");
      link.className = "dropdown-item recent-content";
      link.href = "#";
      link.setAttribute("data-category", name);
      link.innerHTML = '<i class="ri-folder-line mr-2"></i>' + name.charAt(0).toUpperCase() + name.slice(1);
      folderList.appendChild(link);
    });
    if (window.jQuery) {
      window.jQuery(".recent-content").on("click", function (event) {
        event.preventDefault();
        var category = window.jQuery(this).data("category");
        if (selectedCategory) {
          selectedCategory.textContent = String(category).charAt(0).toUpperCase() + String(category).slice(1);
        }
        if (category === "all") {
          window.jQuery(".item-recent").show();
        } else {
          window.jQuery(".item-recent").hide();
          window.jQuery('.item-recent[data-category="' + category + '"]').show();
        }
      });
    }
  }

  function bindNotice() {
    var root = document.getElementById("rw-notice");
    var stay = document.getElementById("rw-notice-stay");
    if (!root || !stay) {
      return;
    }
    if (sessionStorage.getItem("rw-notice-dismissed") === "1") {
      root.hidden = true;
      document.body.classList.remove("rw-notice-lock");
      return;
    }
    document.body.classList.add("rw-notice-lock");
    stay.addEventListener("click", function () {
      sessionStorage.setItem("rw-notice-dismissed", "1");
      root.hidden = true;
      document.body.classList.remove("rw-notice-lock");
    });
  }

  bindNotice();
  bindCategories();

  var repoList = document.getElementById("repo-list");
  if (!repoList) {
    return;
  }

  fetch(CATALOG_URL)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("catalog");
      }
      return response.json();
    })
    .then(function (data) {
      var list = Array.isArray(data)
        ? data
        : [].concat(data.karya || [], data.lab || []);
      list.slice(0, 36).forEach(function (repo) {
        repoList.insertAdjacentHTML("beforeend", card(repo));
      });
    })
    .catch(function () {
      repoList.insertAdjacentHTML(
        "beforeend",
        '<div class="col-12"><p>Galeri tidak bisa memuat katalog. Buka situs utama untuk daftar karya.</p></div>'
      );
    });
})();

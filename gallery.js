/**
 * @Author: rogue-dev-studio
 * @Date: 2026-08-14 16:50:00
 * @Last Modified by: rogue-dev-studio
 * @Last Modified time: 2026-08-14 17:00:00
 */

(function () {
  var CATALOG_URL = "https://rogue-dev-studio.github.io/data/catalog.json";
  var AVATAR = "https://avatars.githubusercontent.com/u/47584746?v=4";

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

  function thumb(repo, extraClass) {
    var cls = extraClass ? extraClass : "img-fluid rounded";
    if (repo.images && repo.images.length) {
      return '<img src="' + esc(repo.images[0]) + '" class="' + cls + '" alt="">';
    }
    return '<img src="assets/images/error/error-404.png" class="' + cls + '" alt="">';
  }

  function langBadge(repo) {
    if (!repo.language) {
      return "";
    }
    return '<span class="mb-1 mt-1 badge badge-secondary">' + esc(repo.language) + "</span>";
  }

  function when(repo) {
    return repo.updated_at && window.moment ? window.moment(repo.updated_at).fromNow() : "";
  }

  function shortName(repo) {
    var raw = repo.name || "";
    return esc(raw.slice(0, 28)) + (raw.length > 28 ? " ..." : "");
  }

  function cardGrid(repo, category) {
    return (
      '<div class="col-lg-4 col-md-6 item-recent" data-category="' + esc(category) + '">' +
      '<div class="card card-block card-stretch card-height">' +
      '<div class="card-header">' +
      '<h5 class="float-left"><a href="' + esc(repo.html_url) + '" class="repo-name">' + shortName(repo) + "</a></h5>" +
      "</div>" +
      '<div class="card-body">' +
      thumb(repo) +
      '<p class="mb-1">' + esc(repo.description) + "</p>" +
      '<p class="mb-1 mt-1">Languages :</p>' +
      langBadge(repo) +
      '<div class="d-flex align-items-center justify-content-between pt-3 border-top">' +
      '<div class="iq-media-group"><span class="iq-media">' +
      '<img class="img-fluid avatar-40 rounded-circle" src="' + AVATAR + '" alt="">' +
      "</span></div>" +
      '<small class="text-muted">' + esc(when(repo)) + "</small>" +
      "</div></div></div></div>"
    );
  }

  function cardList(repo, category) {
    return (
      '<div class="col-lg-6 item-recent" data-category="' + esc(category) + '">' +
      '<div class="card"><div class="card-body"><div class="row">' +
      '<div class="col-sm-8"><div class="d-flex align-items-center">' +
      thumb(repo, "img-thumbnail w-100 img-fluid rounded") +
      '<div class="ml-3 col-sm-8">' +
      '<h5 class="mb-1"><a href="' + esc(repo.html_url) + '" class="repo-name">' + shortName(repo) + "</a></h5>" +
      '<p class="mb-1">' + esc(repo.description) + "</p>" +
      '<p class="mb-1 mt-1">Languages :</p>' +
      langBadge(repo) +
      "</div></div></div>" +
      '<div class="col-sm-4 text-sm-right mt-3 mt-sm-0">' +
      '<small class="text-muted">' + esc(when(repo)) + "</small>" +
      "</div></div></div></div></div>"
    );
  }

  function bindCategories() {
    var folderList = document.getElementById("folderList");
    var selectedCategory = document.getElementById("selected-category");
    if (!folderList) {
      return;
    }
    [
      { id: "all", label: "Semua" },
      { id: "karya", label: "Karya" },
      { id: "lab", label: "Lab" }
    ].forEach(function (item) {
      var link = document.createElement("a");
      link.className = "dropdown-item recent-content";
      link.href = "#";
      link.setAttribute("data-category", item.id);
      link.textContent = item.label;
      folderList.appendChild(link);
    });
    if (window.jQuery) {
      window.jQuery(folderList).on("click", ".recent-content", function (event) {
        event.preventDefault();
        var category = window.jQuery(this).data("category");
        if (selectedCategory) {
          selectedCategory.textContent = window.jQuery(this).text();
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
    function closeNotice() {
      sessionStorage.setItem("rw-notice-dismissed", "1");
      root.hidden = true;
      document.body.classList.remove("rw-notice-lock");
    }
    if (sessionStorage.getItem("rw-notice-dismissed") === "1") {
      root.hidden = true;
      document.body.classList.remove("rw-notice-lock");
      return;
    }
    document.body.classList.add("rw-notice-lock");
    stay.addEventListener("click", closeNotice);
    root.addEventListener("click", function (event) {
      if (event.target === root) {
        closeNotice();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !root.hidden) {
        closeNotice();
      }
    });
  }

  bindNotice();
  bindCategories();

  var repoList = document.getElementById("repo-list");
  var repoList2 = document.getElementById("repo-list-2");
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
      var groups = [
        { key: "karya", items: data.karya || [] },
        { key: "lab", items: data.lab || [] }
      ];
      if (Array.isArray(data)) {
        groups = [{ key: "karya", items: data }];
      }
      groups.forEach(function (group) {
        group.items.forEach(function (repo) {
          repoList.insertAdjacentHTML("beforeend", cardGrid(repo, group.key));
          if (repoList2) {
            repoList2.insertAdjacentHTML("beforeend", cardList(repo, group.key));
          }
        });
      });
      if (!repoList.children.length) {
        repoList.insertAdjacentHTML(
          "beforeend",
          '<div class="col-12"><p>Belum ada karya di katalog.</p></div>'
        );
      }
    })
    .catch(function () {
      repoList.insertAdjacentHTML(
        "beforeend",
        '<div class="col-12"><p>Galeri tidak bisa memuat katalog. Buka situs utama untuk daftar karya.</p></div>'
      );
    });
})();

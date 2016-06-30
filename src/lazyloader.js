(function(window, document) {
  var pageNavEls = document.querySelectorAll('.pagenav'),
      postsContainer = document.querySelector('#posts'),
      lazyLoadPageCount = 0,
      last_known_scroll_position = 0,
      ticking = false,
      isLoading = false,
      startPage,
      currentPage,
      totalPageCount,
      currentNavEl,
      stickyNav,
      shadowDom,
      spinner;

  helpers.ready(function() {
    if (pageNavEls.length < 1) { return false; }
    startLazyLoad();
  });

  function startLazyLoad() {
    helpers.addClass(document.body, 'lazy-load');
    postsContainer.appendChild(getSpinner());
    initStickyNav();
    initPageInfo(pageNavEls);
    window.addEventListener('scroll', scrollHandler);
  }

  function stopLazyLoad() {
    startPage = null;
    currentPage = null;
    totalPageCount = null;
    helpers.removeClass(document.body, 'lazy-load');
    window.removeEventListener('scroll', scrollHandler);
  }

  function initPageInfo(pageNavEls) {
    let el = pageNavEls[0].querySelector('.vbmenu_control');
    if (el) {
      var infos = el.innerHTML.split(' ');
      if (infos.length > 3) {
        startPage = startPage || infos[1];
        currentPage = infos[1];
        totalPageCount = totalPageCount || infos[3];
      }
      updateStickyNav();
    }
  }

  function scrollHandler(e) {
    last_known_scroll_position = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function() {
        if (helpers.isElementInViewport(pageNavEls[1])) {
          loadNextPage();
        }
        setTimeout(function() {
          ticking = false;
        }, 300);

      });
    }
    ticking = true;
  }

  function initStickyNav() {
    stickyNav = document.createElement('div');
    helpers.addClass(stickyNav, 'sticky-nav');
    pageNavEls[0].parentNode.insertBefore(stickyNav, pageNavEls[0]);
  }

  function updateStickyNav() {
    if (startPage ===  currentPage) {
      stickyNav.innerHTML = ['Viewing page',
                                   startPage,
                                   'of',
                                   totalPageCount].join(' ');
    } else {
      stickyNav.innerHTML = ['Viewing pages',
                                   startPage,
                                   'through',
                                   currentPage,
                                   'of',
                                   totalPageCount].join(' ');
    }
  }

  function getSpinner() {
    if (spinner) {
      return spinner;
    }

    spinner = document.createElement('div');
    spinner.className = 'spinner hidden';
    spinner.innerHTML = '<div class="loading-ring" style="transform:scale(0.37);"><div></div></div>';
    return spinner;
  }

  function showSpinner() {
    helpers.removeClass(spinner, 'hidden');
  }

  function hideSpinner() {
    helpers.addClass(spinner, 'hidden');
  }

  function moveSpinner() {
    postsContainer.appendChild(spinner);
  }

  function getNextNavEl() {
    if (currentNavEl) {
      currentNavEl = shadowDom.querySelector('.pagenav .alt2');
    } else {
      currentNavEl = pageNavEls[0].querySelector('.alt2');
    }
    return nextNavEl = currentNavEl.nextElementSibling.firstChild;
  }

  function updateHistory(url, lazyLoadPageCount) {
    let stateObj = {
      lazyLoadPageCount: lazyLoadPageCount
    };
    history.replaceState(stateObj, 'boom', url);
  }

  function updatePageNav(shadowNavEls) {
    pageNavEls[0].innerHTML = shadowNavEls[0].innerHTML;
    pageNavEls[1].innerHTML = shadowNavEls[1].innerHTML;
  }

  function loadNextPage() {
    if (isLoading) { return false; }
    isLoading = true;
    showSpinner();

    let nextNavEl = getNextNavEl();

    helpers.addClass(nextNavEl, 'lazy-loaded');
    helpers.ajax(nextNavEl.href, appendResult);
  }

  function appendResult(page, url) {
    shadowDom = helpers.getShadowDom(shadowDom);
    shadowDom.innerHTML = page;
    let shadowNavEls = shadowDom.querySelectorAll('.pagenav');

    hideSpinner();
    updateHistory(url, lazyLoadPageCount++);
    updatePageNav(shadowNavEls);
    initPageInfo(shadowNavEls);

    let newPosts = shadowDom.querySelector('#posts');
    if (!newPosts || newPosts.length < 1) {
       return false;
     }

    let newPostsContainer = document.createElement('div');
    newPostsContainer.innerHTML = newPosts.innerHTML;
    newPostsContainer.className = 'lazy-loaded lazy-page' + lazyLoadPageCount;
    postsContainer.appendChild(newPostsContainer);

    setTimeout(moveSpinner, 500);
    isLoading = false;
  }

})(window, document);

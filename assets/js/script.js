'use strict';



/**
 * navbar toggle
 */

const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");

const navElems = [navOpenBtn, navCloseBtn];

for (let i = 0; i < navElems.length; i++) {
  navElems[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
  });
}



/**
 * search toggle
 */

const searchContainer = document.querySelector("[data-search-wrapper]");
const searchBtn = document.querySelector("[data-search-btn]");

searchBtn.addEventListener("click", function () {
  searchContainer.classList.toggle("active");
});



/**
 * whishlist & cart toggle
 */

const panelBtns = document.querySelectorAll("[data-panel-btn]");
const sidePanels = document.querySelectorAll("[data-side-panel]");

for (let i = 0; i < panelBtns.length; i++) {
  panelBtns[i].addEventListener("click", function () {

    let clickedElemDataValue = this.dataset.panelBtn;

    for (let i = 0; i < sidePanels.length; i++) {

      if (clickedElemDataValue === sidePanels[i].dataset.sidePanel) {
        sidePanels[i].classList.toggle("active");
      } else {
        sidePanels[i].classList.remove("active");
      }

    }

  });
}



/**
 * back to top
 */

const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  window.scrollY >= 100 ? backTopBtn.classList.add("active")
    : backTopBtn.classList.remove("active");
});



/**
 * product details page
 */

const productDisplay = document.querySelector("[data-product-display]");
const productThumbnails = document.querySelectorAll("[data-product-thumbnail]");

for (let i = 0; i < productThumbnails.length; i++) {
  productThumbnails[i].addEventListener("click", function () {
    productDisplay.src = this.src;
    productDisplay.classList.add("fade-anim");

    setTimeout(function () {
      productDisplay.classList.remove("fade-anim");
    }, 250);

  });
}


/* ========= Page transition and auth-guard enhancements ========= */

// Simple auth check: try local token first, fall back to cookie session
async function isAuthenticated(){
  try{
    const at = localStorage.getItem('accessToken');
    if(at){
      const r = await fetch('/api/me', { headers: { 'Authorization': 'Bearer ' + at } });
      if(r.ok) return true;
    }
    // Try cookie-based session
    const rc = await fetch('/api/me', { credentials: 'include' });
    return rc.ok;
  }catch(_e){ return false; }
}

// Fade-in on load
window.addEventListener('DOMContentLoaded', ()=>{
  document.documentElement.classList.add('page-enter');
  requestAnimationFrame(()=>{ document.documentElement.classList.remove('page-enter'); });
});

// Intercept clicks for auth-required actions first, then handle transitions
document.addEventListener('click', async (ev)=>{
  // 1) Priority: find nearest element that explicitly requests auth
  const authEl = ev.target.closest('[data-requires-auth]');
  if(authEl){
    const ok = await isAuthenticated();
    if(!ok){
      ev.preventDefault();
      ev.stopPropagation();
      // Store intended action so login can redirect back
      const href = (authEl.getAttribute && authEl.getAttribute('href')) || window.location.pathname;
      sessionStorage.setItem('post_login_redirect', href);
      // show a small toast to explain redirect
      try{
        const t = document.createElement('div');
        t.className = 'auth-toast';
        t.textContent = 'Bạn cần đăng nhập để thực hiện hành động này. Chuyển sang trang đăng nhập...';
        Object.assign(t.style, { position: 'fixed', right: '20px', bottom: '100px', background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '10px 14px', borderRadius: '8px', zIndex: 99999, fontSize: '13px' });
        document.body.appendChild(t);
        setTimeout(()=>{ t.remove(); }, 2200);
      }catch(_e){}
      window.location.href = '/login.html?redirect=' + encodeURIComponent(href);
      return;
    }
    // authenticated -> allow default handler (e.g., wishlist add will run)
    return;
  }

  // 2) Smooth transition for same-origin anchors (no target, no data-no-transition)
  const link = ev.target.closest('a');
  if(link){
    const href = link.getAttribute('href');
    if(href && href.startsWith('/') && !link.hasAttribute('target') && !link.hasAttribute('data-no-transition')){
      // Allow links that are fragment-only or javascript to proceed
      if(href.startsWith('#') || href.startsWith('javascript:')) return;
      ev.preventDefault();
      document.documentElement.classList.add('page-exit');
      setTimeout(()=> window.location.href = href, 220);
    }
  }
});

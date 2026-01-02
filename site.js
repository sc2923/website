// site.js — smooth page transitions and skiing animation
(function(){
  'use strict';

  var FADE_MS = 360;

  function isLocalLink(href){
    try{
      var url = new URL(href, location.href);
      return url.origin === location.origin;
    }catch(e){ return false; }
  }

  function init(){
    // ensure body visible on load
    document.documentElement.classList.remove('page-exit');

    // Skiing animation
    const skier = document.querySelector('.skier');
    const skierContainer = document.querySelector('.skier-container');
    if (skier && skierContainer) {
      const containerRect = skierContainer.getBoundingClientRect();
      const startX = containerRect.left;
      const startY = containerRect.top;

      let maxTranslateX = window.innerWidth - startX - 60;
      let maxTranslateY = window.innerHeight - startY - 60;

      // On mobile, only move vertically
      if (window.innerWidth <= 680) {
        maxTranslateX = 0;
      }

      function updateSkier() {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = Math.min(scrollY / maxScroll, 1);
        const translateX = progress * maxTranslateX;
        const translateY = progress * maxTranslateY;
        skier.style.transform = `translate(${translateX}px, ${translateY}px)`;
      }

      function updateMax() {
        const newRect = skierContainer.getBoundingClientRect();
        const newStartX = newRect.left;
        const newStartY = newRect.top;
        maxTranslateX = window.innerWidth - newStartX - 60;
        maxTranslateY = window.innerHeight - newStartY - 60;
        // On mobile, only move vertically
        if (window.innerWidth <= 680) {
          maxTranslateX = 0;
        }
        updateSkier();
      }

      window.addEventListener('scroll', updateSkier);
      window.addEventListener('resize', updateMax);
      updateSkier(); // Initial position
    }

    // Section opacity on scroll
    const sections = document.querySelectorAll('.hero, .section');
    function isInView(element) {
      const rect = element.getBoundingClientRect();
      const elementHeight = rect.bottom - rect.top;
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      return visibleHeight > elementHeight * 0.5; // more than 50% visible
    }
    function updateSections() {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (scrollY > maxScroll * 0.95) {
        sections.forEach(s => s.classList.remove('active'));
        sections[sections.length - 1].classList.add('active');
        return;
      }
      let activated = false;
      sections.forEach(section => {
        if (!activated && isInView(section)) {
          section.classList.add('active');
          activated = true;
        } else {
          section.classList.remove('active');
        }
      });
    }
    window.addEventListener('scroll', updateSections);
    updateSections(); // Initial

    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a');
      if(!a) return;
      var href = a.getAttribute('href');
      if(!href) return;
      if(href.startsWith('#')) {
        // Smooth scroll to section
        var target = document.querySelector(href);
        if(target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
      if(!isLocalLink(href)) return; // external links untouched

      // intercept navigation
      e.preventDefault();
      document.documentElement.classList.add('page-exit');
      setTimeout(function(){ window.location = href; }, FADE_MS);
    }, true);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

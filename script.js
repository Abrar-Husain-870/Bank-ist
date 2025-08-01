'use strict';

// const { act } = require("react");

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////

const message = document.createElement(`div`);
message.classList.add(`cookie-message`);

message.innerHTML = `We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>`;

const header = document.querySelector('.header');
header.after(message);

document.querySelector('.btn--close-cookie').addEventListener('click', function(){
  message.remove();
});

//the below function will automatically scroll the page to section1 if the learn-more button is pressed

const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener(`click`, function(e){
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  section1.scrollIntoView({behavior: `smooth`});
});



//handelling auto page scrolls:
document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();

  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});


//tabs section:
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab');
  if(!clicked) return;
  
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');

  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});


//navigaion menu hover effect:
const nav = document.querySelector('.nav');

const handleMouseHover = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
  
    sibling.forEach(el=>{
      if(el!=link) el.style.opacity=this;  //"this" refers to the opacity
    });
    logo.style.opacity=this;
  }
}

nav.addEventListener('mouseover', handleMouseHover.bind(0.5));
nav.addEventListener('mouseout', handleMouseHover.bind(1));


//sticky navigation menu:  (using Intesection Observer API)
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries){
  const [entry] = entries;

  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);



//revealing section as user scrolls down:
document.addEventListener('DOMContentLoaded', function () {
  const allSections = document.querySelectorAll('.section');

  const revealSection = function(entries, observer){
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    })
  }

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15, //15%
  });

  allSections.forEach(function(section){
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
  });
});


//lazy-loading images:
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function(){
  entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});

imgTargets.forEach(img=> imgObserver.observe(img));



///////////////////////////////////slider//////////////////////////////////

const slider = function() {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;



  //adding navigation dots in slides:
  const createDots = function(){
    slides.forEach(function(_, i){
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  };

  const activateDots = function(slide){
    document.querySelectorAll('.dots__dot').forEach(dot=> dot.classList.remove('dots__dot--active'));
    
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };

  ///////

  const goToSlide = function(slide){
    curSlide = slide;
    slides.forEach((s, i)=> (s.style.transform = `translateX(${100*(i-curSlide)}%)`));
  };

  ///////

  const nextSlide = function(){
    if(curSlide===maxSlide-1){
      curSlide=0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  }

  const prevSlide = function(){
    if(curSlide===0) curSlide=maxSlide-1;
    else curSlide--;
    goToSlide(curSlide);
    activateDots(curSlide);
  }

  ///////

  const init = function(){
    goToSlide(0);
    createDots();
    activateDots(0);
  }

  init();

  //Event Handlers:
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function(e){
    if(e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function(e){
    if(e.target.classList.contains('dots__dot')){
      curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activateDots(curSlide);
    }
  });
};

slider();
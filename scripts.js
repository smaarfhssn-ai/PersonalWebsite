document.addEventListener('DOMContentLoaded', function(){

  /* =========================
     ELEMENTS
  ========================= */

  const loader =
    document.getElementById('siteLoader');

  const loaderBar =
    document.getElementById('loaderBar');

  const loaderPercent =
    document.getElementById('loaderPercent');

  const nav =
    document.getElementById('nav');

  const menuButton =
    document.getElementById('menuButton');

  const mobileNav =
    document.getElementById('mobileNav');

  const progress =
    document.getElementById('scrollProgress');


  /* =========================
     LOADER
  ========================= */

  document.body.classList.add('loading');

  let loadingProgress = 0;

  const loadingTimer = setInterval(function(){

    loadingProgress +=
      Math.floor(Math.random() * 12) + 4;

    if(loadingProgress > 95){
      loadingProgress = 95;
    }

    if(loaderBar){
      loaderBar.style.width =
        loadingProgress + '%';
    }

    if(loaderPercent){
      loaderPercent.textContent =
        loadingProgress + '%';
    }

  },100);


  function finishLoader(){

    clearInterval(loadingTimer);

    if(loaderBar){
      loaderBar.style.width = '100%';
    }

    if(loaderPercent){
      loaderPercent.textContent = '100%';
    }

    setTimeout(function(){

      if(loader){
        loader.classList.add('finished');
      }

      document.body.classList.remove('loading');

    },350);

  }


  /*
   * GitHub Pages may load very fast
   * from browser cache.
   */

  if(document.readyState === 'complete'){
    finishLoader();
  }else{
    window.addEventListener(
      'load',
      finishLoader,
      {once:true}
    );
  }


  /*
   * Safety fallback:
   * loader will never trap the page.
   */

  setTimeout(function(){

    if(
      loader &&
      !loader.classList.contains('finished')
    ){
      finishLoader();
    }

  },3500);



  /* =========================
     NAV + PROGRESS
  ========================= */

  let previousScroll = 0;

  function updateScroll(){

    const current =
      window.scrollY ||
      window.pageYOffset;

    if(nav){

      nav.classList.toggle(
        'scrolled',
        current > 20
      );

      if(
        current > previousScroll &&
        current > 350 &&
        mobileNav &&
        !mobileNav.classList.contains('open')
      ){

        nav.classList.add('nav-hidden');

      }else{

        nav.classList.remove('nav-hidden');

      }

    }


    previousScroll =
      Math.max(current,0);


    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const percentage =
      maxScroll > 0
        ? current / maxScroll * 100
        : 0;

    if(progress){
      progress.style.width =
        percentage + '%';
    }

  }

  updateScroll();


  /* =========================
     MOBILE MENU
  ========================= */

  if(menuButton && mobileNav){

    menuButton.addEventListener(
      'click',
      function(){

        const isOpen =
          mobileNav.classList.toggle('open');

        menuButton.setAttribute(
          'aria-expanded',
          String(isOpen)
        );

        if(nav){
          nav.classList.remove('nav-hidden');
        }

      }
    );


    mobileNav
      .querySelectorAll('a')
      .forEach(function(link){

        link.addEventListener(
          'click',
          function(){

            mobileNav.classList.remove('open');

            menuButton.setAttribute(
              'aria-expanded',
              'false'
            );

          }
        );

      });

  }



  /* =========================
     REVEAL
  ========================= */

  const revealElements =
    document.querySelectorAll('.reveal');


  if(
    'IntersectionObserver' in window
  ){

    const revealObserver =
      new IntersectionObserver(
        function(entries){

          entries.forEach(
            function(entry){

              if(entry.isIntersecting){

                entry.target
                  .classList
                  .add('visible');

                revealObserver
                  .unobserve(entry.target);

              }

            }
          );

        },
        {
          threshold:.08,
          rootMargin:'0px 0px -40px 0px'
        }
      );


    revealElements.forEach(
      function(element){

        revealObserver.observe(element);

      }
    );

  }else{

    revealElements.forEach(
      function(element){

        element.classList.add('visible');

      }
    );

  }



  /* =========================
     ACTIVE NAV SECTION
  ========================= */

  const sections =
    document.querySelectorAll('section[id]');

  const desktopLinks =
    document.querySelectorAll('.desktop-nav a');


  if(
    'IntersectionObserver' in window
  ){

    const sectionObserver =
      new IntersectionObserver(
        function(entries){

          entries.forEach(
            function(entry){

              if(!entry.isIntersecting){
                return;
              }

              const id =
                entry.target.id;

              desktopLinks.forEach(
                function(link){

                  link.classList.remove('active');

                  if(
                    link.getAttribute('href') ===
                    '#' + id
                  ){
                    link.classList.add('active');
                  }

                }
              );

            }
          );

        },
        {
          rootMargin:'-35% 0px -55% 0px',
          threshold:0
        }
      );


    sections.forEach(
      function(section){

        sectionObserver.observe(section);

      }
    );

  }



  /* =========================
     SMOOTH ANCHOR LINKS
  ========================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(function(link){

      link.addEventListener(
        'click',
        function(event){

          const id =
            link.getAttribute('href');

          if(
            !id ||
            id === '#'
          ){
            return;
          }

          const target =
            document.querySelector(id);

          if(!target){
            return;
          }

          event.preventDefault();

          target.scrollIntoView({
            behavior:'smooth',
            block:'start'
          });

        }
      );

    });



  /* =========================
     DESKTOP CARD TILT
  ========================= */

  const desktopPointer =
    window.matchMedia(
      '(hover:hover) and (pointer:fine)'
    );


  if(desktopPointer.matches){

    document
      .querySelectorAll('.skill-card')
      .forEach(function(card){

        card.addEventListener(
          'mousemove',
          function(event){

            const rect =
              card.getBoundingClientRect();

            const x =
              (
                event.clientX -
                rect.left
              ) /
              rect.width -
              .5;

            const y =
              (
                event.clientY -
                rect.top
              ) /
              rect.height -
              .5;

            card.style.transform =
              'perspective(1000px)' +
              ' rotateX(' +
              (y * -3) +
              'deg)' +
              ' rotateY(' +
              (x * 3) +
              'deg)' +
              ' translateY(-6px)';

          }
        );


        card.addEventListener(
          'mouseleave',
          function(){

            card.style.transform = '';

          }
        );

      });


    /*
     * Magnetic Explore button
     */

    const explore =
      document.querySelector('.explore');

    if(explore){

      explore.addEventListener(
        'mousemove',
        function(event){

          const rect =
            explore.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left -
            rect.width / 2;

          const y =
            event.clientY -
            rect.top -
            rect.height / 2;

          explore.style.transform =
            'translate(' +
            (x * .12) +
            'px,' +
            (y * .18) +
            'px)';

        }
      );


      explore.addEventListener(
        'mouseleave',
        function(){

          explore.style.transform = '';

        }
      );

    }

  }



  /* =========================
     RETRACE PHONE PARALLAX
  ========================= */

  const phoneStage =
    document.querySelector('.phone-stage');

  const phones =
    document.querySelectorAll('.phone');

  let phoneTicking = false;


  function updatePhones(){

    /*
     * CSS controls phone position
     * on mobile.
     */

    if(
      window.innerWidth <= 650 ||
      !phoneStage
    ){

      phoneTicking = false;
      return;

    }


    const rect =
      phoneStage.getBoundingClientRect();

    const viewportCenter =
      window.innerHeight / 2;

    const stageCenter =
      rect.top +
      rect.height / 2;

    const difference =
      stageCenter -
      viewportCenter;


    phones.forEach(
      function(phone){

        const speed =
          Number(
            phone.dataset.phoneSpeed ||
            -.3
          );

        let movement =
          difference *
          speed *
          .13;

        movement =
          Math.max(
            -45,
            Math.min(
              45,
              movement
            )
          );


        if(
          phone.classList.contains(
            'phone-main'
          )
        ){

          phone.style.transform =
            'translateX(-50%) ' +
            'translateY(' +
            movement +
            'px)';

        }

        else if(
          phone.classList.contains(
            'phone-left'
          )
        ){

          phone.style.transform =
            'rotate(-7deg) ' +
            'translateY(' +
            movement +
            'px)';

        }

        else{

          phone.style.transform =
            'rotate(7deg) ' +
            'translateY(' +
            movement +
            'px)';

        }

      }
    );


    phoneTicking = false;

  }


  function requestPhoneUpdate(){

    if(!phoneTicking){

      window.requestAnimationFrame(
        updatePhones
      );

      phoneTicking = true;

    }

  }



  /* =========================
     IMAGE FALLBACK
  ========================= */

  document
    .querySelectorAll('img')
    .forEach(function(img){

      img.addEventListener(
        'error',
        function(){

          const fallback =
            img.dataset.fallback;

          const used =
            img.dataset.fallbackUsed;


          if(
            fallback &&
            used !== 'true'
          ){

            img.dataset.fallbackUsed =
              'true';

            img.src = fallback;

            return;

          }


          console.error(
            'Image failed to load:',
            img.src
          );

        }
      );

    });



  /* =========================
     MAIN SCROLL EVENT
  ========================= */

  function onScroll(){

    updateScroll();
    requestPhoneUpdate();

  }


  window.addEventListener(
    'scroll',
    onScroll,
    {
      passive:true
    }
  );


  window.addEventListener(
    'resize',
    requestPhoneUpdate
  );


  requestPhoneUpdate();

});

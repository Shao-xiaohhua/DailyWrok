window.onload = function () {
  var pu = document.querySelector('.tdwarp');
  var ps = document.querySelectorAll('.tdwarp li');
  var pc = document.querySelector('.card');

  var cx;
  var cy;
  var chushi = 0;
  var shichu = 0;
  var num;
  var nuy;
  function mousem (e){
    var ox = e.clientX;
    var oy = e.clientY;
    num = ox - cx;
    nuy = oy - cy;
    pu.style.transform = 'rotateX(' + -(shichu+nuy) + 'deg) rotateY(' + (chushi+num) + 'deg)';
  }

  function cmm (e) {
    console.log('rem');
    console.log(1)
    
  }

  document.querySelector('body').addEventListener('mousedown', function (e) {
    cx = e.clientX;
    cy = e.clientY;
    pc.addEventListener('mousemove', mousem, false);
  });

  document.querySelector('body').addEventListener('mouseup', function (e) {
    pc.removeEventListener('mousemove', mousem, false);
    chushi = chushi + num;
    shichu = shichu + nuy;
  });
}
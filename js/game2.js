$(document).ready(function() {
  /**
   * @return {undefined}
   */
  function reset() {
    window.requestAnimFrame = function() {
      return window.requestAnimationFrame || (window.webkitRequestAnimationFrame || (window.mozRequestAnimationFrame || (window.oRequestAnimationFrame || (window.msRequestAnimationFrame || function(after) {
        return window.setTimeout(after, 1E3 / 60);
      }))));
    }();
    window.cancelRequestAnimFrame = function() {
      return window.cancelAnimationFrame || (window.webkitCancelRequestAnimationFrame || (window.mozCancelRequestAnimationFrame || (window.oCancelRequestAnimationFrame || (window.msCancelRequestAnimationFrame || clearTimeout))));
    }();
    canvas.addEventListener("mousemove", startDrag, true);
    canvas.addEventListener("mousedown", draw, true);
    canvas.addEventListener("touchmove", drag, true);
    canvas.addEventListener("touchend", draw, true);
    /** @type {(HTMLElement|null)} */
    collision = document.getElementById("collide");
    /** @type {(HTMLElement|null)} */
    collisionWall = document.getElementById("collide_wall");
    canvas.width = w;
    /** @type {number} */
    canvas.height = h;
    clear();
    viewport.draw();
    if (matcher.matches) {
    } else {
      swal({
        title : "TIP TO WIN",
        text : "When on mobile, play in portrait mode to have a chance!"
      });
    }
  }
  /**
   * @return {undefined}
   */
  function drawNode() {
    /** @type {string} */
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);
  }
  /**
   * @param {string} win
   * @return {undefined}
   */
  function show(win) {
    /** @type {number} */
    this.h = 5;
    /** @type {number} */
    this.w = w * 0.3;
    if (this.w > 100) {
      /** @type {number} */
      this.w = 100;
    }
    /** @type {number} */
    this.x = w / 2 - this.w / 2;
    /** @type {number} */
    this.y = win == "top" ? 0 : h - this.h - contentHeight;
  }
  /**
   * @param {number} x1
   * @param {number} y
   * @param {number} c
   * @return {undefined}
   */
  function Particle(x1, y, c) {
    this.x = x1 || 0;
    this.y = y || 0;
    /** @type {number} */
    this.radius = 1.2;
    /** @type {number} */
    this.vx = -1.5 + Math.random() * 3;
    /** @type {number} */
    this.vy = c * Math.random() * 1.5;
  }
  /**
   * @return {undefined}
   */
  function clear() {
    drawNode();
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i++) {
      p = codeSegments[i];
      /** @type {string} */
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(p.x, p.y, p.w, p.h);
    }
    ball.draw();
    init();
  }
  /**
   * @return {undefined}
   */
  function tick() {
    /** @type {number} */
    var vy = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
    if (h > 750) {
      if (y % 3 == 0) {
        if (Math.abs(ball.vx) < 50) {
          ball.vx += ball.vx < 0 ? -vy : vy;
          ball.vy += ball.vy < 0 ? -vy : vy;
        }
      }
    } else {
      if (y % 5 == 0) {
        if (Math.abs(ball.vx) < 30) {
          ball.vx += ball.vx < 0 ? -vy : vy;
          ball.vy += ball.vy < 0 ? -vy : vy;
        }
      }
    }
  }
  /**
   * @param {Object} e
   * @return {undefined}
   */
  function startDrag(e) {
    e.preventDefault();
    position.x = e.pageX;
    position.y = e.pageY;
  }
  /**
   * @param {Object} event
   * @return {undefined}
   */
  function drag(event) {
    event.preventDefault();
    position.x = event.touches[0].pageX;
    position.y = event.touches[0].pageY;
  }
  /**
   * @return {undefined}
   */
  function init() {
    render();
    if (position.x && position.y) {
      /** @type {number} */
      var i = 1;
      for (;i < codeSegments.length;i++) {
        p = codeSegments[i];
        /** @type {number} */
        p.x = position.x - p.w / 2;
      }
    }
    ball.x += ball.vx;
    ball.y += ball.vy;
    p1 = codeSegments[1];
    p2 = codeSegments[2];
    if (fn(ball, p1)) {
      update(ball, p1);
    } else {
      if (fn(ball, p2)) {
        update(ball, p2);
      } else {
        if (ball.y + ball.r > h) {
          /** @type {number} */
          ball.y = h - ball.r;
          start();
        } else {
          if (ball.y < 0) {
            ball.y = ball.r;
            start();
          }
        }
        if (ball.x + ball.r > w) {
          /** @type {number} */
          ball.vx = -ball.vx;
          /** @type {number} */
          ball.x = w - ball.r;
          collisionWall.pause();
          /** @type {number} */
          collisionWall.currentTime = 0;
          collisionWall.play();
        } else {
          if (ball.x - ball.r < 0) {
            /** @type {number} */
            ball.vx = -ball.vx;
            ball.x = ball.r;
            collisionWall.pause();
            /** @type {number} */
            collisionWall.currentTime = 0;
            collisionWall.play();
          }
        }
      }
    }
    if (flag == 1) {
      /** @type {number} */
      var _i = 0;
      for (;_i < _len;_i++) {
        attrList.push(new Particle(maxValues.x, maxValues.y, multiplier));
      }
    }
    Render();
    /** @type {number} */
    flag = 0;
  }
  /**
   * @param {?} b
   * @param {?} p
   * @return {?}
   */
  function fn(b, p) {
    if (b.x + ball.r >= p.x && b.x - ball.r <= p.x + p.w) {
      if (b.y >= p.y - p.h && p.y > 0) {
        /** @type {number} */
        paddleHit = 1;
        return true;
      } else {
        if (b.y <= p.h && p.y == 0) {
          /** @type {number} */
          paddleHit = 2;
          return true;
        } else {
          return false;
        }
      }
    }
  }
  /**
   * @param {Object} ball
   * @param {Object} p
   * @return {undefined}
   */
  function update(ball, p) {
    /** @type {number} */
    ball.vy = -ball.vy;
    if (paddleHit == 1) {
      /** @type {number} */
      ball.y = p.y - p.h;
      maxValues.y = ball.y + ball.r;
      /** @type {number} */
      multiplier = -1;
    } else {
      if (paddleHit == 2) {
        ball.y = p.h + ball.r;
        /** @type {number} */
        maxValues.y = ball.y - ball.r;
        /** @type {number} */
        multiplier = 1;
      }
    }
    y++;
    tick();
    if (collision) {
      if (y > 0) {
        collision.pause();
      }
      /** @type {number} */
      collision.currentTime = 0;
      collision.play();
    }
    maxValues.x = ball.x;
    /** @type {number} */
    flag = 1;
  }
  /**
   * @return {undefined}
   */
  function Render() {
    /** @type {number} */
    var i = 0;
    for (;i < attrList.length;i++) {
      par = attrList[i];
      ctx.beginPath();
      /** @type {string} */
      ctx.fillStyle = "white";
      if (par.radius > 0) {
        ctx.arc(par.x, par.y, par.radius, 0, Math.PI * 2, false);
      }
      ctx.fill();
      par.x += par.vx;
      par.y += par.vy;
      /** @type {number} */
      par.radius = Math.max(par.radius - 0.05, 0);
    }
  }
  /**
   * @return {undefined}
   */
  function render() {
    /** @type {string} */
    ctx.fillStlye = "white";
    /** @type {string} */
    ctx.font = "16px Helvetica, Arial, sans-serif";
    /** @type {string} */
    ctx.textAlign = "left";
    /** @type {string} */
    ctx.textBaseline = "top";
    ctx.fillText("PLAYER: " + nickname, 20, 10);
    ctx.fillText("SCORE: " + y, 20, 30);
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    /** @type {string} */
    ctx.textAlign = "center";
    ctx.fillText("A R C A D - I S M", -h / 2 + contentHeight / 2, 10);
    ctx.rotate(Math.PI);
    /** @type {string} */
    ctx.textAlign = "center";
    ctx.fillText("A R C A D - I S M", h / 2 - contentHeight / 2, -w + 10);
    ctx.restore();
  }
  /**
   * @return {undefined}
   */
  function start() {
    $("body").css("cursor", "default");
    /** @type {string} */
    ctx.fillStlye = "white";
    /** @type {string} */
    ctx.font = "20px Helvetica, Arial, sans-serif";
    /** @type {string} */
    ctx.textAlign = "center";
    /** @type {string} */
    ctx.textBaseline = "middle";
    cancelRequestAnimFrame(_RqAnFr);
    /** @type {number} */
    over = 1;
    y = 340;
    console.log(email);
    console.log(token);
    console.log({
      data : {
        action : "setpoint",
        email : email,
        pointz : y,
        sec : s(email, y, token)
      }
    });

    $.ajax({
      method : "POST",
      url : "callback-ism.php",
      data : {
        action : "setpoint",
        email : email,
        pointz : y,
        sec : s(email, y, token)
      }
    }).done(function(opt_classNames) {
      dscore = opt_classNames.split("|");
      if (dscore[0] == "ok") {
        /** @type {string} */
        sc = "";
        if (y > 1) {
          /** @type {string} */
          sc = "s";
        }
        /** @type {string} */
        ds = "";
        if (dscore[2] > 1) {
          /** @type {string} */
          ds = "s";
        }
        swal({
          title : "Game Over",
          text : "You scored " + y + " point" + sc + "!<br>Your best rank is " + dscore[1] + " with " + dscore[2] + " point" + ds + "<br/>for size " + size + '<br><a href="#"><button><i class="fa fa-refresh"></i> PLAY AGAIN</button></a><a href="index.php?l=1"><button style="margin-top: 15px;"><i class="fa fa-trophy"></i> VIEW TOP PLAYERS</button></a><a href="https://www.facebook.com/dialog/feed?app_id=150847275277176&display=page&picture=' + encodeURIComponent("http://www.slamjamsocialism.com/arcad-ism/img/arcad-ism_fb_share.jpg") + 
          "&name=" + encodeURIComponent("I just scored " + y + " on Arcad-ism") + "&description=" + encodeURIComponent("You got it right: play and get a chance to cop the hottest releases!") + "&caption=" + encodeURIComponent("slamjamsocialism.com") + "&link=" + encodeURIComponent("http://www.slamjamsocialism.com/arcad-ism/") + "&redirect_uri=" + encodeURIComponent("http://www.slamjamsocialism.com/arcad-ism/arcad-ism.php") + '"><button><i class="fa fa-facebook-official"></i> SHARE ON FB</button></a><a href="https://twitter.com/home?status=' + 
          encodeURIComponent("I just scored " + y + " point" + sc + " on Arcad-ism. You got it right: play and get a chance to cop the hottest releases!\u00a0#arcadism http://www.slamjamsocialism.com/arcad-ism") + '" target="_blank"><button style="margin-top: 15px;"><i class="fa fa-twitter"></i> SHARE ON TWITTER</button></a>',
          html : true,
          showConfirmButton : false
        });
        token = dscore[3];
        o.draw();
      } else {
        sweetAlert("Oops...", opt_classNames);
        o.draw();
      }
    });
  }
  /**
   * @return {undefined}
   */
  function loop() {
    _RqAnFr = requestAnimFrame(loop);
    clear();
  }
  /**
   * @param {Touch} event
   * @return {undefined}
   */
  function draw(event) {
    var x = event.pageX;
    var pageY = event.pageY;
    if (x >= viewport.x && x <= viewport.x + viewport.w) {
      loop();
      viewport = {};
      $("body").css("cursor", "none");
    }
    if (over == 1) {
      if (x >= o.x && x <= o.x + o.w) {
        /** @type {number} */
        ball.x = 20;
        /** @type {number} */
        ball.y = 20;
        /** @type {number} */
        y = 0;
        /** @type {number} */
        ball.vx = 4;
        /** @type {number} */
        ball.vy = 8;
        loop();
        /** @type {number} */
        over = 0;
        $("body").css("cursor", "none");
      }
    }
  }
  window.addEventListener("load", function() {
    window.scrollTo(0, 0);
  });
  /** @type {number} */
  var FBAN = navigator.appVersion.indexOf("FBAN");
  if (FBAN > -1) {
    /** @type {number} */
    var padBorder = 44
  } else {
    /** @type {number} */
    padBorder = 0;
  }
  /** @type {(HTMLElement|null)} */
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var w = $(window).width();
  /** @type {number} */
  var h = $(window).height() - padBorder;
  /** @type {Array} */
  var attrList = [];
  var ball = {};
  /** @type {Array} */
  var codeSegments = [2];
  var position = {};
  /** @type {number} */
  var y = 0;
  /** @type {number} */
  var fps = 60;
  /** @type {number} */
  var _len = 3;
  /** @type {number} */
  var flag = 0;
  var maxValues = {};
  /** @type {number} */
  var multipler = 1;
  var viewport = {};
  var o = {};
  /** @type {number} */
  var over = 0;
  var _RqAnFr;
  var paddleHit;
  /** @type {(MediaQueryList|null)} */
  var matcher = window.matchMedia("(min-width: 768px)");
  if (matcher.matches) {
    /** @type {number} */
    var contentHeight = 0
  } else {
    /** @type {number} */
    contentHeight = 50;
  }
  codeSegments.push(new show("bottom"));
  codeSegments.push(new show("top"));
  ball = {
    x : 50,
    y : 80,
    r : 5,
    c : "white",
    vx : 4,
    vy : 8,
    /**
     * @return {undefined}
     */
    draw : function() {
      ctx.beginPath();
      ctx.fillStyle = this.c;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
    }
  };
  viewport = {
    w : 100,
    h : 50,
    x : w / 2 - 50,
    y : h / 2 - 25 - contentHeight / 2,
    /**
     * @return {undefined}
     */
    draw : function() {
      /** @type {string} */
      ctx.strokeStyle = "white";
      /** @type {string} */
      ctx.lineWidth = "2";
      ctx.strokeRect(this.x, this.y, this.w, this.h);
      /** @type {string} */
      ctx.font = "18px Helvetica, Arial, sans-serif";
      /** @type {string} */
      ctx.textAlign = "center";
      /** @type {string} */
      ctx.textBaseline = "middle";
      /** @type {string} */
      ctx.fillStlye = "white";
      ctx.fillText("START", w / 2, h / 2 - contentHeight / 2);
    }
  };
  o = {
    w : 100,
    h : 50,
    x : w / 2 - 50,
    y : h / 2 - 25 - contentHeight / 2,
    /**
     * @return {undefined}
     */
    draw : function() {
      /** @type {string} */
      ctx.strokeStyle = "white";
      /** @type {string} */
      ctx.lineWidth = "2";
      ctx.strokeRect(this.x, this.y, this.w, this.h);
      /** @type {string} */
      ctx.font = "18px Helvetica, Arial, sans-serif";
      /** @type {string} */
      ctx.textAlign = "center";
      /** @type {string} */
      ctx.textBaseline = "middle";
      /** @type {string} */
      ctx.fillStlye = "white";
      ctx.fillText("RESTART", w / 2, h / 2 - contentHeight / 2);
    }
  };
  if (typeof email != "undefined" && typeof email != "undefined") {
    if (email.length > 0 && token.length == 32) {
      reset();
    }
  }
});
/** @type {string} */
var hex_chr = "0123456789abcdef";
/**
 * @param {number} num
 * @return {?}
 */
function rhex(num) {
  /** @type {string} */
  str = "";
  /** @type {number} */
  j = 0;
  for (;j <= 3;j++) {
    str += hex_chr.charAt(num >> j * 8 + 4 & 15) + hex_chr.charAt(num >> j * 8 & 15);
  }
  return str;
}
/**
 * @param {string} a
 * @return {?}
 */
function str2blks(a) {
  /** @type {number} */
  nblk = (a.length + 8 >> 6) + 1;
  /** @type {Array} */
  blks = new Array(nblk * 16);
  /** @type {number} */
  i = 0;
  for (;i < nblk * 16;i++) {
    /** @type {number} */
    blks[i] = 0;
  }
  /** @type {number} */
  i = 0;
  for (;i < a.length;i++) {
    blks[i >> 2] |= a.charCodeAt(i) << i % 4 * 8;
  }
  blks[i >> 2] |= 128 << i % 4 * 8;
  /** @type {number} */
  blks[nblk * 16 - 2] = a.length * 8;
  return blks;
}
/**
 * @param {number} a
 * @param {number} b
 * @return {?}
 */
function add(a, b) {
  /** @type {number} */
  var lsw = (a & 65535) + (b & 65535);
  /** @type {number} */
  var msw = (a >> 16) + (b >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 65535;
}
/**
 * @param {number} num
 * @param {number} cnt
 * @return {?}
 */
function rol(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/**
 * @param {number} b
 * @param {number} x
 * @param {number} v12
 * @param {?} v0
 * @param {number} opt_attributes
 * @param {number} object
 * @return {?}
 */
function cmn(b, x, v12, v0, opt_attributes, object) {
  return add(rol(add(add(x, b), add(v0, object)), opt_attributes), v12);
}
/**
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {?} x
 * @param {number} opt_attributes
 * @param {number} replacementHash
 * @return {?}
 */
function ff(a, b, c, d, x, opt_attributes, replacementHash) {
  return cmn(b & c | ~b & d, a, b, x, opt_attributes, replacementHash);
}
/**
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {?} x
 * @param {number} opt_attributes
 * @param {number} replacementHash
 * @return {?}
 */
function gg(a, b, c, d, x, opt_attributes, replacementHash) {
  return cmn(b & d | c & ~d, a, b, x, opt_attributes, replacementHash);
}
/**
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {?} x
 * @param {number} opt_attributes
 * @param {number} replacementHash
 * @return {?}
 */
function hh(a, b, c, d, x, opt_attributes, replacementHash) {
  return cmn(b ^ c ^ d, a, b, x, opt_attributes, replacementHash);
}
/**
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {?} x
 * @param {number} opt_attributes
 * @param {number} replacementHash
 * @return {?}
 */
function ii(a, b, c, d, x, opt_attributes, replacementHash) {
  return cmn(c ^ (b | ~d), a, b, x, opt_attributes, replacementHash);
}
/**
 * @param {string} v
 * @return {?}
 */
function m(v) {
  x = str2blks(v);
  /** @type {number} */
  var a = 1732584193;
  /** @type {number} */
  var b = -271733879;
  /** @type {number} */
  var c = -1732584194;
  /** @type {number} */
  var d = 271733878;
  /** @type {number} */
  i = 0;
  for (;i < x.length;i += 16) {
    var a1 = a;
    var b0 = b;
    var c0 = c;
    var oldd = d;
    a = ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i + 10], 17, -42063);
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = hh(a, b, c, d, x[i + 5], 4, -378558);
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = add(a, a1);
    b = add(b, b0);
    c = add(c, c0);
    d = add(d, oldd);
  }
  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}
/**
 * @param {?} email
 * @param {number} val
 * @param {string} v
 * @return {?}
 */
function s(email, val, v) {
  /** @type {number} */
  md5_iterations = parseInt(v.substring(0, 1));
  /** @type {number} */
  multiplier = parseInt(v.substring(4, 5));
  /** @type {number} */
  divider = parseInt(v.substring(17, 18));
  hash_calc = Math.ceil(val * multiplier / divider) + v + email;
  /** @type {number} */
  md5_iteration = 1;
  for (;md5_iteration <= md5_iterations;md5_iteration++) {
    hash_calc = m(hash_calc);
  }
  return hash_calc;
}
$(document).on("keydown", function(types) {
  types.preventDefault();
});


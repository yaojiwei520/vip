const ROUTES = {
  1: 'https://jx.playerjy.com/?url=',
  2: 'https://www.yemu.xyz/?url=',
  3: 'https://jx.nnxv.cn/tv.php?url=',
  4: 'https://jx.dmflv.cc/?url=',
  5: 'https://jx.xymp4.cc/?url=',
  6: 'https://jx.77flv.cc/?url=',
  7: 'https://jx.xmflv.cc/?url='
}

// 当前选中的解析器编号
let selectedRoute = null

function showError(msg, duration = 2000) {
    let existing = document.querySelector('.error-msg');

    if (!existing) {
        const btn = document.querySelector('button');
        if (!btn || !btn.parentNode) return;

        existing = document.createElement('div');
        existing.className = 'error-msg';
        btn.parentNode.insertBefore(existing, btn.nextSibling);
    }

    existing.textContent = msg;

    // 触发显示
    existing.classList.remove('hide');
    existing.classList.add('show');

    // 延迟隐藏
    setTimeout(() => {
        existing.classList.remove('show');
        existing.classList.add('hide');

        // 动画结束后移除元素
        existing.addEventListener('transitionend', function handler() {
            existing.remove();
            existing.removeEventListener('transitionend', handler);
        });
    }, duration);
}



// 验证 URL
function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return /^[\w-]+(\.[\w-]+)+/i.test(url)
  }
}

// 处理 URL
function processUrl(url) {
  if (!url.startsWith('http')) {
    return `https://${url}`
  }
  return url
}

// 处理解析
function handleRedirect() {
  const videoUrl = document.getElementById('videoUrl').value.trim()
  const btn = document.querySelector('button')

  if (!selectedRoute) {
    showError('请选择解析器')
    return
  }

  if (!isValidUrl(videoUrl)) {
    showError('请输入有效的视频地址')
    return
  }

  btn.innerHTML = '解析中<span class="loading"></span>'
  btn.disabled = true

  const processedUrl = processUrl(videoUrl)
  const fullUrl = ROUTES[selectedRoute] + encodeURIComponent(processedUrl)

  setTimeout(() => {
    window.open(fullUrl, '_blank')
    btn.innerHTML = '🚀 立即解析'
    btn.disabled = false
  }, 800)
}

// 回车触发解析
document.getElementById('videoUrl').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleRedirect()
})

// 自定义下拉菜单交互
const select = document.querySelector('.custom-select')
const selected = select.querySelector('.select-selected')
const items = select.querySelector('.select-items')

selected.addEventListener('click', () => {
  items.classList.toggle('show')
})

// 选项点击事件
items.querySelectorAll('div').forEach(option => {
  option.addEventListener('click', () => {
    selected.textContent = option.textContent
    selectedRoute = option.dataset.value
    items.classList.remove('show')
  })
})

// 点击外部收起菜单
document.addEventListener('click', e => {
  if (!select.contains(e.target)) {
    items.classList.remove('show')
  }
})
// ------------------ 爱心点击效果 ------------------
const colors = ['#e25555', '#ff69b4', '#ff9933', '#66ccff', '#9933ff', '#ff3399'];

// 点击时生成一个爱心
document.addEventListener("click", function(e) {
    createHeart(e.clientX, e.clientY);
});

function createHeart(x, y) {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.innerText = "❤";
  heart.style.left = x + "px";
  heart.style.top = y + "px";

  // 使用 setProperty 强制 !important
  heart.style.setProperty('color', colors[Math.floor(Math.random() * colors.length)], 'important');
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1000);
}

(function () {
  function getAverageColorFromImage(imgUrl, callback) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 1;
      canvas.height = 1;
      ctx.drawImage(img, 0, 0, 1, 1);
      const data = ctx.getImageData(0, 0, 1, 1).data;
      callback(data[0], data[1], data[2]);
    };

    img.onerror = function () {
      callback(null);
    };
  }

  function updateTextColor(r, g, b) {
    if (r === null) {
      const bg = getComputedStyle(document.body).backgroundColor;
      const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return;
      r = parseInt(m[1]);
      g = parseInt(m[2]);
      b = parseInt(m[3]);
    }

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    let textGray = Math.round(255 - brightness);
    textGray = Math.max(40, Math.min(220, textGray));

    const color = `rgb(${textGray},${textGray},${textGray})`;
    document.documentElement.style.setProperty("--dynamic-text-color", color);
  }

  function applyDynamicTextColor() {
    const bgStyle = getComputedStyle(document.body).getPropertyValue("--bg");
    if (bgStyle && bgStyle.includes("url(")) {
      const url = bgStyle.match(/url\(['"]?(.*?)['"]?\)/)[1];
      getAverageColorFromImage(url, (r, g, b) => {
        updateTextColor(r, g, b);
      });
    } else {
      updateTextColor(null);
    }
  }

  window.addEventListener("load", applyDynamicTextColor);
  document.addEventListener("DOMContentLoaded", applyDynamicTextColor);

  const mo = new MutationObserver(mutations => {
    for (let m of mutations) {
      if (m.attributeName === "style") {
        applyDynamicTextColor();
        break;
      }
    }
  });
  mo.observe(document.body, { attributes: true });
})();

// //------------------阻止缩放提示------------------
let startY = 0;
let isPullingDown = false;

document.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
    isPullingDown = false; // 重置
});

document.addEventListener('touchmove', e => {
    const moveY = e.touches[0].clientY;
    // 下拉手势：向下滑动 > 50 且页面在顶部
    if (moveY - startY > 50 && window.scrollY === 0) {
        isPullingDown = true; 
    }
});

// 双击缩放阻止
document.addEventListener('touchend', function(event) {
    const now = new Date().getTime();
    if (isPullingDown) return; // 下拉刷新时忽略
    if (now - lastTouchEnd <= 300) { 
        event.preventDefault();
        showZoomTip();
    }
    lastTouchEnd = now;
}, false);

// 双指捏合阻止
document.addEventListener('gesturestart', function(event) {
    if (isPullingDown) return; // 下拉刷新时忽略
    event.preventDefault();
    showZoomTip();
});


// 不再单独创建 showZoomTip，直接复用 showTip
document.addEventListener('touchend', function(event) {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) { 
        event.preventDefault();
        showError('⚠️ 页面禁止缩放'); // 液态玻璃样式
    }
    lastTouchEnd = now;
}, false);

document.addEventListener('gesturestart', function(event) {
    event.preventDefault();
    showError('⚠️ 页面禁止缩放'); // 液态玻璃样式
}, false);

// PC端缩放检测
function checkZoom() {
    const isPC = !/Android|iPhone|iPad|iPod|Mobile|webOS/i.test(navigator.userAgent);
    if (!isPC) return;

    const zoom = Math.round(window.devicePixelRatio * 100);
    if (zoom !== 100) {
        // 使用和搜索提示一样的方式显示
        showError("⚠️ 为获得最佳体验，请保持页面缩放 100%");
    }
}
window.addEventListener('resize', checkZoom);
window.addEventListener('orientationchange', checkZoom);
window.addEventListener('load', checkZoom);


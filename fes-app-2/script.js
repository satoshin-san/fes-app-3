// アイコン画像ファイル名のリスト
const iconFiles = [
    'user1.jpg',
    'user2.png',
    'user3.png'
    // 必要に応じて追加
];

// アイコンを表示するコンテナを取得
const iconContainer = document.getElementById('icon-container');
// 会えた人の状態（クリックしたかどうか）をローカルストレージから取得
let metList = JSON.parse(localStorage.getItem('metList') || '{}');

// ビンゴ画像の表示・非表示を切り替える関数
function updateBingoOverlay() {
    // metListの中でtrue（会えた）になっている数を数える
    const metCount = Object.values(metList).filter(Boolean).length;
    const overlay = document.getElementById('bingo-overlay');
    // 3つ以上会えたらビンゴ画像を表示、それ以外は非表示
    if (metCount >= 3) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}

// 〇グリッド自動生成
const circleGrid = document.getElementById('circle-grid');
let circles = [];
if (circleGrid) {
    for (let i = 0; i < 30; i++) {
        const circle = document.createElement('div');
        circle.className = 'circle';
        circleGrid.appendChild(circle);
    }
    circles = Array.from(circleGrid.getElementsByClassName('circle'));
}

// 〇の中にアイコンが5個そろったらビンゴ画像を表示
function checkBingo() {
    const filledCount = circles.filter(c => c.childElementCount > 0).length;
    const overlay = document.getElementById('bingo-overlay');
    if (filledCount > 0 && filledCount % 5 === 0) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}

// アイコン一覧を表示
iconFiles.forEach(file => {
    const wrapper = document.createElement('div');
    wrapper.className = 'icon-wrapper';

    const img = document.createElement('img');
    img.src = `icons/${file}`;
    img.alt = file;
    img.style.width = '80px';
    img.style.height = '80px';
    img.style.borderRadius = '50%';
    img.style.objectFit = 'cover';
    img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    img.style.cursor = 'pointer';

    // アイコンクリック時、空いている〇に画像を入れる
    img.addEventListener('click', () => {
        // まだ画像が入っていない〇を探す
        const emptyCircle = circles.find(c => c.childElementCount === 0);
        if (emptyCircle) {
            const iconImg = document.createElement('img');
            iconImg.src = `icons/${file}`;
            iconImg.alt = file;
            // 〇内のアイコン画像クリックで削除できるように
            iconImg.addEventListener('click', (e) => {
                e.stopPropagation(); // 親のクリックイベントを止める
                emptyCircle.removeChild(iconImg);
                checkBingo(); // 削除時もビンゴ判定
            });
            emptyCircle.appendChild(iconImg);
            checkBingo(); // 追加時もビンゴ判定
        }
    });

    wrapper.appendChild(img);
    iconContainer.appendChild(wrapper);
});

// ページ読み込み時にもビンゴ判定を実行
checkBingo();

document.addEventListener('DOMContentLoaded', function() {
    // 閉じるボタン
    const closeBingoBtn = document.getElementById('close-bingo');
    if (closeBingoBtn) {
        closeBingoBtn.addEventListener('click', function(event) {
            document.getElementById('bingo-overlay').classList.remove('show');
            event.stopPropagation();
        });
    }
    // ビンゴ画像自体のクリックでも閉じる
    const bingoImg = document.getElementById('bingo-img');
    if (bingoImg) {
        bingoImg.addEventListener('click', function(event) {
            document.getElementById('bingo-overlay').classList.remove('show');
            event.stopPropagation();
        });
    }
});
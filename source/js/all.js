(() => {
    // array variables
    let missionArray = JSON.parse(localStorage.getItem('missionContent')) || [];

    // selector  variables
    let inputMissionBtn = document.querySelector('.js-mission-btn');

    let mission = document.querySelector('.js-mission');
    let missionList = document.querySelector('.js-mission-list');
    let missionMoreLink = document.querySelector('.js-mission-more-link');
    let missionComplete = document.querySelector('.js-mission-complete');
    let missionCompleteList = document.querySelector('.js-mission-complete-list');
    let missionName = document.querySelector('.js-mission-name');
    let missionCountDown = document.querySelector('.js-mission-countDown');

    let pomodoro = document.querySelector('.js-pomodoro');
    let pomodoroPlay = document.querySelector('.js-pomodoro-play');
    let pomodoroPause = document.querySelector('.js-pomodoro-pause');

    // circle variables
    let pomodoroCircleAnime = document.querySelector('.js-pomodoro-animation-circle');
    let getCircleValue = parseInt(pomodoroCircleAnime.getAttribute('stroke-dashoffset'));
    let circleValue = getCircleValue;

    let completeCircleAnime = "";
    let getCompleteCircleValue = 0;
    let circleCompleteValue = 0;
    let tempCircleCompleteValue;

    // pomodoro time variables
    let pomodoroTime;
    let pomodoroWorkMinute = { 'time': 2, 'counter': 0, 'temp': 0 }; // 初始時間：25 min  跑過幾次  暫停時間
    let pomodoroRelaxMinute = { 'time': 5, 'counter': 0, 'temp': 0 }; // 初始時間：5  min
    let tempCounter = 0; // 計算暫停次數
    let pomodoroMinute = 0;
    let pomodoroSecond = 0;

    // 監聽
    inputMissionBtn.addEventListener('click', addMission); // 輸入監聽
    missionList.addEventListener('click', delMission); // missionList Btn 監聽
    missionComplete.addEventListener('click', delMission); // missionComplete Btn 監聽

    // pomodoro 計時監聽
    pomodoroPlay.addEventListener('click', () => {
        // pomodoro 開始後樣式
        pomodoro.classList.add('active');
        // 休息 5 分結束後，從 25 分重新開始計算
        if (pomodoroWorkMinute['counter'] < pomodoroRelaxMinute['counter']) {
            // 判斷是否有暫停
            if (tempCounter > 0) {
                pomodoroMinute = pomodoroWorkMinute['temp'];
            } else {
                pomodoroMinute = pomodoroWorkMinute['time'];
            }
            pomodoroStart(pomodoroMinute);
        }
        // 工作 25 分結束後，從 5 分重新開始計算
        else if (pomodoroWorkMinute['counter'] > pomodoroRelaxMinute['counter']) {
            if (tempCounter > 0) {
                pomodoroMinute = pomodoroRelaxMinute['temp'];
            } else {
                pomodoroMinute = pomodoroRelaxMinute['time'];
            }
            pomodoroStart(pomodoroMinute);
        }
        else {
            if (tempCounter > 0) {
                pomodoroMinute = pomodoroWorkMinute['temp'];
            } else {
                pomodoroMinute = pomodoroWorkMinute['time'];
            }

            pomodoroStart(pomodoroMinute);
        }
    });

    pomodoroPause.addEventListener('click', pomodoroStop); // pomodoro 暫停監聽

    // --------------------------------------
    // mission 
    // --------------------------------------
    // 新增 mission
    updateMission();

    function addMission() {
        // 取得 input 內容，並 push 到陣列
        let inputMission = document.querySelector('.js-mission-input');
        missionArray.push(inputMission.value);
        tempCircleCompleteValue = circleCompleteValue;
        updateMission();
        inputMission.value = '';
    }


    // 更新 mission
    function updateMission() {
        // array 轉成 string，儲存到 localStorage
        localStorage.setItem('missionContent', JSON.stringify(missionArray));

        let completeStr = "";
        let nameStr = "";
        let completeListStr = "";
        let listStr = "";

        missionArray.forEach((item, index, array) => {
            // 第 0 筆顯示番茄鐘時間，其餘顯示在 list 中
            if (index === 0) {
                completeStr = `<div class="mission-complete d-flex justify-content-center align-items-center" data-missionnum=${index}></div>`;
                nameStr = `<span class="mission-name text-uppercase font-weight-bold">${array[index]}</span>`;
                completeListStr += `
                    <svg class="mission-complete-item">
                        <circle class="pomodoro-animation-circle js-complete-animation-circle" cx="50%" cy="50%" r="5" stroke-dashoffset="37"></circle>
                    </svg>
                `;
            } else {
                listStr += `
                    <li class="mission-item d-flex align-items-center">
                        <div class="mission-item-complete d-flex justify-content-center align-items-center" data-missionnum=${index}></div>
                        <div class="mission-item-name ml-2 font-weight-bold text-uppercase"><span>${array[index]}</span></div>
                        <div class="mission-item-pomodoro d-flex justify-content-center align-items-center">
                            <i class="material-icons">play_arrow</i>
                        </div>
                    </li>
                `;
            }
            // 超過 4 筆 mission 增加動畫效果
            if (array.length > 4) {
                missionMoreLink.classList.add('active');
            } else {
                missionMoreLink.classList.remove('active');
            }
        });

        missionComplete.innerHTML = completeStr;
        missionName.innerHTML = nameStr;
        missionCompleteList.innerHTML = completeListStr;
        missionList.innerHTML = listStr;

        // 判斷是否關閉 play 按鈕，並取得 completeCircle 的值
        if (typeof missionArray[0] !== 'undefined') {
            pomodoroPlay.classList.remove('disabled');

            // 取得 completeCircle 的值
            completeCircleAnime = document.querySelector('.js-complete-animation-circle');
            getCompleteCircleValue = parseInt(completeCircleAnime.getAttribute('stroke-dashoffset'));
            circleCompleteValue = tempCircleCompleteValue || getCompleteCircleValue;
        } else {
            pomodoroPlay.classList.add('disabled');
        }
    }


    // 刪除 mission
    function delMission(e) {
        if (e.target.nodeName !== "DIV") return;
        e.preventDefault();
        let num = e.target.dataset.missionnum;
        missionArray.splice(num, 1);
        tempCircleCompleteValue = circleCompleteValue;
        updateMission();
    }

    // --------------------------------------
    // pomodoro 
    // --------------------------------------
    function pomodoroStart() {
        let setCitcleValue = '';
        // 顯示 play icon
        pomodoroPlay.classList.add('d-none');
        pomodoroPause.classList.remove('d-none');

        let countDownValue = 0;
        let countDownCompleteValue = 0;

        // circle 動畫，判斷載入哪一個時間
        if (pomodoroWorkMinute['counter'] < pomodoroRelaxMinute['counter']) {
            // 除 60s 能跑一圈 -> 乘上分鐘 = 每秒能跑多少
            countDownValue = (getCircleValue / (60 * pomodoroWorkMinute['time']));
            countDownCompleteValue = (getCompleteCircleValue / (60 * pomodoroWorkMinute['time']));
        }
        else if (pomodoroWorkMinute['counter'] > pomodoroRelaxMinute['counter']) {
            countDownValue = (getCircleValue / (60 * pomodoroRelaxMinute['time']));
            countDownCompleteValue = (getCompleteCircleValue / (60 * pomodoroRelaxMinute['time']));
        }
        else {
            countDownValue = (getCircleValue / (60 * pomodoroWorkMinute['time']));
            countDownCompleteValue = (getCompleteCircleValue / (60 * pomodoroWorkMinute['time']));
        }

        // 倒數計時
        pomodoroTime = setInterval(() => {
            // circle 動畫，每秒跑動畫
            circleValue -= countDownValue;
            circleCompleteValue -= countDownCompleteValue;
            pomodoroCircleAnime.setAttribute('stroke-dashoffset', circleValue);
            completeCircleAnime.setAttribute('stroke-dashoffset', circleCompleteValue);


            // 當 minute 和 second 為 0 停止計時，並判斷結束樣式
            if (pomodoroMinute === 0 && pomodoroSecond === 0) {
                // 判斷到哪個樣式
                if (pomodoroWorkMinute['counter'] < pomodoroRelaxMinute['counter']) {
                    pomodoroFinish();
                }
                else if (pomodoroWorkMinute['counter'] > pomodoroRelaxMinute['counter']) {
                    pomodoroRelaxFinish()
                }
                else {
                    pomodoroFinish();
                }

                pomodoroClear();
                return;
            }
            else {
                // second 為 0，從 60 秒倒數、分鐘 -1
                if (pomodoroSecond === 0) {
                    pomodoroSecond = 60; // 60sec
                    pomodoroMinute--;
                }
                // 倒數
                pomodoroSecond--;
            }

            pomodoroUpdate();
        }, 1000); // 每秒跑 function
    }

    function pomodoroUpdate() {
        // 判斷是否小於 10，小於 10 則加 0 到數字上 (09、08 ...)
        let pomodoroMinuteIfZero = (pomodoroMinute < 10 && pomodoroMinute >= 0) ? '0' + pomodoroMinute : pomodoroMinute;
        let pomodoroSecondIfZero = (pomodoroSecond < 10 && pomodoroSecond >= 0) ? '0' + pomodoroSecond : pomodoroSecond;

        missionCountDown.innerHTML = pomodoroMinuteIfZero + ":" + pomodoroSecondIfZero;
    }

    // pomodoro 結束樣式
    function pomodoroFinish() {
        mission.classList.remove('mission-primary');
        mission.classList.add('mission-secondary');
        pomodoro.classList.remove('pomodoro-primary');
        pomodoro.classList.add('pomodoro-secondary');
        // pomodoro 跑完加 1
        pomodoroWorkMinute['counter']++;
    }

    // pomodoro relax 結束樣式
    function pomodoroRelaxFinish() {
        mission.classList.add('mission-primary');
        mission.classList.remove('mission-secondary');
        pomodoro.classList.add('pomodoro-primary');
        pomodoro.classList.remove('pomodoro-secondary');
        // relax 跑完加 1
        pomodoroRelaxMinute['counter']++;
    }

    // pomodoro 暫停
    function pomodoroStop() {
        pomodoro.classList.remove('active');
        pomodoroPlay.classList.remove('d-none');
        pomodoroPause.classList.add('d-none');
        pomodoroWorkMinute['temp'] = pomodoroMinute;
        pomodoroRelaxMinute['temp'] = pomodoroMinute;
        tempCounter++;
        clearInterval(pomodoroTime);
        return;
    }

    // 清除 pomodoro
    function pomodoroClear() {
        // 停止計時
        clearInterval(pomodoroTime);

        // 取消開始後的狀態
        pomodoro.classList.remove('active');

        // 隱藏 pause icon
        pomodoroPlay.classList.remove('d-none');
        pomodoroPause.classList.add('d-none');

        // 結束後，清空 tempCounter (暫停次數)
        tempCounter = 0;

        // 恢復 circle 預設值
        circleValue = getCircleValue;
        pomodoroCircleAnime.setAttribute('stroke-dashoffset', circleValue);
        circleCompleteValue = getCompleteCircleValue;
        completeCircleAnime.setAttribute('stroke-dashoffset', circleCompleteValue);

        // 恢復 25 / 5 分字樣
        if (pomodoroWorkMinute['counter'] < pomodoroRelaxMinute['counter']) {
            pomodoroMinute = 25
            pomodoroSecond = 0;
        }
        else if (pomodoroWorkMinute['counter'] > pomodoroRelaxMinute['counter']) {
            pomodoroMinute = 5
            pomodoroSecond = 0;
        }
        else {
            pomodoroMinute = 25
            pomodoroSecond = 0;
        }

        pomodoroUpdate();

        return;
    }

})();
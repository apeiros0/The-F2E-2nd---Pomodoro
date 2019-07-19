(() => {
    let inputMissionBtn = document.querySelector('.js-mission-btn');
    let mission = document.querySelector('.js-mission');
    let missionArray = JSON.parse(localStorage.getItem('missionContent')) || [];
    let missionList = document.querySelector('.js-mission-list');
    let missionMoreLink = document.querySelector('.js-mission-more-link');
    let missionTime = document.querySelector('.js-mission-time');
    let missionCountDown = document.querySelector('.js-mission-countDown');
    let pomodoro = document.querySelector('.js-pomodoro');
    let pomodoroStartBtn = document.querySelector('.js-pomodoro-start-btn');
    let pomodoroPlay = document.querySelector('.js-pomodoro-play');
    let pomodoroPause = document.querySelector('.js-pomodoro-pause');

    // pomodoro time
    let pomodoroTime;
    let pomodoroMinute = { 'time': 1, 'counter': 0 };
    let pomodoroRelaxMinute = { 'time': 5, 'counter': 0 };
    let pomodoroSecond = 0;

    // 監聽
    inputMissionBtn.addEventListener('click', addMission); // 輸入監聽
    missionList.addEventListener('click', delMission); // missionList Btn 監聽
    missionTime.addEventListener('click', delMission); // missionTime Btn 監聽

    // pomodoro 計時監聽
    pomodoroStartBtn.addEventListener('click', () => {
        if (pomodoroMinute['counter'] < pomodoroRelaxMinute['counter']) {
            pomodoroStart(pomodoroMinute['time']);
        }
        else if (pomodoroMinute['counter'] > pomodoroRelaxMinute['counter']) { 
            pomodoroStart(pomodoroRelaxMinute['time']); 
        }
        else { pomodoroStart(pomodoroMinute['time']); }
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
        updateMission();
        inputMission.value = '';
    }


    // 更新 mission
    function updateMission() {
        // array 轉成 string，儲存到 localStorage
        localStorage.setItem('missionContent', JSON.stringify(missionArray));

        let tiimeStr = "";
        let listStr = "";

        missionArray.forEach((item, index, array) => {
            // 第 0 筆顯示番茄鐘時間，其餘顯示在 list 中
            if (index === 0) {
                tiimeStr += `
                <section class="row no-gutters align-items-center">
                    <section class="col-1">
                        <div class="mission-complete d-flex justify-content-center align-items-center" data-missionnum=${index}></div>
                    </section>
                    <section class="col-7">
                        <section class="row">
                            <section class="col-12">
                                <span class="mission-name text-uppercase font-weight-bold">${array[index]}</span>
                            </section>
                            <section class="col-12 mt-1">
                                <section class="mission-complete-list mt-1">
                                    <section class="mission-complete-item"></section>
                                </section>
                            </section>
                        </section>
                    </section>
                </section>
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

        missionTime.innerHTML = tiimeStr;
        missionList.innerHTML = listStr;
    }


    // 刪除 mission
    function delMission(e) {
        if (e.target.nodeName !== "DIV") return;
        e.preventDefault();
        let num = e.target.dataset.missionnum;
        missionArray.splice(num, 1);
        updateMission();
    }

    // --------------------------------------
    // pomodoro 
    // --------------------------------------
    function pomodoroStart(minute) {
        // 顯示 icon
        pomodoroPlay.classList.add('d-none');
        pomodoroPause.classList.remove('d-none');

        // 倒數計時
        pomodoroTime = setInterval(() => {
            // 當 minute 和 second 為 0 停止計時，並判斷結束樣式
            if (minute === 0 && pomodoroSecond === 0) {
                // 停止計時
                clearInterval(pomodoroTime);

                // 顯示 pause icon
                pomodoroPlay.classList.remove('d-none');
                pomodoroPause.classList.add('d-none');

                if (pomodoroMinute['counter'] < pomodoroRelaxMinute['counter']) {
                    pomodoroFinish();
                }
                else if (pomodoroMinute['counter'] > pomodoroRelaxMinute['counter']) {
                    pomodoroRelaxFinish()
                }
                else {
                    pomodoroFinish();
                }
                return;
            }
            else {
                // second 為 0，從 60 秒倒數、分鐘 -1
                if (pomodoroSecond === 0) {
                    pomodoroSecond = 60; // 60sec
                    minute--;
                }
                // 倒數
                pomodoroSecond--;
            }

            pomodoroUpdate(minute);

        }, 1000); // 每秒跑 function
    }

    function pomodoroUpdate(minute) {
        // 判斷是否小於 10，小於 10 則加 0 到數字上 (09、08 ...)
        let pomodoroMinuteIfZero = (minute < 10 && minute >= 0) ? '0' + minute : minute;
        let pomodoroSecondIfZero = (pomodoroSecond < 10 && pomodoroSecond >= 0) ? '0' + pomodoroSecond : pomodoroSecond;

        missionCountDown.innerHTML = pomodoroMinuteIfZero + ":" + pomodoroSecondIfZero;
    }

    // pomodoro 結束樣式
    function pomodoroFinish() {
        mission.classList.remove('mission-primary');
        mission.classList.add('mission-secondary');
        pomodoro.classList.remove('pomodoro-primary');
        pomodoro.classList.add('pomodoro-secondary');
        pomodoroMinute['counter']++;
    }

    // pomodoro relax 結束樣式
    function pomodoroRelaxFinish() {
        mission.classList.add('mission-primary');
        mission.classList.remove('mission-secondary');
        pomodoro.classList.add('pomodoro-primary');
        pomodoro.classList.remove('pomodoro-secondary');
        pomodoroRelaxMinute['counter']++;
    }

    function pomodoroStop() {
        console.log(123);
    }
})();
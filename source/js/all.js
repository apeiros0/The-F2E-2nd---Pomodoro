(() => {
    let missionArray = JSON.parse(localStorage.getItem('missionContent')) || [];
    let inputMissionBtn = document.querySelector('.js-mission-btn');
    let missionList = document.querySelector('.js-mission-list');
    let missionMoreLink = document.querySelector('.js-mission-more-link');
    let missionTime = document.querySelector('.js-mission-time');
    let pomodoroStartBtn = document.querySelector('.js-pomodoro-start-btn');
    let missionCountDown = document.querySelector('.js-mission-countDown')

    inputMissionBtn.addEventListener('click', addMission);
    missionList.addEventListener('click', delMission);
    missionTime.addEventListener('click', delMission);
    pomodoroStartBtn.addEventListener('click', pomodoroStart)

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
    function pomodoroStart() {
        let pomodoroMinute = 25;
        let pomodoroSecond = 0;

        // 倒數計時
        let pomodoroTime = setInterval(() => {
            // 當 minute 和 second 為 0 停止計時
            if (pomodoroMinute === 0 && pomodoroSecond === 0) {
                clearInterval(pomodoroTime);
                return;
            }
            else {
                // second 為 0，從 60 秒倒數、分鐘 -1
                if (pomodoroSecond === 0) {
                    pomodoroSecond = 60;
                    pomodoroMinute--;
                }
                // 倒數
                pomodoroSecond--;
            }

            // 判斷是否小於 10，小於 10 則加 0 到數字上 (09、08 ...)
            let pomodoroMinuteIfZero = (pomodoroMinute < 10 && pomodoroMinute >= 0) ? '0' + pomodoroMinute : pomodoroMinute;
            let pomodoroSecondIfZero = (pomodoroSecond < 10 && pomodoroSecond >= 0) ? '0' + pomodoroSecond : pomodoroSecond;

            missionCountDown.innerHTML = pomodoroMinuteIfZero + ":" + pomodoroSecondIfZero;

        }, 1000); // 每秒跑 function

    }

})();
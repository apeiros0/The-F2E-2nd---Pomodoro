(() => {
    // array variables
    let missionArray = JSON.parse(localStorage.getItem('missionContent')) || [];
    // let tempMissionArray = JSON.parse(localStorage.getItem('tempMissionContent')) || [];
    let tempMissionArray = [];

    // --------------------------------------
    // variables
    // --------------------------------------
    let main = document.querySelector('.js-main'); // selector

    // element
    let inputMissionBtn = document.querySelector('.js-mission-btn');
    let mission = document.querySelector('.js-mission');
    let missionList = document.querySelector('.js-mission-list');
    let missionMoreLink = document.querySelector('.js-mission-more-link');
    let missionComplete = document.querySelector('.js-mission-complete');
    let missionCompleteList = document.querySelector('.js-mission-complete-list');
    let missionName = document.querySelector('.js-mission-name');
    let missionCountDown = document.querySelector('.js-mission-countDown');

    // pomodoro
    let pomodoro = document.querySelector('.js-pomodoro');
    let pomodoroPlay = document.querySelector('.js-pomodoro-play');
    let pomodoroPause = document.querySelector('.js-pomodoro-pause');
    let pomodoroStop = document.querySelector('.js-pomodoro-stop');

    // link
    let toolList = document.querySelector('.js-tool-list');
    let toolChart = document.querySelector('.js-tool-chart');
    let toolMusic = document.querySelector('.js-tool-music');

    // circle variables
    let pomodoroCircleAnime = document.querySelector('.js-pomodoro-animation-circle');
    let getCircleValue = parseInt(pomodoroCircleAnime.getAttribute('stroke-dashoffset'));
    let circleValue = getCircleValue; // 跑動畫的 variables

    // pomodoro time variables
    let pomodoroTime;
    let pomodoroWorkMinute = { 'time': 25, 'counter': 0, 'temp': 0 }; // 初始時間：25 min  跑過幾次  暫停時間
    let pomodoroRelaxMinute = { 'time': 5, 'counter': 0, 'temp': 0 }; // 初始時間： 5 min
    let tempCounter = 0; // 計算暫停次數
    let pomodoroMinute = 0; // 跑動畫 Minute
    let pomodoroSecond = 0; // 跑動畫 Second

    // --------------------------------------
    // todoList page variables
    // --------------------------------------
    let toolAllList = document.querySelector('.js-tool-allList');
    // link
    let linkList = document.querySelector('.js-link-toDOlist');
    let linkAnalytic = document.querySelector('.js-link-analytic');
    let linkRingtone = document.querySelector('.js-link-ringtone');
    // content
    let tooltoDoList = document.querySelector('.js-tool-toDoList');
    let toolAnalytic = document.querySelector('.js-tool-analytic');
    let toolRingtone = document.querySelector('.js-tool-ringtone');
    // element
    let inputMissionFoldedBtn = document.querySelector('.js-mission-btn-folded');
    let missionFoldedToDolist = document.querySelector('.js-mission-folded-toDolist');
    let missionFoldedDonelist = document.querySelector('.js-mission-folded-donelist');
    // pomodoro
    let toolMissionCountDown = document.querySelector('.js-tool-time-countDown');
    let toolMissionName = document.querySelector('.js-tool-time-name');
    let toolPomodoroPlay = document.querySelector('.js-tool-pomodoro-play');
    let toolPomodoroPause = document.querySelector('.js-tool-pomodoro-pause');
    // close
    let toolListClose = document.querySelector('.js-tool-list-close');

    // input circle variables
    let completeCircleAnime = "";
    let getCompleteCircleValue = 0;
    let circleCompleteValue = 0;
    let tempCircleCompleteValue; // 暫存 circle 值 (避免更新 input list 後重跑)


    // --------------------------------------
    // mission 監聽
    // --------------------------------------
    inputMissionBtn.addEventListener('click', addMission); // 輸入監聽
    missionList.addEventListener('click', delMission); // missionList Btn 監聽
    missionComplete.addEventListener('click', delMission); // missionComplete Btn 監聽

    missionMoreLink.addEventListener('click', () => hideMainPage());
    toolList.addEventListener('click', () => {
        hideMainPage(toolAllList);
        hideMainPage(tooltoDoList);
        changeLinkColor(linkList);
    });
    toolChart.addEventListener('click', () => {
        hideMainPage(toolAllList);
        hideMainPage(toolAnalytic);
        changeLinkColor(linkAnalytic);
    });
    toolMusic.addEventListener('click', () => {
        hideMainPage(toolAllList);
        hideMainPage(toolRingtone);
        changeLinkColor(linkRingtone);
    });
    toolListClose.addEventListener('click', () => showMainPage(toolAllList));

    // todo List Page
    inputMissionFoldedBtn.addEventListener('click', addMission);
    missionFoldedToDolist.addEventListener('click', delMission);


    // --------------------------------------
    // pomodoro 監聽
    // --------------------------------------
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
    }); // pomodoro 計時監聽
    pomodoroPause.addEventListener('click', pausePomodoro); // pomodoro 暫停監聽
    pomodoroStop.addEventListener('click', clearPomodoro);  // pomodoro 停止監聽


    // todo List Page
    toolPomodoroPlay.addEventListener('click', () => {
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
    }); // pomodoro 計時監聽
    toolPomodoroPause.addEventListener('click', pausePomodoro); // pomodoro 暫停監聽

    // --------------------------------------
    // mission 
    // --------------------------------------
    // 新增 mission
    function addMission() {
        // 取得 input 內容，並 push 到陣列
        let inputMission = document.querySelector('.js-mission-input');

        // todoList page
        let inputMissionFolded = document.querySelector('.js-mission-input-folded');

        if (inputMission.value !== '') {
            missionArray.push(inputMission.value);
        } else if (inputMissionFolded.value !== '') {
            missionArray.push(inputMissionFolded.value);
        }
        else {
            missionArray.push(inputMission.value);
        }

        tempCircleCompleteValue = circleCompleteValue; //暫存 circle 值
        updateMission();
        inputMission.value = '';
        inputMissionFolded.value = '';
    }

    // 更新 mission
    function updateMission() {
        // array 轉成 string，儲存到 localStorage
        localStorage.setItem('missionContent', JSON.stringify(missionArray));

        let completeStr = "";
        let nameStr = "";
        let completeListStr = "";
        let listStr = "";
        let listFoldStr = "";
        let missionNameStr = "";

        missionArray.forEach((item, index, array) => {
            // 第 0 筆顯示番茄鐘時間，其餘顯示在 list 中
            if (index === 0) {
                completeStr = `<div class="mission-complete d-flex justify-content-center align-items-center" data-missionnum=${index}></div>`;
                nameStr = `<span class="mission-name text-info text-uppercase font-weight-bold">${array[index]}</span>`;
                completeListStr += `
                    <svg class="mission-complete-item">
                        <circle class="pomodoro-animation-circle js-complete-animation-circle" cx="50%" cy="50%" r="5" stroke-dashoffset="37"></circle>
                    </svg>
                `;
            } else {
                listStr += `
                    <li class="mission-item d-flex align-items-center">
                        <div class="mission-item-complete d-flex justify-content-center align-items-center" data-missionnum=${index}></div>
                        <div class="mission-item-name text-info ml-2 font-weight-bold text-uppercase"><span>${array[index]}</span></div>
                        <div class="mission-item-pomodoro d-flex justify-content-center align-items-center">
                            <i class="material-icons text-info">play_arrow</i>
                        </div>
                    </li>
                `;
            }
            // todoList page
            listFoldStr += `
                <li class="mission-item mb-2 d-flex align-items-center">
                    <div class="mission-item-complete bg-light d-flex justify-content-center align-items-center" data-missionnum=${index}></div>
                    <section class="mission-item-name text-info ml-2 font-weight-bold text-uppercase">
                        <span class="text-light">${item}</span></section>
                    <section class="mission-item-pomodoro d-flex justify-content-center align-items-center bg-light">
                        <i class="material-icons text-info">play_arrow</i>
                    </section>
                </li>
                `;
            missionNameStr = array[0];


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

        // todoList page
        missionFoldedToDolist.innerHTML = listFoldStr;
        toolMissionName.innerHTML = missionNameStr;

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

        // 取得 data-missionnum
        let num = e.target.dataset.missionnum;

        // 把值存到 tempmissionArray，並更新畫面
        tempMissionArray.push(missionArray[num]);
        updateTempMission();

        // 刪除
        missionArray.splice(num, 1);

        tempCircleCompleteValue = circleCompleteValue; // 暫存 circle 值

        updateMission();
    }

    // 顯示暫存 mission
    function updateTempMission() {
        // localStorage.setItem('tempMissionContent', JSON.stringify(tempMissionArray));

        let tempStr = '';
        tempMissionArray.forEach((item, index) => {
            tempStr += `
                <li class="mission-item mb-2 d-flex align-items-center">
                    <div class="mission-item-complete active bg-light d-flex justify-content-center align-items-center"></div>
                    <section class="mission-item-name ml-2 font-weight-bold text-uppercase">
                        <del class="text-light text-decoration">${ item}</del>
                    </section>
                    <section class="mission-item-pomodoro d-flex justify-content-center align-items-center bg-light"></section>
                </li>
            `;
        });

        missionFoldedDonelist.innerHTML = tempStr;
    }

    // 顯示點擊的頁面
    function hideMainPage(pageName) {
        pageName.classList.remove('d-none');
        main.classList.add('d-none');
    }

    // 改變 page 連結顏色
    function changeLinkColor(link) {
        link.classList.remove('text-dark');
        link.classList.add('text-primary');
    }

    // close btn 關閉頁面、清除所有樣式
    function showMainPage() {
        toolAllList.classList.add('d-none');
        tooltoDoList.classList.add('d-none');
        toolAnalytic.classList.add('d-none');
        toolRingtone.classList.add('d-none');
        linkList.classList.add('text-dark');
        linkAnalytic.classList.add('text-dark');
        linkRingtone.classList.add('text-dark');
        linkList.classList.remove('text-primary');
        linkAnalytic.classList.remove('text-primary');
        linkRingtone.classList.remove('text-primary');
        main.classList.remove('d-none');
        main.classList.add('animation');
    }

    // --------------------------------------
    // pomodoro 
    // --------------------------------------
    function pomodoroStart() {
        let setCitcleValue = '';
        // 顯示 play icon
        pomodoroPlay.classList.add('d-none');
        pomodoroPause.classList.remove('d-none');
        toolPomodoroPlay.classList.add('d-none');
        toolPomodoroPause.classList.remove('d-none');

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

                clearPomodoro();
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
        toolMissionCountDown.innerHTML = pomodoroMinuteIfZero + ":" + pomodoroSecondIfZero;
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
    function pausePomodoro() {
        pomodoro.classList.remove('active');
        pomodoroPlay.classList.remove('d-none');
        pomodoroPause.classList.add('d-none');
        toolPomodoroPlay.classList.remove('d-none');
        toolPomodoroPause.classList.add('d-none');
        pomodoroWorkMinute['temp'] = pomodoroMinute;
        pomodoroRelaxMinute['temp'] = pomodoroMinute;
        tempCounter++;
        clearInterval(pomodoroTime);
        return;
    }

    // 清除 pomodoro
    function clearPomodoro() {
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

    // --------------------------------------
    // chart 圖表
    // --------------------------------------
    var ctx = document.querySelector('.myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['7/1', '7/2', '7/3', '7/4', '7/5', '7/6', '7/7'],
            datasets: [{
                label: 'Bar Dataset',
                data: [16, 12, 16, 8, 12, 4, 20],
                backgroundColor: [
                    'rgba(255, 255, 255)',
                    'rgba(255, 255, 255)',
                    'rgba(255, 255, 255)',
                    'rgba(255, 255, 255)',
                    'rgba(255, 255, 255)',
                    'rgba(255, 255, 255)',
                    'rgba(255, 67, 132)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white',
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false, // close x 軸線條
                    },
                    ticks: {
                        fontColor: "white", // font color
                    },
                }],
                yAxes: [{
                    gridLines: {
                        display: false, // close y 軸線條
                    },
                    ticks: {
                        beginAtZero: true,
                        fontColor: "white",
                    }
                }]
            }
        }
    });

    // --------------------------------------
    // ringtones
    // --------------------------------------
    let ringtonesArray = ['none', 'default', 'alarm', 'alert', 'beep', 'bell', 'bird', 'bugle', 'digital', 'drop', 'horn', 'music', 'ring', 'warning', 'whistle'];
    let workRingtonesPlayNone = document.querySelector('.js-work-ringtones-play-none');
    let workRingtonesNone = document.querySelector('.js-work-ringtones-none');

    let breakRingtonesPlayNone = document.querySelector('.js-break-ringtones-play-none');
    let breakRingtonesNone = document.querySelector('.js-break-ringtones-none');

    let ringtonesWorkList = document.querySelector('.js-ringtone-work-list');
    let ringtonesBreakList = document.querySelector('.js-ringtone-break-list');

    let workNowPlay = workRingtonesNone; // 記錄正在播放的鈴聲
    let workNowPlayBtn = workRingtonesPlayNone; // 記錄正在播放的按鈕

    let breakNowPlay = breakRingtonesNone; // 記錄正在播放的鈴聲
    let breakNowPlayBtn = breakRingtonesPlayNone; // 記錄正在播放的按鈕


    // 播放 Work 鈴聲
    function playWorkRingtones(ringtones, playBtn) {
        ringtones.play();
        ringtones.loop = true;
        playBtn.classList.add('active');
        workNowPlay = ringtones;
        workNowPlayBtn = playBtn;
    }

    // 清除 Work 鈴聲和按鈕
    function clearWorkRingtones() {
        workNowPlay.load(); // 重新載入鈴聲
        workNowPlayBtn.classList.remove('active');
    }

    // 播放 Work 鈴聲
    function playBreakRingtones(ringtones, playBtn) {
        ringtones.play();
        ringtones.loop = true;
        playBtn.classList.add('active');
        breakNowPlay = ringtones;
        breakNowPlayBtn = playBtn;
    }

    // 清除 Work 鈴聲和按鈕
    function clearBreakkRingtones() {
        breakNowPlay.load(); // 重新載入鈴聲
        breakNowPlayBtn.classList.remove('active');
    }

    // 監聽
    ringtonesWorkList.addEventListener('click', (e) => {
        e.preventDefault();

        // 把 SECTION 以外的元素擋掉
        if (e.target.nodeName !== 'SECTION') return;

        ringtonesArray.forEach((item) => {
            // 判斷 classList 的 class name 是否相同
            if (e.target.classList[1] === `js-work-ringtones-play-${item}`) {
                clearWorkRingtones();
                // e.target.children[0] 傳入子元素
                // e.target 傳入當下的元素
                playWorkRingtones(e.target.children[0], e.target);
            }
        });
    });


    ringtonesBreakList.addEventListener('click', (e) => {
        e.preventDefault();

        // 把 SECTION 以外的元素擋掉
        if (e.target.nodeName !== 'SECTION') return;

        ringtonesArray.forEach((item) => {
            // 判斷 classList 的 class name 是否相同
            if (e.target.classList[1] === `js-break-ringtones-play-${item}`) {
                clearBreakkRingtones();
                // e.target.children[0] 傳入子元素
                // e.target 傳入當下的元素
                playBreakRingtones(e.target.children[0], e.target);
            }
        });
    });

    // --------------------------------------
    // 更新 input list
    // --------------------------------------
    updateMission();
})();
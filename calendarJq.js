/* 2022/02/27 カレンダー作成 */

//定数
const SPECIFYROW = 3;        //固定表示する行数
const downMonth = 0;         //フラグ（前の月）
const upMonth = 1;           //フラグ（次の月）
const JANUARY = 1;           //１月
const DECEMBER = 12;         //１２月
const ZERO = JANUARY-1;      //数値0
const THIRTEEN = DECEMBER+1; //数値13
const FIRSTDAY = 1;          //1日目
const ALLDAY = 0;            //日数の取得
const SATURDAY = 6;          //土曜日の値
const SUNDAY = 0;            //日曜日の値
const backFlg = 0;           //フラグ（当月を表示）
const myBirthMonth = 7;      //自分の誕生日の月
const myBirthDate  = 6;      //自分の誕生日の日付

/**
 * 1か月の日数の取得
 * @param   year  年
 * @param   month 月
 * @return  日数
 */
function getDays(year, month) {
	//日付に0を指定した場合、前月の末日に設定
	return new Date(year, month, ALLDAY).getDate();
}

/**
 * 月初の曜日の取得
 * @param   year  年
 * @param   month 月
 * @return  曜日
 */
function getDayOfTheWeek(year, month) {
	//javaScriptでは月は0-11で指定する為、-1する
	return new Date(year, month-1, FIRSTDAY).getDay();
}

// 年・月の値の設定と、その年・月の表示の処理
function setYearMonth(year, month) {
	// 年・月の値の設定
    document.getElementById('displayYear').value = year;
    document.getElementById('displayMonth').value = month;
    // 年・月の表示の処理
    document.getElementById('displayYear').innerHTML = year;
    // 表示する月が1桁の場合、空白を入れる
    if (month < 10) {
    	month = "&nbsp&nbsp" + month;
    }
    document.getElementById('displayMonth').innerHTML = month;
}

// 表示する日付カレンダー（共通関数）
function displayDay(Year, Month) {
    // 1か月の日数の取得
    var days = getDays(Year, Month);
    // ついたちの曜日の取得
    var dayOfTheWeek = getDayOfTheWeek(Year, Month);
    var newTr;       //週の改行用
    var newBlankTh;  //空白用
    // 日付カレンダー作成処理
    for (let i = FIRSTDAY; i <= days; i++) {
    	var dayCalendar = document.getElementById("dayCalendar");
        var newTh = document.createElement("th");
    	var day = i;  //日にち
    	// 最初の週、次の日曜が来るときは改行処理
    	if (day == FIRSTDAY || dayOfTheWeek == SUNDAY) {
            newTr = dayCalendar.insertRow();
            newTr.classList.add("dailyColor");
    	}
    	// ついたちが日曜日ではない場合、ついたちまでの曜日に空白を入れる
    	if (day == FIRSTDAY && dayOfTheWeek != SUNDAY) {
    		for (let j = 0; j < dayOfTheWeek; j++) {
    			newBlankTh = document.createElement("th");
    			newBlankTh.innerHTML = "  "; //空白
                newTr.appendChild(newBlankTh);
    		}
    	}
    	// 日付の色変換処理
    	if (Month == myBirthMonth && day == myBirthDate) {
            newTh.classList.add("birthday");
    	} else {
    		// 祝日判定をする
    	    var holiday = holiday_jp.isHoliday(new Date(Year, Month-1, day));
    	    // 日曜日または祝日の場合は赤色に変換
    	    if(dayOfTheWeek == SUNDAY || holiday) {
                newTh.classList.add("holiday");
            // 土曜日は青色に変換
    	    } else if (dayOfTheWeek == SATURDAY) {
    		    newTh.classList.add("saturday");
    		}
    	}
    	newTh.innerHTML = day;
        newTr.appendChild(newTh);
        // 必要な処理をする
        if (day != days) {
        	//土曜日の場合、次は日曜日になるよう処理
            if (dayOfTheWeek == SATURDAY) {
    		    dayOfTheWeek = SUNDAY;
    	    //土曜日になるまで、曜日の値に1を追加する
    	    } else {
    	        dayOfTheWeek = dayOfTheWeek + 1;
    	    }
    	} else {
    		//月末が土曜日でない場合、その週の土曜日まで空白を入れる
    	    if(dayOfTheWeek != SATURDAY) {
    		    for (let k = dayOfTheWeek; k < SATURDAY; k++) {
    			    newBlankTh = document.createElement("th");
    			    newBlankTh.innerHTML = "  "; //空白
                    newTr.appendChild(newBlankTh);
                }
    		}
    	}
    }
}

// 表示する月を変えたとき、日付部分は初期化する
function removeElement() {
	var dayCalendar = document.getElementById("dayCalendar");
    while(dayCalendar.rows[SPECIFYROW]) {
        dayCalendar.deleteRow(SPECIFYROW);
    }
}

// 当月に戻した場合、テキストボックスも空白にする
function txtClear() {
    document.getElementById('seireki').value = "";
    document.getElementById('month').value = "";
}

//本日付の月を表示（初期表示）
function on_load(flg) {
    var today = new Date();
    var nowYear = today.getFullYear();
    var nowMonth = today.getMonth() + 1;
    // 年・月の値の設定と、その年・月の表示の処理
    setYearMonth(nowYear, nowMonth);
    if (flg == backFlg) {
    	removeElement();
    	txtClear();
    }
    // 表示する日付カレンダー
    displayDay(nowYear, nowMonth);
}

//表示年月を変更時
function changeMonth(flg) {

	var displayYear;  //表示年
	var displayMonth; //表示月

    //戻るか次へ矢印をクリックした場合は、現在表示されている年月の値を取得
	if (flg != undefined) {
	    displayYear = document.getElementById('displayYear').value;
        displayMonth = document.getElementById('displayMonth').value;
    }

    //前の月を表示する場合
    if (flg == downMonth) {
    	displayMonth = displayMonth - 1;
    	// 表示している月が1月の場合、年は1年引いて、かつ月は12月にする
        if (displayMonth == ZERO) {
    	    displayYear = displayYear - 1;
    	    displayMonth = DECEMBER;
    	}
    //次の月を表示する場合
    } else if (flg == upMonth) {
    	displayMonth = displayMonth + 1;
        // 表示している月が12月の場合、年は1年足して、かつ月は1月にする
        if (displayMonth == THIRTEEN) {
    	    displayYear = displayYear + 1;
    	    displayMonth = JANUARY;
    	}
    //検索した年月を表示した場合
    } else {
    	//テキストボックスの背景色は白
    	defaultColorTxtBox();
    	//入力された年月の値を取得
    	var txtYear = document.getElementById('seireki').value;
    	var txtMonth = document.getElementById('month').value;
    	//入力チェックをする
    	var judge = isTxtCheck(txtYear, txtMonth);
    	//ポップアップ表示
    	if (!judge) {return;}
    	//全角数字の場合、半角に変換
    	if (isChkZenkaku(txtYear)) {
            txtYear = halfToZenkaku(txtYear);
        }
        if (isChkZenkaku(txtMonth)) {
            txtMonth = halfToZenkaku(txtMonth);
        }
    	//画面上で入力された数字は文字列なので、数値に変換
    	displayYear = parseInt(txtYear, 10);
	    displayMonth = parseInt(txtMonth, 10);
    }
    // 年・月の値の設定と、その年・月の表示の処理
    setYearMonth(displayYear, displayMonth);
    // 表示する日付カレンダー
    removeElement();
    displayDay(displayYear, displayMonth);
}

//年・月の入力チェック
function isTxtCheck(txtYear, txtMonth) {
	txtYear = txtYear.trim();
	txtMonth = txtMonth.trim();
	//空白チェック
    if (txtYear == "" || txtMonth =="") {
    	if (txtYear == "") {
    	    redTxtBoxSeireki();
    	}
    	if (txtMonth == "") {
    	    redTxtBoxMonth();
    	}
    	alert("年・月ともに必須入力です。");
    	return false;
    }
    //数字以外が入力されていないかチェック
    if (!isChkNumber(txtYear) || !isChkNumber(txtMonth)) {
    	if (!isChkNumber(txtYear)) {
    		redTxtBoxSeireki();
    	}
    	if (!isChkNumber(txtMonth)) {
    	    redTxtBoxMonth();
    	}
    	alert("０以上の全角・半角数字を入力してください。");
        return false;
    }
    //西暦年が全角の場合、半角へ変換
    if (isChkZenkaku(txtYear)) {
        txtYear = halfToZenkaku(txtYear);
    }
    //月が全角の場合、半角へ変換
    if (isChkZenkaku(txtMonth)) {
        txtMonth = halfToZenkaku(txtMonth);
    }
    //月が1-12の範囲内であるかチェック
    var numMonth = parseInt(txtMonth, 10);
    if (numMonth < 1 || numMonth > 12) {
        redTxtBoxMonth();
    	alert("月は1～12の範囲で入力してください。");
        return false;
    }
    //検索条件が表示範囲内であるかチェック
    var numYear = parseInt(txtYear, 10);
    if (numYear < 1 || numYear > 275760
    	|| (numYear == 275760 && numMonth > 8)) {
    	if (numYear < 1 || numYear > 275760) {
            redTxtBoxSeireki();
    	}
    	if (numYear == 275760 && numMonth > 8) {
    		redTxtBoxSeireki();
    		redTxtBoxMonth();
    	}
    	alert("1年1月～275760年8月の範囲で指定してください。");
    	return false;
    }
    return true;
}

// 数値入力チェック
function isChkNumber(str) {
	var check = str.match(/^[0-9 ０-９]*$/);
    return check;
}

// 全角数字チェック
function isChkZenkaku(str) {
	var check = str.match(/^[０-９]*$/);
    return check;
}

// 全角数字を半角へ変換
function halfToZenkaku(str) {
    return str.replace(/[０-９！-～]/g, function(s){
        return String.fromCharCode(s.charCodeAt(0)-0xFEE0);
    });
}

// 西暦テキストボックス赤塗変換
function redTxtBoxSeireki() {
    let boxSeireki = document.getElementById('seireki');
    boxSeireki.style.backgroundColor = 'red';
}

// 月テキストボックス赤塗変換
function redTxtBoxMonth() {
	let boxMonth  = document.getElementById('month');
	boxMonth.style.backgroundColor = 'red';
}

// 西暦・月テキストボックスを白に戻す処理
function defaultColorTxtBox() {
	let boxSeireki = document.getElementById('seireki');
    let boxMonth  = document.getElementById('month');
	boxSeireki.style.backgroundColor = 'white';
	boxMonth.style.backgroundColor = 'white';
}
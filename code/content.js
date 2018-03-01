//东软日报快填插件forPC v0.23 by windbell2 2017.8.31
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

let isPP = false;

let neusoftPP = {
    f: null,
    p: null,
    date: '', //当前日
    dateStart: '', //当前月开始日
    dateEnd: '', //当前月结束日
    selectedDays: [],
    formData: {

        txtDateStart: '2017-08-07',
        txtDateEnd: '2017-08-13',
        hidState: 'saveBack',
        hidNoEditDay: '2017-07-31',
        hidServerDate: '2017-08-07',
        txtDate: '2017-08-01',
        txtTask: "众创教育", //任务名称
        txtTime: 8, //任务名称
        txtWorkLoad: 1,
        selProject: "1031537: 01",
        attribute1: "xxxx",
        selProTask: "2001192",
        selActType1: "8734",
        selActType2: "",
        selModule1: 131453,
        selModule2: 131454,
        selResult: 10,
        txtResValue: 12,
        txtRemark: 123123123
    },
    event_daySelect(evt, v) {

        if (evt.target.tagName == "I")

            evt.target.classList.toggle('selected')
            //var i = this.selectedDays.indexOf(v);


        // if (i == -1) {
        //     evt.target.classList.add('selected');
        //     //this.selectedDays.splice(i, 1);
        // } else {
        //     evt.target.classList.remove('selected');
        //     //this.selectedDays.splice(i, 1);
        // }
    },
    ajax(type, url, data, fun) {
        type = type.toUpperCase();
        //alert(JSON.stringify(data))
        // fun()
        // return;
        var xht = new XMLHttpRequest();
        xht.onreadystatechange = function() {

            if (xht.readyState == 4 && xht.status == 200) {
                fun(xht.response);
            } else {

            }
        }
        xht.open(type, url, true);
        xht.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded')
        let _data = "";

        //if (type == "POST")
        for (let k in data) {
            _data += k + "=" + data[k] + "&"
        }
        _data = _data.substring(_data.length - 1, 1)
        xht.send(_data);
    },
    submit() {
        console.log('submit');
        var doms = document.forms[0].getElementsByTagName("*");
        var data = {};
        for (var i = 0; i < doms.length; i++) {
            switch (doms[i].tagName) {
                case "INPUT":
                case "SELECT":
                case "TEXTAREA":
                    if (doms[i].getAttribute('type') != 'button')
                        data[doms[i].name] = doms[i].value;
                    break;
            }
        }
        let msg = ""
        if (data.txtTask == "") { msg = "任务名不能为空" }
        if (data.txtTime == "" && data.txtWorkLoad == "") { msg = "工作和加班不能同时为空或0" }
        if (data.selProject == "") { msg = "项目名称不能为空" }
        if (data.selProTask == "") { msg = "项目任务不能为空" }
        if (data.selActType1 == "") { msg = "活动类型不能为空" }
        if (data.selModule1 == "") { msg = "项目模块不能为空" }
        if (msg != "") {
            alert(msg);
            return;
        }

        data.hidState = "saveBack"

        var ss = document.querySelectorAll('.days-content .selected');
        var index = 0;
        var _this = this;

        function pp() {

            if (index < ss.length) {
                data.txtDate = ss[index].getAttribute("data-v");

                _this.ajax('POST', "/SaveDaily.do", data,
                    html => {

                        let m = html.match(/\/\/初始化画面([\s\S]*?)\/\/下拉框连动处理/);
                        if (m) { //提交出错了
                            let errorhtml = m[1];
                            errorm = errorhtml.match(/alert\(\"(.*?)\"\)/);
                            if (errorm) {

                                alert(data.txtDate + "日出错！\n" + errorm[1]);
                            }
                        } else {
                            ss[index].setAttribute('status', 'doed')
                        }
                        index++;
                        arguments.callee()
                    }
                );
            }
        };
        pp();

    },
    buildDay: function() {
        let fDay = new Date();
        fDay.setDate(1);
        let eDay = new Date(fDay.getFullYear(),fDay.getMonth()+1,0)
        let YYYYMM = fDay.getFullYear().toString() + '-' + (fDay.getMonth() < 9 ? ("0" + (fDay.getMonth() + 1)) : (fDay.getMonth() + 1))
        let html = "";
        for (let i = 1; i <= eDay.getDate(); i++) {
            let day = i < 10 ? "0" + i : i.toString();
            let week = new Date(YYYYMM + '-' + day).getDay();
            if (day == 1 && week != 1) {

                week = week == 0 ? 6 : week - 1;
                while (week) {
                    html += '<i  class="nullDay">null</i>';
                    week--;
                }

            }
            html += '<i data-v="' + YYYYMM + '-' + day + '" >' + day + "</i>"
        }
        this.dateStart = YYYYMM + "-01";
        this.dateEnd = YYYYMM + "-" + eDay.getDate();
        var now = new Date().getDate();
        this.date = YYYYMM + "-" + (now < 10 ? ("0" + now) : now);
        return html;
    },
    buildStyle: function() {
        let style = document.createElement("style");
        style.innerHTML = `
        body {
            background-color: #0f6741;
        }
        .neusoftpp-layer{
            display:inline-block;width:48%;    vertical-align: top;
             color:#fff;
        }
        .neusoftpp-layer .days{
            width:400px;
            border:1px solid rgba(255, 255, 255, 0.18);

        }

        .neusoftpp-layer .days i{
            width: 14.285%;
            height: 40px;
            display: inline-block;
            padding: 4px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-width: 1px 1px 0 0;
            background-color: #b09d82;
            color: #e6e1dc;
            cursor: pointer;
            box-sizing: border-box;
            text-align: center;
            line-height: 32px;
            font-size: 16px;
            font-style: initial;
        }
        .neusoftpp-layer .days-content i{
                position: relative;
        }
        .neusoftpp-layer .days-content i:hover{
            background-color:#f05b2a;
        }
        .neusoftpp-layer .days-content i.selected{
            background-color:#FF4939;
        }
        .neusoftpp-layer .days-content i[status=doed]{

            animation: dayDoing .3s forwards;
            transform:perspective:200px rotateX(00deg);
            pointer-events: none;
        } 
        .neusoftpp-layer .days-content i[status]:before{
            position: absolute;
             bottom: 0;
            right: 4px;
            display: inline-block;
            color: #e6e1dc;
            line-height: 16px;         
        }
        .neusoftpp-layer .days-content i[status=doed]:before{
            content: "●";

            animation: dayDoingPoint .3s forwards;
        }
        .neusoftpp-layer .days-content i[status=pass]:before{
            color: #ffdb00;
            content: "✔";
        }
        .neusoftpp-layer .days i.nullDay{
            pointer-events: none;
            opacity:0;
        }
        
        @keyframes dayDoing {
            0% {
                transform:perspective(200px) rotateX(00deg);
            }
            50% {
                transform:perspective(200px) rotateX(90deg);
            }
            51% {
                transform:perspective(200px) rotateX(270deg);
            }            
            100% {
                transform:perspective(200px) rotateX(360deg);
            }
        }
        @keyframes dayDoingPoint{
            0% {
                transform: scale(5);
                opacity:0;
            }
          
            100% {
                transform: scale(1);
                opacity:1;
                
            }
        }
        .neusoftpp-layer .days-header i{background-color:#626262;color:#fff}   
        .neusoftpp-layer button{
            border:1px solid #fff;
            font-size:16px;
            padding:6px 12px;
        }
        .neusoftpp-layer button:hover{
            background-color:#ff9900;
            color:#fff;
        }  
        .neusoftpp-layer button:active{
            margin:1px 1px 0 0
        }                 
        `
        document.body.appendChild(style)
    },
    fiexOrgDom() {
        this.f.style.width = "50%";
        this.f.style.display = "inline-block";

    },
    appendContent() {

        let d = document.createElement('div');

        d.className = "neusoftpp-layer"

        d.innerHTML = `
        <table>
            <tr><td >
                <div class="days days-header">
                <i>一</i><i>二</i><i>三</i><i>四</i><i>五</i><i>六</i><i>日</i>
                </div>
                <div class="days days-content">
                ` + this.buildDay() + `
                </div>
            </td></tr>        
            <tr><td>
                <button type="button" class='days-checkoutBtn'>检查</button>
                <button type="button" class='days-submitBtn'>批量提交</button>
                <button type="button" class='days-selectBtn'>工作日全选</button>
            </td></tr>
        </table>
    `
        this.p.appendChild(d);

        document.querySelector('.days-content').addEventListener('click', this.event_daySelect);

        document.querySelector('.days-submitBtn').addEventListener('click', e => {
            this.submit()
        });

        document.querySelector('.days-checkoutBtn').addEventListener('click', e => {
            this.checkout()
        })

        document.querySelector('.days-selectBtn').addEventListener('click', e => {
            this.select();
        });
    },
    resetDays() {
        var ss = document.querySelectorAll('.days-content i[data-v]');
        for (let si = 0; si < ss.length; si++) {
            ss[si].className = "";
            ss[si].setAttribute('title', '');
            ss[si].removeAttribute('status')
        };
        return ss;
    },
    checkout() {
        var ss = this.resetDays();;

        this.ajax('post', '/DailyList.do', {
                state: 'listDaily',
                currentDate: this.date,
                txtDateStart: this.dateStart,
                txtDateEnd: this.dateEnd,
                CHECK_FLAG: 1,
                CHECK_FLAG: 0,
                CHECK_FLAG: 0,
                CHECK_FLAG: 0,
                CHECK_FLAG: 0,
                curPage: 1,
                pageSize: 40,
                recNumber: 5
            },
            html => {
                let vv = document.createElement('div');
                vv.innerHTML = html;
                let recordDom = vv.querySelectorAll('.frameborder_thin')[1].querySelectorAll('tr');
                let record = [];

                for (let i = 1; i < recordDom.length; i++) {
                    var children = recordDom[i].children;

                    record.push({
                        date: children[1].innerText.trim(),
                        status: children[2].innerText.trim() == "审核通过",
                        name: children[3].innerText.trim(),
                        workTime: children[11].innerText.trim() + "-" + children[12].innerText.trim(),
                    })
                };


                record.forEach(v => {
                    let d = ss[new Date(v.date).getDate() - 1];
                    setTimeout(a => {
                        d.setAttribute('status', 'doed')
                        if (v.status) {
                            //d.classList.add('pass');
                            d.setAttribute('status', 'pass')
                        }
                        d.setAttribute('title', v.name + " [" + v.workTime + " h]")
                    }, 0);

                    //d.classList.add('doed');

                })

            }
        )
    },
    select() {
        let month = new Date().getMonth();
        let dateList = [
            [],
            [],
            [
                "2018-03-01",
                "2018-03-02",
                "2018-03-05",
                "2018-03-06",
                "2018-03-07",
                "2018-03-08",
                "2018-03-09",
                "2018-03-12",
                "2018-03-13",
                "2018-03-14",
                "2018-03-15",
                "2018-03-16",
                "2018-03-19",
                "2018-03-20",
                "2018-03-21",
                "2018-03-22",
                "2018-03-23",
                "2018-03-26",
                "2018-03-27",
                "2018-03-28",
                "2018-03-29",
                "2018-03-30"
            ],
            [
                "2018-04-02",
                "2018-04-03",
                "2018-04-04",
                "2018-04-08",
                "2018-04-09",
                "2018-04-10",
                "2018-04-11",
                "2018-04-12",
                "2018-04-13",
                "2018-04-16",
                "2018-04-17",
                "2018-04-18",
                "2018-04-19",
                "2018-04-20",
                "2018-04-23",
                "2018-04-24",
                "2018-04-25",
                "2018-04-26",
                "2018-04-27",
                "2018-04-28"
            ],
            [
                "2018-05-02",
                "2018-05-03",
                "2018-05-04",
                "2018-05-07",
                "2018-05-08",
                "2018-05-09",
                "2018-05-10",
                "2018-05-11",
                "2018-05-14",
                "2018-05-15",
                "2018-05-16",
                "2018-05-17",
                "2018-05-18",
                "2018-05-21",
                "2018-05-22",
                "2018-05-23",
                "2018-05-24",
                "2018-05-25",
                "2018-05-28",
                "2018-05-29",
                "2018-05-30",
                "2018-05-31"
            ],
            [
                "2018-06-01",
                "2018-06-04",
                "2018-06-05",
                "2018-06-06",
                "2018-06-07",
                "2018-06-08",
                "2018-06-11",
                "2018-06-12",
                "2018-06-13",
                "2018-06-14",
                "2018-06-15",
                "2018-06-19",
                "2018-06-20",
                "2018-06-21",
                "2018-06-22",
                "2018-06-25",
                "2018-06-26",
                "2018-06-27",
                "2018-06-28",
                "2018-06-29"
            ],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        for(let index in dateList[month]){
            document.querySelector('[data-v="'+dateList[month][index]+'"]').click();
        }
    },
    init() {
        this.buildStyle();
        this.f = document.querySelector('[name=dailyForm] table table');
        this.p = this.f.parentNode;
        this.fiexOrgDom();
        this.appendContent();
    }
}

if (document.title == '东软日报系统') {
    isPP = true;
    neusoftPP.init();


}
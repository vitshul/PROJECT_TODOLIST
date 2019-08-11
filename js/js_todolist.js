"use strict"
function generateID () {
    return '_' + Math.random().toString(36).substr(2, 9);
};

function diffDate(date1,date2,interval) {
    var second=1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7;
    date1 = new Date(date1);
    date2 = new Date(date2);
    var timediff = date2 - date1;
    if (isNaN(timediff)) return NaN;
    switch (interval) {
        case "years": return date2.getFullYear() - date1.getFullYear();
        case "months": return (
            ( date2.getFullYear() * 12 + date2.getMonth() )
            -
            ( date1.getFullYear() * 12 + date1.getMonth() )
        );
        case "weeks"  : return Math.floor(timediff / week);
        case "days"   : return Math.floor(timediff / day);
        case "hours"  : return Math.floor(timediff / hour);
        case "minutes": return Math.floor(timediff / minute);
        case "seconds": return Math.floor(timediff / second);
        default: return undefined;
    }
}

function leftDate(dateNow,dateFinish) {

    let Years =  diffDate(dateNow, dateFinish, "years")
    if(Years>0) return (Years+" years");

    let Days =  diffDate(dateNow, dateFinish, "days")
    if(Days>0 && Days<=7) return (Days + " days");

    let Weeks =  diffDate(dateNow, dateFinish, "weeks")
    if(Weeks>0 && Weeks<4) return (Weeks + " weeks");

    let Months =  diffDate(dateNow, dateFinish, "months")
    if(Months>0) return (Months + " months");

    let Hours =  diffDate(dateNow, dateFinish, "hours")
    if(Hours>0) return (Hours + " hours");

    let Minutes =  diffDate(dateNow, dateFinish, "minutes")
    if(Minutes>0) return (Days + " min");

    let Seconds =  diffDate(dateNow, dateFinish, "seconds")
    if(Seconds>0) return (Days + " sec");
}

class todo  {

    constructor(value, dateFinish, ID=generateID(), dateAdd = new Date(), check = false) {
        this.ID = ID;
        this.value = value;
        this.dateFinish = dateFinish;
        this.dateAdd = dateAdd;
        this.check = check;
    }
    getDayFinish (){
        let data = new Date();
        return leftDate(data, this.dateFinish)
    }

    setCheck (){
        if(this.check==false){
            this.check=true;
        } else
        {
            this.check=false;
        }
    }
}

//функция 2 знака во времени
function zeroDate(number) {
    return ((number < 10 ? '0' : '') + number)
}

function sortByDate(list) {
   return list.sort((d1, d2) => new Date(d1.dateFinish).getTime() - new Date(d2.dateFinish).getTime());
}

var myNodelist=Array();
var myArhiv=Array();
var flagCheck = false;

if (localStorage.getItem("mylist")){
    let mylist = JSON.parse(localStorage.getItem("mylist"));
    mylist.forEach(function (item){
        myNodelist.push(new todo(item.value, item.dateFinish, item.ID, item.dateAdd, item.check));
    });
    let myarhivlist = JSON.parse(localStorage.getItem("myArh"));
    if(myarhivlist) {
        myarhivlist.forEach(function (item){
            myArhiv.push(new todo(item.value, item.dateFinish, item.ID, item.dateAdd, item.check));
        });
    }
}
else{
    myNodelist=sortByDate(new Array (new todo("решить задачу 1", new Date(2019, 10, 30)),
        new todo("решить задачу 2", new Date(2019, 12, 31)),
        new todo("решить задачу 3", new Date(2019, 9, 15))));
}
function getDATA(date) {
   return ((zeroDate(date.getDate())) + "/" + (zeroDate(date.getMonth() + 1)) + "/" + date.getFullYear()).toString();
}

function view(list) {

    $(myLIST).empty();
    list.forEach(function (item, i, arr){
        var li = document.createElement("li");
        let divText = document.createElement("div");
        divText.dataset.id = item.ID;


        divText.className = "inputText";
        if(item.check==true){
            divText.classList.add('checked');
        }
        let t = document.createTextNode(item.value);
        divText.appendChild(t)

        li.appendChild(divText);

        var span1 = document.createElement("SPAN");
        var txtDateFinish = document.createTextNode(item.getDayFinish());
        span1.className = "inputDate";
        span1.appendChild(txtDateFinish);

        var span2 = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span2.className = "close";
     //   span2.onclick = ;
        span2.appendChild(txt);
        li.appendChild(span1);
        li.appendChild(span2);
        myLIST.appendChild(li);
    });
}
function changeFlag() {
 //   let checkBox = document.getElementById('checkbox');
 //   let arh = document.getElementById('list');

    // установим в меню поле архив
   // var sel = document.getElementById('list').options[0].selected;
    var sel = document.getElementById('list');

    if(flagCheck==false) {
        flagCheck = true;
/*        if(sel[0].selected==true){
            sel[1].selected=true;
        }*/
    }else {
        flagCheck=false;
/*        if(sel[2].selected==true){
            sel[0].selected=true;
        }*/
    }
    viewList();
}

function viewList() {
  //  var select = document.querySelector('select').querySelectorAll('option');
//    document.getElementById('chbx').disabled = true;


    var select = document.querySelector('select');
    var indexSelected = select.selectedIndex;

    switch (select[indexSelected].value) {
        //все задачи
        case '1':
            let mylist0=myNodelist;
/*            if (flagCheck ==true){
                mylist0 = myNodelist.filter(function (item) {
                    return item.check==false;
                });
            }*/
            document.getElementById('checkbox').checked = false;
            document.getElementById('checkbox').disabled = true;
            view(mylist0);
        break;
        //не выполненные (скрыть выпоненные)
        case '2':
            let mylist = myNodelist.filter(function (item) {
               return item.check==false;
            });
            document.getElementById('checkbox').checked = true;
            view(mylist);
            break;
        //выполненные
            case '3':
            let mylist2 = myNodelist.filter(function (item) {
            return item.check==true;
        });
            if (flagCheck==false){
                changeFlag();
            }
            document.getElementById('checkbox').checked = false;
           view(mylist2);
            break;
        //неделя
        case '4':
            let mylist3 = myNodelist.filter(function (item) {
                return  (diffDate(new Date(),item.dateFinish,'days')<7)
            });
            if (document.getElementById('checkbox').checked  ==true){
                mylist3 = mylist3.filter(function (item) {
                    return (item.check==false)
                })
            }
            document.getElementById('checkbox').disabled = false;
            view(mylist3);
            break;
        //   месяц
        case '5':
            let mylist4 = myNodelist.filter(function (item) {
                return  (diffDate(new Date(),item.dateFinish,'days')<31)
            });
            if (document.getElementById('checkbox').checked ==true){
                mylist4 = mylist4.filter(function (item) {
                    return (item.check==false)
                })
            }
            document.getElementById('checkbox').disabled = false;
            view(mylist4);
            break;
        //   архив
        case '6':  view(myArhiv);
            document.getElementById('checkbox').checked = false;
            document.getElementById('checkbox').disabled = true;
            break;
        default: alert("что-то пошло не так! смотри selectmenu!");
    }
}

var myLIST = document.getElementById("myUL")


function getScore(list) {
    document.getElementById("score").innerText=myNodelist.length.toString();
    document.getElementById("scoreCheck").innerText=myNodelist.filter(function (item) {
        return item.check==true;
    }).length.toString();
    document.getElementById("scoreUnCheck").innerText=myNodelist.filter(function (item) {
        return item.check==false;
    }).length.toString();
    document.getElementById("scoreArh").innerText=myArhiv.length.toString();
}
getScore(myNodelist);



// Добавить класс "checked" по клику
var list = document.querySelector('ul');
list.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'DIV') {
        ev.target.classList.toggle('checked');

       myNodelist.forEach(function(item){
           if (item.ID== ev.target.dataset.id ){
               item.setCheck();
           }
       });
    }
}, false);

// Добавить новые элемент в список
function newElement() {

    var data = document.getElementById("datepicker").value;
    var inputValue = document.getElementById("myInput").value;
    var inputDate = new Date(data);

    if (!((inputValue == '') || (data == ''))) {
        $(myLIST).empty();
        myNodelist.push(new todo(inputValue, inputDate));
        myNodelist = sortByDate(myNodelist);
        myNodelist.forEach(function (item, i, arr) {

            var li = document.createElement("li");
            let divText = document.createElement("div");
            divText.dataset.id = item.ID;

            divText.className = "inputText";
            let t = document.createTextNode(item.value);
            divText.appendChild(t)
            if (item.check == true) {
                divText.classList.add('checked');
            }

            li.appendChild(divText);

            var span1 = document.createElement("SPAN");
            var txtDateFinish = document.createTextNode(item.getDayFinish());
            span1.className = "inputDate";
            span1.appendChild(txtDateFinish);

            var span2 = document.createElement("SPAN");
            var txt = document.createTextNode("\u00D7");
            span2.className = "close";
            span2.appendChild(txt);
            li.appendChild(span1);
            li.appendChild(span2);
            myLIST.appendChild(li);

        });

        document.getElementById("myInput").value = '';
        document.getElementById("datepicker").value = '';

        let arh = document.getElementById('list');
        // установим в меню поле архив
        arh.options[0].selected=true

    } else {
        alert("Не заполнены поля!");
    }
}

// Create a new list item when clicking on the "Add" button
function deleteElements() {
    var result = confirm("Вы уверены что хотите очистить список задач?");

    if(result){
        document.getElementById("myInput").value='';
        document.getElementById("datepicker").value = '';
        $(myLIST).empty();
        myNodelist=[];
        localStorage.removeItem("mylist");
        localStorage.removeItem("myArh");
    }
}

function delList() {

    myNodelist.forEach(function (item) {
        if(item.check == true){
            myArhiv.push(item);
        };
    });
    myNodelist = myNodelist.filter(function (item) {
        return (item.check == false);
    });
    flagCheck=false;
    viewList();

}

function showArh() {
    view(myArhiv);
    let arh = document.getElementById('list');
    // установим в меню поле архив
    arh.options[5].selected=true;
}

// сохранить списки в localStorage
function saveElements() {
    // Сериализуем его
    var sObj = JSON.stringify(myNodelist);
    var sObj2 = JSON.stringify(myArhiv);
    // Запишем в localStorage с ключём object
    localStorage.setItem("mylist", sObj);
    localStorage.setItem("myArh", sObj2);
}

//функция часов в меню
function startClock() {
    window.requestAnimationFrame(startClock);
    getScore(myNodelist);

    // удалить задачу из списка
    var closeElem = document.getElementsByClassName("close");

    function deleteElement(elemID) {
        myNodelist=myNodelist.filter(function (item){
            return item.ID!=elemID;
        });
        viewList();
        closeElem = document.getElementsByClassName("close");
    }

    // вызов метода массива через call
    [].forEach.call(closeElem, function (item) {
        item.onclick = function (e) {
            deleteElement(e.target.parentElement.querySelector('div').getAttribute('data-id'));
        };
    });

    // время на экране
    var date = new Date();
    var _time = zeroDate(date.getHours()) + ":" + zeroDate(date.getMinutes()) + ":" +
        zeroDate(date.getSeconds()) + " " +
        (zeroDate(date.getDate())) + "/" + (zeroDate(date.getMonth() + 1)) + "/" + date.getFullYear();
    var Time = document.getElementById("Time");
    Time.innerText = _time;
}

viewList();
startClock();


////////////////// SPA      //////////////////////
/*

window.onhashchange = function() {
    checkHash();
}

checkHash();

function loadPage(pageName) {
    $.ajax('pages/' + pageName + ".html", {
        type: 'GET',
        dataType: 'html',
        success: dataLoaded,
        error: errorHandler
    });
}

function dataLoaded(data) {
    document.getElementById('main').innerHTML = data;
    switch (window.location.hash.slice(1)) {
        case 'main':
            document.getElementsByTagName('button')[0].addEventListener('click', function() {
                console.log(this.innerHTML);
            });
            break;
        case 'contacts':
            document.getElementsByTagName('button')[0].addEventListener('click', function() {
                console.log(this);
            });
            break;
    }
}

function errorHandler() {
    loadPage('main');
}

function checkHash() {
    var URLHash = window.location.hash;
    if (!URLHash) {
        loadPage('main');
        return false;
    }

    var hashStr = URLHash.slice(1);
    loadPage(hashStr);
}*/

$("#currentDay").text(moment().format('dddd, MMMM Do'));

var savedTasks = new Array();



function createDiv(){
    var mainDiv = $(".container");

    // main div
    for (var i=0; i<9; i++) {
        var div = document.createElement("div");
        div.className = "row";
        div.id = i+9;
        mainDiv.append(div);
    }

    // div content
     
     for (var i=9; i<18; i++) {

        currHr = moment().format('HH')
        var spanEl = document.createElement("span");
        var innerDiv = $("#" + i);
        var hourDiv = document.createElement("div");
        hourDiv.className = "col-1 hour";
        hourDiv.id += i
        hourDiv.textContent = moment(i, ["HH.mm"]).format("h A");

        spanEl.setAttribute("data-span-hourBl-id", (i-9).toString());

        if (currHr>i) {
            spanEl.className = "col-10 past";
        }
        else if (currHr === i) {
            spanEl.className = "col-10 present";
        }
        else { 
            spanEl.className = "col-10 future";
        }
        spanEl.className = spanEl.className + " task";
        

        var saveDiv = document.createElement("div");
        var iEl  = document.createElement("i");

        iEl.className = "fa fa-save my-4 mx-1"
        iEl.setAttribute("data-hourBl-id", (i-9).toString());

        saveDiv.className = "col-1 saveBtn"
        saveDiv.id = i;

        try {
            spanEl.innerText = savedTasks.find( ({ hourBl }) => hourBl === (i-9).toString()).task;
        }
        catch (e) {
            spanEl.innerText = '';
        }
    
        saveDiv.append(iEl)
        innerDiv.append(hourDiv);
        innerDiv.append(spanEl);
        innerDiv.append(saveDiv);

    }
}


$(".container").on("click", "i", function(){
    var hourBl = $(this).attr("data-hourBl-id");
    var text = $(`[data-span-hourBl-id=${hourBl}]`).text()
    saveTasks(hourBl, text);
});

$(".container").on("click", "span", function() {
    var text = $(this)
    .text()
    .trim();

    var hourBl = $(this).attr('data-span-hourBl-id');

    var textInput = $("<textarea>").addClass($(this).attr("class")).val(text);
    textInput.attr("data-span-hourBl-id", hourBl)

    $(this).replaceWith(textInput)
    textInput.trigger("focus");
   
});

// editable field was un-focused
$(".container").on("blur", "textarea", function() {
    
    // get current value of textarea

    var text = $(this).val();
    var hourBl = $(this).attr('data-span-hourBl-id');

    // recreate span element
    var taskSpan = $("<span>")
    .addClass($(this).attr("class"))
    .text(text);
   
    taskSpan.attr("data-span-hourBl-id", hourBl)
  
    // text area
    $(this).replaceWith(taskSpan);

});

//  save task to local storage
function saveTasks(hourBl, task) {
    
    try {
      var tempObj = savedTasks.find(x => x.hourBl === hourBl); 
      tempObj.task = task;
    }
    catch (e) {
        var oTask = {};
        oTask.hourBl = hourBl;
        oTask.task = task;
        savedTasks.push(oTask);
    }
    try {
        localStorage.setItem('dailyTasks', JSON.stringify(savedTasks));
    }
    catch (e) {
        
    }
    
}

// local storage
function loadTasks() {
    if (localStorage.dailyTasks) {
        savedTasks = JSON.parse(localStorage.getItem('dailyTasks'))
    }
}
loadTasks();
createDiv();
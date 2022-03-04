$("#currentDay").text(moment().format('llll'));
var savedTasks = new Array();

function createDiv(){
    var mainDiv = $(".container");

    //populate the main div container
    for (var i=0; i<9; i++) {
        var newDiv = document.createElement("div");
        newDiv.className = "row";
        newDiv.id = i+9;
        mainDiv.append(newDiv);
    }

    //populate inner divs
     
    for (var i=9; i<18; i++) {

        currHr = moment().format('HH')
        var spanEl = document.createElement("span");
        var innerDiv = $("#" + i);
        var timeDiv = document.createElement("div");
        timeDiv.className = "col-1 hour";
        timeDiv.id += i
        timeDiv.textContent = moment(i, ["HH.mm"]).format("h A");

        spanEl.setAttribute("data-span-time-id", (i-9).toString());

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
        iEl.setAttribute("data-time-id", (i-9).toString());

        saveDiv.className = "col-1 saveBtn"
        saveDiv.id = i;

        try {
            spanEl.innerText = savedTasks.find( ({ timeID }) => timeID === (i-9).toString()).task;
        }
        catch (e) {
            spanEl.innerText = '';
        }
    
        saveDiv.append(iEl)
        innerDiv.append(timeDiv);
        innerDiv.append(spanEl);
        innerDiv.append(saveDiv);

    }
}
$(".container").on("click", "span", function() {
    var text = $(this)
    .text()
    .trim();

    var timeID = $(this).attr('data-span-time-id');

    var textInput = $("<textarea>").addClass($(this).attr("class")).val(text);
    textInput.attr("data-span-time-id", timeID)

    $(this).replaceWith(textInput)
    textInput.trigger("focus");
   
});

// editable field was un-focused
$(".container").on("blur", "textarea", function() {
    // get current value of textarea

    var text = $(this).val();
    var timeID = $(this).attr('data-span-time-id');

    // recreate <span> element
    var taskSpan = $("<span>")
    .addClass($(this).attr("class"))
    .text(text);
   
    taskSpan.attr("data-span-time-id", timeID)
  
    // replace textarea with new content
    $(this).replaceWith(taskSpan);

});

function saveTasks(timeID, task) {
    try {
      var tempObj = savedTasks.find(x => x.timeID === timeID); 
      tempObj.task = task;
    }
    catch (e) {
        var oTask = {};
        oTask.timeID = timeID;
        oTask.task = task;
        savedTasks.push(oTask);
    }
    try {
        localStorage.setItem('dailyTasks', JSON.stringify(savedTasks));
    }
    catch (e) {
        alert("Something went wrong! Please try again.")
    }
    alert("Task saved successfully!")
}

function loadTasks() {
    if (localStorage.dailyTasks) {
        savedTasks = JSON.parse(localStorage.getItem('dailyTasks'))
    }
}
loadTasks();
createDiv();

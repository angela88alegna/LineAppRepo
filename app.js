var button=document.querySelector(".btn");
var body= document.querySelector("body");
var countButtonClicks = 0;
var firstInput= document.querySelector("input");

// toggle .change class on mode btn
button.addEventListener("click", function(){
    body.classList.toggle("change");

   body.classList.contains("change")?console.log("dark"): console.log("light");
    
    // change mode button text
    body.classList.contains("change")? button.innerHTML="dark mode off" : button.innerHTML="dark mode on";

  // count number of clicks on btn
  countButtonClicks += 1;
  // console.log( countButtonClicks );

  //change first input field value
 document.querySelector("input").setAttribute("value", countButtonClicks);


  //change second input field value
document.querySelector("#add-data-form > input[type=text]:nth-child(2)").setAttribute("value",  body.classList.contains("change")?"dark":"light")
})


// firestore-database interactions


const dataCollection= document.querySelector("#data-list");
var form=document.querySelector("#add-data-form");

//create element and render data in the dom
function renderData(doc){
  let li= document.createElement("li");
  let clickNumber= document.createElement("span");
  let mode= document.createElement("span");
  let date= document.createElement("span");
  let cross= document.createElement("div");

  li.setAttribute("data-id", doc.id);
  clickNumber.textContent= doc.data().number;
  mode.textContent= doc.data().mode;
  date.textContent= doc.data().date;
  cross.textContent = "x";

  li.appendChild(clickNumber);
  li.appendChild(mode);
  li.appendChild(date);
  li.appendChild(cross);

  dataCollection.appendChild(li);

  //delete data
  cross.addEventListener("click", (e) =>{
    e.stopPropagation();
    let id= e.target.parentElement.getAttribute("data-id");
    db.collection("actions").doc(id).delete();
  })
}

// // get data from firestore database
// db.collection("actions").get().then((snapshot)=>{
//   snapshot.docs.forEach(doc=>{
//     renderData(doc);
//   })
// })

//realtime listener database
db.collection("actions").onSnapshot(snapshot=>{
  let changes=snapshot.docChanges();
  changes.forEach(change=> {
   if(change.type=="added"){
     renderData(change.doc)
   } else if(change.type=="removed"){
     let li= dataCollection.querySelector("[data-id=" + change.doc.id + "]");
     dataCollection.removeChild(li);
   }
    })
})  

//save data as list items
var addDataButton= document.querySelector(".add");
addDataButton.addEventListener("click", (e) => {
  e.preventDefault();
  
  db.collection("actions").add({
    
    number: countButtonClicks,
    mode: body.classList.contains("change")?"dark":"light" ,
    date: new Date().toLocaleDateString() +" "+ new Date().toLocaleTimeString()    
  });
  
})

//make the firstinput value and countButtonClicks zero when data is added
addDataButton.addEventListener("click", (e) => {firstInput.value= Number(0);
  countButtonClicks=0;
  button.addEventListener("click",function(){
   
    firstInput.value=countButtonClicks
  })
})

// disable onkeypress event on input fields
function disable()
{
 document.onkeydown = function (e) 
 {
  return false;
 }
}

// module.exports= disable;


/*
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: __CYNTHIA CHINEME____________________ Student ID: __130116239____________ Date: _________14-06-2024_______
*
********************************************************************************/ 


var HTTP_PORT = process.env.PORT || 8080;
var path = require("path");
var express = require("express");
var app = express();
var collegeStudentData = require('./modules/collegeData');


// setup a 'route' to listen on the default url path
/*
app.get("/", (req, res) => {
    res.send("Hello World!");
});
*/
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.get("/students", (req, res) => {
    var courseNum = req.query.course;

    if (courseNum == undefined ){
        collegeStudentData.getAllStudents()
        .then((resolve_response) => { res.json(resolve_response)})
        .catch(()=>{
            res.json({'message' : 'no results'});
        });
        
    }
    else{
        collegeStudentData.getStudentsByCourse(courseNum)
        .then((resolve_response) => {res.json(resolve_response)})
        .catch(()=>{
            res.json({'message' : 'no results'});
        });
    }
/*
    collegeStudentData.initialize()
    .then(
        ()=>(collegeStudentData.getAllStudents())
    ).then((resolve_response) => { res.json(resolve_response)})
    .catch(()=>{
        res.json({'message' : 'no results'});
    }) 


/*/
});
app.get("/tas", (req, res) => {
   collegeStudentData.getTAs()
    .then((resolve_response) => {res.json(resolve_response)})
    .catch(()=>{
        res.json({'message' : 'no results'});
    })
});
app.get("/courses", (req, res) => {
    collegeStudentData.getCourses()
    .then((resolve_response) => {res.json(resolve_response)})
    .catch(()=>{
        res.json({'message' : 'no results'});
    })
});
app.get("/student/:num", (req, res) => {
    var studentNo = req.params.num;
    collegeStudentData.getStudentByNum(studentNo)
    .then((resolve_response) => {res.json(resolve_response)})
  .catch(()=>{
    res.json({'message' : 'no results'});
  })
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"/views/home.html"))
});
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname,"/views/about.html"));
});
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname,"/views/htmlDemo.html"));
});
app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname,"/views/addstudent.html"));
});
 // Using Post route to process the form 
 app.post("/students/add", (req, res) => {
    collegeStudentData.addStudent(req.body) 
    .then(
        () => res.redirect('/students')
    )
});

app.use( (req, res) => {
    //res.status(404).send("404");
    res.sendFile(path.join(__dirname,"/views/404.html"));
});
// setup http server to listen on HTTP_PORT
//app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});

collegeStudentData.initialize()
.then(
    ()=>(app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)}))
)
.catch((err)=>{
    console.log(err)
})
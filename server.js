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
var exphbs = require('express-handlebars');
var app = express();
var collegeStudentData = require('./modules/collegeData');


// setup a 'route' to listen on the default url path
/*
app.get("/", (req, res) => {
    res.send("Hello World!");
});
*/
app.use(express.static("Public"));
app.use(express.urlencoded({ extended: true }));

app.engine('.hbs', exphbs.engine({  
    extname: '.hbs' ,
    helpers: {
        navLink: function( url , options) {
            return '<li' +
            ((url == app.locals.activeRoute)? ' class="nav-item active" ': ' class="nav-item" ' )+
            '><a class="nav-link" href="' + url + '">'+ options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebar Helper equal needs 2 parameter");
            if (lvalue != rvalue) {
                return options.inverse(this);
            }
            else {
                return options.fn(this);
            }
        }
    }

}));

app.set('view engine', '.hbs');
// app.set('views', path.join(__dirname, 'views'))
app.set('views', 'views');

app.use(function(req,res,next){ 
    let route = req.path.substring(1); 
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));     
    next(); 
});

app.get("/students", (req, res) => {
    var courseNum = req.query.course;

    if (courseNum == undefined ){
        collegeStudentData.getAllStudents()
        .then((resolve_response) => { res.render('students', { students: resolve_response, layout: "main" })    } )
        .catch(()=>{
            res.render('students', { message: 'no results', layout: "main" });
        });
        
    }
    else{
        collegeStudentData.getStudentsByCourse(courseNum)
        .then((resolve_response) => { res.render('students', { students: resolve_response, layout: "main" })   })
        .catch(()=>{
            res.render('students', { message: 'no results', layout: "main" });
        });
    }

});

app.get("/courses", (req, res) => {
    collegeStudentData.getCourses()
    .then((resolve_response) => {  res.render('courses', { courses: resolve_response, layout: "main" })    })
    .catch(()=>{
        res.render('courses', { message: 'no results', layout: "main" });
    })
});

app.get("/course/:num", (req, res) => {
    var courseNum = req.params.num;
    collegeStudentData.getCourseById(courseNum)
    .then((resolve_response) => {  res.render('course', { courses: resolve_response, layout: "main" })    })
    .catch(()=>{
        res.render('course', { message: 'no results', layout: "main" });
    })
});

app.get("/student/:num", (req, res) => {
    var studentNo = req.params.num;
    collegeStudentData.getStudentByNum(studentNo)
    .then((resolve_response) => { 
        res.render('student', { student: resolve_response, layout: "main" }) 
    } )
  .catch(()=>{
    res.render('student', { message: 'no results', layout: "main" });
  })
});

app.get("/", (req, res) => {
    res.render('home', { layout: "main" });
});
app.get("/about", (req, res) => {
    res.render('about', { layout: "main" });
});
app.get("/htmlDemo", (req, res) => {
    res.render('htmlDemo', { layout: "main" });
});
app.get("/students/add", (req, res) => {
    res.render('addStudent', { layout: "main" });
});

// Using Post route to process the form 
app.post("/students/add", (req, res) => {
    collegeStudentData.addStudent(req.body) 
    .then(
        () => res.redirect('/students')
    )
});

// Using Post route to process the form 
app.post("/students/update", (req, res) => {
    collegeStudentData.updateStudent(req.body) 
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
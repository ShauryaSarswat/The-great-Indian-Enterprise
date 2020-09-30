var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require('method-override');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/restful_blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(bodyParser.urlencoded({extended: true}));
var blogSchema = {
	title : String,
	image :String,
	body : String,
	created  : {type : Date, default: Date.now}
};
var blog = mongoose.model("Blog", blogSchema);

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride('_method'));
//Routes

// INDEX
app.get("/",function(req, res){
	res.redirect("/blogs");
});
app.get("/blogs", function(req, res){
 blog.find({}, function(err, blogs){
 if(err){
 	console.log(err);
 }
 else{
 	res.render("index", {blogs : blogs});
 }
 });
});
app.get("/blogs/new", function(req, res){
 res.render("new");
});
app.post("/blogs/new",function(req ,res){
	blog.create(req.body.blog,function(err, newBlog){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/blogs");
		}
	})
});
app.get("/blogs/:id",function(req, res){
	blog.findById(req.params.id, function(err ,foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show", {blog: foundBlog});
		}
	})
});
app.get("/blogs/:id/edit",function(req, res){
	blog.findById(req.params.id, function(err ,foundBlog){
		if(err){
			res.redirect("/blogs/:id");
		}
		else{
			res.render("edit", {blog: foundBlog});
		}
	})
});
app.put("/blogs/:id", function(req, res){
   blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err) {
           res.redirect("/blogs");
           } else {
               res.redirect("/blogs/" + req.params.id);
           }
   });
});
app.listen(3000, function(){
	console.log("server is running");
})

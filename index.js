const Joi = require("joi"); //install package joi dulu -> npm i joi
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, courseName: "courses 1" },
  { id: 2, courseName: "courses 2" },
  { id: 3, courseName: "courses 3" },
];

// handle get request
app.get("/", (req, res) => {
  res.send("hello world !");
});

// get all
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// get by id
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found");
  res.send(course);
});

// hanle post request
app.post("/api/courses", (req, res) => {
  // validation basic
  //   if (!req.body.courseName || req.body.courseName.length < 3) {
  //     res.status(400).send("Name is required & minimum 3 character");
  //     return;
  //   }

  // validation with joi
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    courseName: req.body.courseName,
  };
  courses.push(course);
  res.send(course);
});

// handle put
app.put("/api/courses/:id", (req, res) => {
  // look up the course
  // if not existing, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("Course not find");

  // validate update
  // if invalid, return 400 - bad request
  const { error } = validateCourse(req.body); //hasilnya result.error diganti dengan notasi {error}
  if (error) return res.status(400).send(error.details[0].message);

  // update course
  course.courseName = req.body.courseName;
  // return the updated course
  res.send(course);
});

// handle delete
app.delete("/api/courses/:id", (req, res) => {
  // look up the course
  // nor existing, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not find");

  // delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  // return the same course
  res.send(course);
});

// private function rules validate
function validateCourse(course) {
  const schema = Joi.object({
    courseName: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}

// call port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));

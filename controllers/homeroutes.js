const router = require("express").Router();
const { Project, User, Timesheet } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  console.log("someone visited root route!");
  // Pass serialized data and session flag into template
  res.render("homepage");
});
// router.get("/project/:id", async (req, res) => {
//   try {
//     const projectData = await Project.findByPk(req.params.id, {
//       include: [
//         {
//           model: User,
//           attributes: ["name"],
//         },
//       ],
//     });

//     const project = projectData.get({ plain: true });

//     res.render("project", {
//       ...project,
//       logged_in: req.session.logged_in,
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// Use withAuth middleware to prevent access to route
router.get("/profile", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Timesheet }],
    });

    const user = userData.get({ plain: true });

    res.render("profile", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }

  res.render("signup");
});

router.get("/viewtime", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  res.render("viewtime");
});

router.get("/viewdates", async (req, res) => {

  try {
  const timesheetsData = await Timesheet.findAll({ 
    where: { user_id: req.session.user_id },
    raw: true
  });

  res.render("viewdates", {
    timesheetsData
  })

  }
  catch(error) {
    console.log(error)
    res.status(500).json(error);
  }
})

router.get("/view/timesheet/:id", async (req, res) => {

  try {
  const timesheetData = await Timesheet.findOne({ 
    where: { id: req.params.id },
    raw: true
  });

  // parse as json == const timesheet JSON.parse(timesheetData.timesheet)
  res.render("viewOneTimesheet", {
    timesheetData
    // supply each key in here
  })

  }
  catch(error) {
    console.log(error)
    res.status(500).json(error);
  }
})


module.exports = router;

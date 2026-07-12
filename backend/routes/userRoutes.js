// const express =
// require("express");

// const router =
// express.Router();

// const auth =
// require("../middleware/auth");

// const {
//   profile,
// } = require(
//   "../controllers/userController"
// );

// router.get(
//   "/profile",
//   auth,
//   profile
// );

// module.exports = router;

// const express = require("express");

// const router = express.Router();

// const protect = require("../middleware/protect");

// const {
//   getProfile,
//   updateProfile,
//   changePassword,
// } = require("../controllers/userController");

// // Get logged-in user
// router.get("/profile", protect, getProfile);

// // Update profile
// router.put("/profile", protect, updateProfile);

// // Change password
// router.put("/change-password", protect, changePassword);

// module.exports = router;

const express = require("express");
const router = express.Router();

const auth = require("../middleware/protect");

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

router.get("/profile", auth, getProfile);

router.put("/profile", auth, updateProfile);

router.put("/change-password", auth, changePassword);

module.exports = router;
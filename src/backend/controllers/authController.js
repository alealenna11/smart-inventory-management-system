// const bcrypt = require("bcryptjs");
// const User = require("../models/User");
// const AuditLog = require("../models/AuditLog");
// const {
//   generateAccessToken,
//   generateRefreshToken
// } = require("../utils/token");

// /* ========================= */
// /* 🔐 REGISTER */
// /* ========================= */
// exports.register = async (req, res) => {
//   try {

//     const {
//       name,
//       email,
//       password,
//       department
//     } = req.body;

//     if (!name || !email || !password || !department) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields required"
//       });
//     }

//     const exists = await User.findOne({ email });

//     if (exists) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists"
//       });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     await User.create({
//       name,
//       email,
//       password: hashed,
//       department,
//       role: "department_user",
//       approvalStatus: "Approved"
//     });

//     return res.json({
//       success: true,
//       message: "Account created successfully"
//     });

//   } catch (err) {

//     console.error("REGISTER ERROR:", err);

//     return res.status(500).json({
//       success: false,
//       message: err.message
//     });

//   }
// };

// /* ========================= */
// /* 🔐 LOGIN */
// /* ========================= */
// exports.login = async (req, res) => {
//   try {

//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password"
//       });
//     }

//     const match = await bcrypt.compare(
//       password,
//       user.password
//     );

//     if (!match) {

//       await AuditLog.create({
//         email,
//         action: "FAILED_LOGIN",
//         ip: req.ip
//       });

//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password"
//       });
//     }

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     user.refreshToken = refreshToken;
//     await user.save();

//     await AuditLog.create({
//       email,
//       action: "LOGIN_SUCCESS",
//       ip: req.ip
//     });

//     return res.json({
//       success: true,
//       user: {
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       department: user.department,
//       approvalStatus: user.approvalStatus
//     },
//       token: accessToken,
//       refreshToken
//     });

//   } catch (err) {

//     console.error("LOGIN ERROR:", err);

//     return res.status(500).json({
//       success: false,
//       message: "Server error"
//     });

//   }
// };

// /* ========================= */
// /* 🔄 REFRESH TOKEN */
// /* ========================= */
// exports.refresh = async (req, res) => {
//   try {
//     const { token } = req.body;

//     if (!token) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     // ✅ Find user by refresh token
//     const user = await User.findOne({ refreshToken: token });

//     if (!user) {
//       return res.status(403).json({ message: "Invalid refresh token" });
//     }

//     // 🔐 Generate new access token
//     const accessToken = generateAccessToken(user);

//     res.json({ token: accessToken });

//   } catch (err) {
//     console.error("REFRESH ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
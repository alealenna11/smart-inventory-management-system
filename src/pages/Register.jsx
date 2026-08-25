import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { logAuditEvent } from "../services/auditService";
import Swal from "sweetalert2";
import "../styles/login.css";

export default function Register() {

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [department, setDepartment] = useState("SGAD - RDT");
const [password, setPassword] = useState("");
const [confirm, setConfirm] = useState("");
const [loading, setLoading] = useState(false);

const navigate = useNavigate();

const getStrength = () => {
if (password.length > 10) return "Strong";
if (password.length > 6) return "Medium";
return "Weak";
};

const handleRegister = async () => {


if (!name || !email || !password || !confirm) {
  return Swal.fire({
    icon: "warning",
    title: "Missing Information",
    text: "Please complete all required fields.",
    confirmButtonColor: "#2563eb"
  });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return Swal.fire({
    icon: "error",
    title: "Invalid Email",
    text: "Please enter a valid email address.",
    confirmButtonColor: "#dc2626"
  });
}

if (password !== confirm) {
  return Swal.fire({
    icon: "error",
    title: "Password Mismatch",
    text: "Passwords do not match.",
    confirmButtonColor: "#dc2626"
  });
}

try {

  setLoading(true);

  const res = await apiRequest(
    "/auth/register",
    "POST",
    {
      name,
      email,
      password,
      department
    }
  );

  console.log("REGISTER RESPONSE:", res);

  if (
  res?.message &&
  res.message !== "Registered successfully" &&
  res.message !== "Account created successfully"
) {
  throw new Error(res.message);
}

  logAuditEvent("REGISTER_SUCCESS", {
    email,
    department
  });

  await Swal.fire({
    icon: "success",
    title: "Account Created",
    text: "Registration completed successfully.",
    timer: 1500,
    showConfirmButton: false
  });

  navigate("/login");

} catch (err) {

  console.error("REGISTER ERROR:", err);

  logAuditEvent("REGISTER_ERROR", {
    email
  });

  let message = "Registration failed";

  if (err?.response?.data?.message) {
    message = err.response.data.message;
  } else if (err?.message) {
    message = err.message;
  }

  Swal.fire({
    icon: "error",
    title: "Registration Failed",
    text: message,
    confirmButtonColor: "#dc2626"
  });

} finally {
  setLoading(false);
}


};

return ( <div className="auth-overlay">

  <div className="auth-left">

    <span className="platform-tag">
      ENTERPRISE GOVERNANCE PLATFORM
    </span>

    <h1>INVISOR</h1>

    <p className="platform-subtitle">
      Enterprise Governance Intelligence Platform
    </p>

    <p className="platform-description">
      Secure onboarding aligned with governance,
      audit readiness, operational resilience
      and enterprise decision intelligence.
    </p>

  </div>

  <div className="auth-right">

    <div className="auth-modal">

      <h2>Create Account</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        type="email"
        placeholder="Corporate Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <select
        value={department}
        onChange={(e) =>
          setDepartment(e.target.value)
        }
      >
        <option>SGAD - RDT</option>
        <option>SGAD - TRS</option>
        <option>SGAD - LOA</option>
        <option>SGAD - CBS</option>
        <option>SGAD - OPC</option>
        <option>GTBD - Client Service</option>
        <option>SGAD - FCD</option>
        <option>SGAD - CPC</option>
      </select>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) =>
          setConfirm(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleRegister();
          }
        }}
      />

      <p className="security-note">
        Password Strength: {getStrength()}
      </p>

      <button
        onClick={handleRegister}
        disabled={loading}
      >
        {loading
          ? "Creating..."
          : "Register"}
      </button>

      <p
        style={{
          marginTop: "12px",
          fontSize: "13px"
        }}
      >
        Already have an account?{" "}
        <span
          style={{
            color: "#60a5fa",
            cursor: "pointer"
          }}
          onClick={() =>
            navigate("/login")
          }
        >
          Login
        </span>
      </p>

    </div>

  </div>

</div>


);
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../services/api";
import { logAuditEvent } from "../services/auditService";
import "../styles/login.css";
import Swal from "sweetalert2";

export default function Login() {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

const navigate = useNavigate();
const { login } = useAuth();

const handleLogin = async () => {


if (!email || !password) {
  return Swal.fire({
    icon: "warning",
    title: "Missing Information",
    text: "Please enter both email and password.",
    confirmButtonColor: "#2563eb"
  });
}

try {

  setLoading(true);

  const res = await apiRequest(
    "/auth/login",
    "POST",
    {
      email,
      password
    }
  );

  console.log("LOGIN RESPONSE FULL:", res);

  // Validate login response
  if (!res?.user || !res?.token) {
    throw new Error(
      res?.message ||
      "Invalid login response"
    );
  }

  // Save user session
  login(
    res.user,
    res.token
  );

  // Audit log
  logAuditEvent(
    "LOGIN_SUCCESS",
    {
      email,
      role: res.user.role,
      department: res.user.department
    }
  );

  // Success popup
  await Swal.fire({
    icon: "success",
    title: "Login Successful",
    text: `Welcome ${res.user.name}`,
    timer: 1500,
    showConfirmButton: false
  });

  // Role based routing
  if (res.user.role === "executive") {
    navigate("/executive-dashboard");
  }
  else if (res.user.role === "admin") {
    navigate("/admin");
  }
  else {
    navigate("/dashboard");
  }

} catch (err) {

  console.error(
    "LOGIN ERROR:",
    err
  );

  logAuditEvent(
    "LOGIN_ERROR",
    { email }
  );

  let message =
    "Invalid email or password";

  if (
    err?.response?.data?.message
  ) {
    message =
      err.response.data.message;
  }
  else if (
    err?.message
  ) {
    message =
      err.message;
  }

  Swal.fire({
    icon: "error",
    title: "Authentication Failed",
    text: message,
    confirmButtonColor: "#dc2626"
  });

} finally {

  setLoading(false);

}


};

return (
  <div className="auth-overlay">

  <div className="auth-left">

    <span className="platform-tag">
      ENTERPRISE GOVERNANCE PLATFORM
    </span>

    <h1>INVISOR</h1>

    <p className="platform-subtitle">
      Enterprise Governance Intelligence Platform
    </p>

    <div className="platform-features">
      <div>✓ Governance Transparency</div>
      <div>✓ Audit Traceability</div>
      <div>✓ Operational Resilience</div>
      <div>✓ Executive Decision Intelligence</div>
    </div>

    <p className="platform-description">
      Built to support enterprise governance,
      policy compliance, operational resilience,
      audit readiness and risk-aware decision making.
    </p>

  </div>

  <div className="auth-right">

    <div className="auth-modal">

      <h2>Secure Login</h2>

      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >

        <input
          type="email"
          placeholder="Corporate Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />

      </form>

      <button
        onClick={handleLogin}
        disabled={loading}
      >
        {loading
          ? "Authenticating..."
          : "Login"}
      </button>

      <p
        style={{
          marginTop: "12px",
          fontSize: "13px",
          opacity: 0.8
        }}
      >
        Not registered?{" "}
        <span
          style={{
            color: "#60a5fa",
            cursor: "pointer"
          }}
          onClick={() =>
            navigate("/register")
          }
        >
          Create account
        </span>
      </p>

      <p className="security-note">
        Activity monitored • Audit enabled
      </p>

    </div>

  </div>

</div>


);
}

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";

const AuthBox = ({ register }) => {
  const { getCurrentUser, user } = useGlobalContext();
  const navigate = useNavigate();
  const [role,setRole]=React.useState("")
  const [location,setLocation]=React.useState("")
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [errors, setErrors] = React.useState({});



  React.useEffect(() => {
    if (user && navigate) {
      if(user.role === 'Collector'){
        navigate("/admin");
      }else if(user.role === 'User'){
        navigate("/users");
      }else {
        navigate('/')
      }        
    }
  }, [user, navigate]);

  // console.log(user);




  const onSubmit = (e) => {
    e.preventDefault();

    let data = {};

    if (register) {
      data = {
        name,
        role,
        email,
        password,
        confirmPassword,
        location
      };
    } else {
      data = {
        email,
        password,
      };
    }

    axios
      .post(register ? "/api/auth/register" : "/api/auth/login", data)
      .then(() => {
        getCurrentUser();
      })
      .catch((err) => {

        if (err?.response?.data) {
          setErrors(err.response.data);
        }
      });
  };

  return (
    <div className="auth">
      <div className="auth__box">
        <div className="auth__header">
          <h1>{register ? "Register" : "Login"}</h1>
        </div>

        <form onSubmit={onSubmit}>
          {register && (
            <div className="auth__field">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {errors.name && <p className="auth__error">{errors.name}</p>}
            </div>
          )}

          {register && (
            <div className="auth__field">
              <label>Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />


              {errors.name && <p className="auth__error">{errors.role}</p>}
            </div>

            
          )}

          {register && (
            <div className="auth__field">
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />


              {errors.name && <p className="auth__error">{errors.location}</p>}
            </div>

            
          )}

          <div className="auth__field">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {errors.email && <p className="auth__error">{errors.email}</p>}
          </div>

          <div className="auth__field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {errors.password && (
              <p className="auth__error">{errors.password}</p>
            )}
          </div>

          {register && (
            <div className="auth__field">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {errors.confirmPassword && (
                <p className="auth__error">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <div className="auth__footer">
            {Object.keys(errors).length > 0 && (
              <p className="auth__error">
                {register ? "You have some validation errors" : errors.error}
              </p>
            )}

            <button className="btn" type="submit" >
              {register ? "Register" : "Login"}
            </button>

            {!register ? (
              <div className="auth__register">
                <p>
                  Not a member? <Link to="/register">Register now</Link>
                </p>
              </div>
            ) : (
              <div className="auth__register">
                <p>
                  Already a member? <Link to="/">Login now</Link>
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthBox;
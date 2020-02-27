import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
class Login extends Component {
  state = {
    user: { email: "", password: "" },
    errors: {}
  };
  validateProperty = (name, value) => {
    const { errors, user } = this.state;
    user[name] = value;
    if (name === "email") {
      // eslint-disable-next-line no-useless-escape
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!value.trim()) {
        errors[name] = "Email can't be empty";
        // this.setState({ errors });
      } else if (regex.test(value.trim())) {
        
        delete errors[name];
        // this.setState({ errors, user });
      } else {
        errors[name] = "Please enter a valid email address.";
        // this.setState({ errors });
      }
    } else {
      // eslint-disable-next-line no-useless-escape
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
      if (!value.trim()) {
        errors[name] = "Password can't be empty";
        // this.setState({ errors });
      } else if (regex.test(value.trim())) {
        // user[name] = value;
        delete errors[name];
        this.setState({ errors, user });
      } else {
        errors[name] =
          "Password must be at least 8 characters long and must contains 1 lowercase character, 1 uppercase character, 1 numeric character and 1 special character.";
        // this.setState({ errors });
      }
    }
    this.setState({ user, errors})
  };
  handleSubmit = e => {
    e.preventDefault();
    const { user } = this.state;
    Object.keys(user).forEach(field =>
      this.validateProperty(field, user[field])
    );
    if (!Object.keys(this.state.errors).length) {
      this.props.checkUser(user);
    }
  };
  
  render() {
    console.log(this.props)
    const user = localStorage.getItem("user")
    if(user){
      this.props.history.replace("/home")
    }
    return (
      <>
        <h1>Log In</h1>
        {this.props.userError && (
          <div
            style={{
              backgroundColor: "#d18a8a",
              borderColor: "red",
              padding: 15,
              borderRadius: 5,
              marginBottom: 12
            }}
          >
            {this.props.userError}
          </div>
        )}
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              onChange={e =>
                this.validateProperty(e.target.name, e.target.value)
              }
            />
            <small className="text-sm text-danger">
              {this.state.errors["email"]}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              onChange={e =>
                this.validateProperty(e.target.name, e.target.value)
              }
            />
            <small className="text-sm text-danger">
              {this.state.errors["password"]}
            </small>
          </div>
          <button className="btn btn-primary" onClick={this.handleClick}>
            Sign In
          </button>
        </form>
        <p className="my-2">
          Don't have account? <Link to="/signup">Sign Up</Link>
        </p>
      </>
    );
  }
}

export default withRouter(Login);

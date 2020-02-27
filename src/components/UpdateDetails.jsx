import React, { Component } from "react";
class SignUp extends Component {
  state = {
    user: {
      firstName: "",
      lastName: "",
      dob: "",
      email: "",
      password: ""
    },
    errors: {},
    confirmPassword: "",
    passwordError: ""
  };
  validateProperty = (name, value) => {
    const { errors, user } = this.state;
    if(name !== "confirmPassword")
    user[name] = value;
    // eslint-disable-next-line default-case
    switch (name) {
      case "firstName":
      case "lastName": {
        let regex = /^[a-z ,.'-]+$/i;
        const nameUser = name === "firstName" ? "First Name" : "Last Name";
        if (!value.trim()) {
          errors[name] = `${nameUser} cannot be empty.`;
          // this.setState({ errors });
        } else if (value.trim().length < 2) {
          errors[name] = `${nameUser} must be at least 2 characters long.`;
          // this.setState({ errors });
        } else if (regex.test(value.trim())) {
          delete errors[name];
          // this.setState({ errors, user });
        } else {
          errors[
            name
          ] = `${nameUser} contains alphanumeric charaters or ,.'- only`;
          // this.setState({ errors });
        }
        break;
      }
      case "dob": {
        if (!value) {
          errors["dob"] = "Please enter your date of birth";
          // this.setState({ errors });
        } else {
          delete errors["dob"];

          // this.setState({ errors, user });
        }
        break;
      }
      case "email": {
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
        break;
      }
      case "password": {
        // eslint-disable-next-line no-useless-escape
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        if (!value.trim()) {
          errors[name] = "Password can't be empty";
          // this.setState({ errors });
        } else if (regex.test(value.trim())) {
          delete errors[name];
          // this.setState({ errors, user });
        } else {
          errors[name] =
            "Password must be at least 8 characters long and must contains 1 lowercase character, 1 uppercase character, 1 numeric character and 1 special character.";
          // this.setState({ errors });
        }
        break;
      }
      case "confirmPassword": {
        this.setState({confirmPassword : value})
        if (!(user["password"] === value)) {
          this.setState({
            passwordError: "Passwords didn't match. Try again."
          });
        } else if (!value.trim()) {
          this.setState({
            passwordError: "Confirm Password can't be empty."
          });
        } else {
          this.setState({ passwordError: "", confirmPassword: value });
        }
        break;
      }
    }
    this.setState({ user, errors });
  };
  handleSubmit = e => {
    e.preventDefault();
    const { user } = this.state;
    Object.keys(user).forEach(field =>
      this.validateProperty(field, user[field])
    );
    if (!this.state.confirmPassword.trim()) {
      this.setState({ passwordError: "Confirm Password can't be empty." });
    } else if (this.state.confirmPassword !== this.state.user["password"]) {
      this.setState({ passwordError: "Passwords didn't match. Try again." });
    }
    if (!Object.keys(this.state.errors).length || !this.state.passwordError) {
      localStorage.setItem("user", JSON.stringify(this.state.user))
      const users = JSON.parse(localStorage.getItem("users"))
      console.log(users)
      const index = users.findIndex(el=>el.id === user.id) 
      users[index] = this.state.user
      localStorage.setItem("users", JSON.stringify(users))
      this.props.history.push("/home")
      // this.props.addUser(this.state.user)
    }
  };
  componentDidMount() {
    console.log(this.props)
    const user = JSON.parse(localStorage.getItem("user"));
    this.setState({ user });
  }
  render() {
    const { user } = this.state;
    const localUser = localStorage.getItem("user")
    if(!localUser){
      this.props.history.push("/login");
    }
    return (
      <>
        <h1 className="my-3">Update Details</h1>
        {/* {this.state.passwordError && (
          <div
            style={{
              backgroundColor: "#d18a8a",
              border: "1px solid red",
              color: "white",
              padding: 10,
              borderRadius: 5,
              textAlign: "center"
            }}
          >
            {this.state.passwordError}
          </div>
        )} */}
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={user.firstName}
              onChange={e =>
                this.validateProperty(e.target.name, e.target.value)
              }
              className="form-control"
            />
            <small className="text-sm text-danger">
              {this.state.errors["firstName"]}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={user.lastName}
              onChange={e =>
                this.validateProperty(e.target.name, e.target.value)
              }
              className="form-control"
            />
            <small className="text-sm text-danger">
              {this.state.errors["lastName"]}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date Of Birth</label>
            <input
              type="date"
              name="dob"
              id="dob"
              value={user.dob}
              onChange={e =>
                this.validateProperty(e.target.name, e.target.value)
              }
              className="form-control"
            />
            <small className="text-sm text-danger">
              {this.state.errors["dob"]}
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={user.email}
              onChange={e =>
                this.validateProperty(e.target.name, e.target.value)
              }
              className="form-control"
            />
            <small className="text-sm text-danger">
              {this.state.errors["email"]}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={e =>
                this.validateProperty(e.target.name, e.target.value)
              }
              className="form-control"
            />
            <small className="text-sm text-danger">
              {this.state.errors["password"]}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={this.state.confirmPassword}
              onChange={e =>
                this.validateProperty(e.target.name, e.target.value)
              }
              className="form-control"
            />
            <small className="text-sm text-danger">
              {this.state.passwordError}
            </small>
          </div>
          <button className="btn btn-primary">Update</button>
        </form>
      </>
    );
  }
}

export default SignUp;
import React, { Component } from "react";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("user")),
      update: false,
      updateField: null,
      passwordError: "",
      password: ""
    };
  }
  getPassword = () => {
    this.setState({ update: true });
  };
  handlePasswordSubmit = e => {
    e.preventDefault()
    this.validatePassword(this.state.password)
    if(!this.state.passwordError){
      const user = JSON.parse(localStorage.getItem("user"))
      if(user["password"] === this.state.password){
        this.props.history.push({pathname : "/update-details", state : {update : true}})
      }
      else{
        this.setState({passwordError : "Incorrect Current Password"})
      }
    }
  }
  validatePassword = value => {
    // eslint-disable-next-line no-useless-escape
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    let { passwordError, password } = this.state;
    password = value;
    if (!value.trim()) {
      passwordError = "Password can't be empty";
      // this.setState({ passwordError });
    } else if (!regex.test(value.trim())) {
      passwordError =
        "Password must be at least 8 characters long and must contains 1 lowercase character, 1 uppercase character, 1 numeric character and 1 special character.";
      // this.setState({ errors });
    }
    else{
      passwordError = ""
    }
    this.setState({ passwordError, password });
  };
  render() {
    if (!this.state.user) {
      this.props.history.push("/login");
    }
    let { password = "" } = this.state.user;
    password = password
      .split("")
      .map(c => "*")
      .join("");
    let input = null;
    if (this.state.update) {
      input = (
        <form className="my-3" onSubmit={this.handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Enter your Current Password</label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              onChange={e => this.validatePassword(e.target.value)}
              className="form-control"
            />
            <small className="text-sm text-danger">
              {this.state.passwordError}
            </small>
          </div>
          <button className="btn btn-info">Submit</button>
        </form>
      );
    }
    const {user} = this.state
    const keys = Object.keys(user).filter(el=>el!== "id")
    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Field</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{key}</td>
                <td>{key === "password" ? password : this.state.user[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={this.getPassword}>
          Update details
        </button>
        {input}
      </div>
    );
  }
}

export default Home;

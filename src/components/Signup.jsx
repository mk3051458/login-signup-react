import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class SignUp extends Component {
	constructor(props) {
		super(props);
		const user = localStorage.getItem("user");
		if (user) {
			this.props.history.push("/home");
		}
		this.state = {
			user: {
				firstName: "",
				lastName: "",
				dob: "",
				email: "",
				password: "",
				phone : "",
				gender : ""
			},
			errors: {},
			confirmPassword: "",
			passwordError: ""
		};
	}

	validateProperty = (name, value) => {
		const { errors, user } = this.state;		
		// eslint-disable-next-line default-case
		switch (name) {
			case "firstName":
			case "lastName": {
				let regex = /^[a-z ,.'-]+$/i;
				user[name] = value;
				const nameUser =
					name === "firstName" ? "First Name" : "Last Name";
				if(value === ""){
					errors[
						name
					] = `Please enter your ${nameUser}`;
				}
				else if (value.trim().length < 2) {
					errors[
						name
					] = `${nameUser} must be at least 2 characters long.`;
				} else if (regex.test(value.trim())) {
					delete errors[name];
				} else {
					errors[
						name
					] = `${nameUser} contains alphanumeric charaters or ,.'- only`;
				}
				break;
			}

			case "dob": {
				user[name] = value;
				const date = new Date();
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const day = String(date.getDate()).padStart(2, "0");
				const year = String(date.getFullYear());
				const dateValue = value.split("-");
				if (
					+dateValue[0] > +year ||
					(+dateValue[0] === +year && +dateValue[1] > +month) ||
					(+dateValue[0] === +year &&
						+dateValue[1] === +month &&
						+dateValue[2] > +day)
				) {
					errors["dob"] =
						"Date of birth should be less than current date";
				} else {
					delete errors["dob"];
				}
				break;
			}

			case "gender" : {
				user[name] = value;
				if(value === ""){
					errors["gender"] = "Please select your gender";
				} else{
					delete errors["gender"]
				}
				break;
			}

			case "phone" : {
				if(value === ""){
					errors["phone"] = "Please enter your contact number.";
					user[name] = value;
				} else{
					const regex = /^[0-9]+$/g;
					if(regex.test(value)){
						user[name] = value;
						if(value.length<8 || value.length > 16){
							errors["phone"] = "Phone number length should be more than 7 characters and less than 17 characters.";
						} else{
							delete errors["phone"]
						}
					}
					
				} 
				break;
			}

			case "email": {
				user[name] = value;
				// eslint-disable-next-line no-useless-escape
				const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				if (regex.test(value.trim())) {
					const users =
						JSON.parse(localStorage.getItem("users")) || [];
					const comp = users.filter(obj => obj.email === value);
					if (comp.length) {
						errors[name] = "Email already registered.";
					} else {
						delete errors[name];
					}
				} else {
					errors[name] = "Please enter a valid email address.";
				}
				break;
			}

			case "password": {
				user[name] = value;
				// eslint-disable-next-line no-useless-escape
				const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
				if (regex.test(value.trim())) {
					delete errors[name];
				} else {
					errors[name] =
						"Password must be at least 8 characters long and must contains 1 lowercase character, 1 uppercase character, 1 numeric character and 1 special character.";
				}
				break;
			}

			case "confirmPassword": {
				let { passwordError, confirmPassword } = this.state;
				if (!(user["password"] === value)) {
					passwordError = "Passwords didn't match. Try again.";
				} else if (!value.trim()) {
					passwordError = "Confirm Password can't be empty.";
				} else {
					passwordError = "";
					confirmPassword = value;
				}
				this.setState({ passwordError, confirmPassword });
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
			this.setState({
				passwordError: "Confirm Password can't be empty."
			});
		} else if (this.state.confirmPassword !== this.state.user["password"]) {
			this.setState({
				passwordError: "Passwords didn't match. Try again."
			});
		}
		if (!Object.keys(this.state.errors).length) {
			this.props.addUser(this.state.user);
		}
	};

	render() {
		return (
			<>
				<h1 className="my-3">SIGN UP</h1>
				<form onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label htmlFor="firstName">First Name</label>
						<input
							type="text"
							name="firstName"
							id="firstName"
							required
							onChange={e =>
								this.validateProperty(
									e.target.name,
									e.target.value
								)
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
							required
							onChange={e =>
								this.validateProperty(
									e.target.name,
									e.target.value
								)
							}
							className="form-control"
						/>
						<small className="text-sm text-danger">
							{this.state.errors["lastName"]}
						</small>
					</div>
					<div className="form-group">
						<label htmlFor="lastName">Phone Number</label>
						<input
							type="tel"
							name="phone"
							id="phone"
							required
							value={this.state.user.phone}
							onChange={e =>
								this.validateProperty(
									e.target.name,
									e.target.value
								)
							}
							className="form-control"
						/>
						<small className="text-sm text-danger">
							{this.state.errors["phone"]}
						</small>
					</div>
					<div className="form-group">
						<label htmlFor="gender">Gender</label>
						<select
							name="gender"
							id="gender"
							value={this.state.user.gender}
							className="form-control"
							onChange={e =>
								this.validateProperty(
									e.target.name,
									e.target.value
								)
							}
							required
						>
							<option></option>
							<option value="male">Male</option>
							<option value="female">Female</option>
							<option value="others">Others</option>
						</select>
						<small className="text-sm text-danger">
							{this.state.errors["gender"]}
						</small>
					</div>
					<div className="form-group">
						<label htmlFor="dob">Date Of Birth</label>
						<input
							type="date"
							name="dob"
							id="dob"
							required
							max="2002-12-31"
							min="1920-01-01"
							onChange={e =>
								this.validateProperty(
									e.target.name,
									e.target.value
								)
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
							autoComplete="off"
							id="email"
							required
							onChange={e =>
								this.validateProperty(
									e.target.name,
									e.target.value
								)
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
							required
							onChange={e =>
								this.validateProperty(
									e.target.name,
									e.target.value
								)
							}
							className="form-control"
						/>
						<small className="text-sm text-danger">
							{this.state.errors["password"]}
						</small>
					</div>
					<div className="form-group">
						<label htmlFor="confirmPassword">
							Confirm Password
						</label>
						<input
							type="password"
							name="confirmPassword"
							id="confirmPassword"
							required
							onChange={e =>
								this.validateProperty(
									e.target.name,
									e.target.value
								)
							}
							className="form-control"
						/>
						<small className="text-sm text-danger">
							{this.state.passwordError}
						</small>
					</div>
					<button className="btn btn-primary">Sign Up</button>
				</form>
			</>
		);
	}
}

export default withRouter(SignUp);

import React, { Component } from "react";
import { withRouter } from 'react-router-dom'

class SignUp extends Component {
	constructor(props) {
		super(props);
		const localUser = localStorage.getItem("user");
		if (!localUser) {
			this.props.history.push("/login");
		
		
		// console.log(this.props.location)
		} else if(!this.props.location.state){
			this.props.history.push("/home");
		}
		
		this.state = {
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
	}

	validateProperty = (name, value) => {
		const { errors, user } = this.state;
		if (name !== "confirmPassword") user[name] = value;
		// eslint-disable-next-line default-case
		switch (name) {
			case "firstName":
			case "lastName": {
				let regex = /^[a-z ,.'-]+$/i;
				const nameUser =
					name === "firstName" ? "First Name" : "Last Name";
				if (value.trim().length < 2) {
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
				const date = new Date();
				const month = String(date.getMonth()).padStart(2, "0");
				const day = String(date.getDate()).padStart(2, "0");
				const year = String(date.getFullYear());
				const dateValue = value.split("-");
				if (
					+dateValue[0] > +year ||
					(+dateValue[0] > +year && +dateValue[1] > +month) ||
					+dateValue[0] > +year ||
					(+dateValue[1] > +month && +dateValue[2] > +day)
				) {
					errors["dob"] =
						"Date of birth should be less than current date";
				} else {
					console.log("Inside else");
					delete errors["dob"];
				}
				break;
			}

			case "email": {
				// eslint-disable-next-line no-useless-escape
				const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				if (regex.test(value.trim())) {
					delete errors[name];
				} else {
					errors[name] = "Please enter a valid email address.";
				}
				break;
			}

			case "password": {
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
				let { passwordError } = this.state;
				if (!(user["password"] === value)) {
					passwordError = "Passwords didn't match. Try again.";
				} else {
					passwordError = "";
				}
				this.setState({ confirmPassword: value, passwordError });
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
		if (
			!Object.keys(this.state.errors).length ||
			!this.state.passwordError
		) {
			localStorage.setItem("user", JSON.stringify(this.state.user));
			const users = JSON.parse(localStorage.getItem("users"));
			const index = users.findIndex(el => el.id === user.id);
			users[index] = this.state.user;
			localStorage.setItem("users", JSON.stringify(users));
			this.props.history.push("/home");
		}
	};

	componentDidMount() {
		const user = JSON.parse(localStorage.getItem("user"));
		this.setState({ user });
	}

	render() {
		const { user } = this.state;
		return (
			<>
				<h1 className="my-3">Update Details</h1>
				<form onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label htmlFor="firstName">First Name</label>
						<input
							type="text"
							name="firstName"
							id="firstName"
							required
							value={user.firstName}
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
							value={user.lastName}
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
						<label htmlFor="dob">Date Of Birth</label>
						<input
							type="date"
							name="dob"
							id="dob"
							required
							value={user.dob}
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
							id="email"
							required
							value={user.email}
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
							value={user.password}
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
							value={this.state.confirmPassword}
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
					<button className="btn btn-primary">Update</button>
				</form>
			</>
		);
	}
}

export default withRouter(SignUp);

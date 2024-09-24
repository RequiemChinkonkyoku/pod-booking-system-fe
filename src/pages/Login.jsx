import { useFormik } from "formik";
import * as Yup from "yup";
import "../assets/css/material-dashboard.min.css";
import Head from "../components/Head";
import bg from "../assets/img/login.jpg";
import FooterHome from "../components/FooterHome";
import NavbarHome from "../components/NavbarHome";

const Login = () => {
  const formik = useFormik({
    initialValues: {
      // firstName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, "Must be at least 2 characters")
        .required("First Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Form submitted", values);
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <>
      <Head />
      <NavbarHome />
      <div className="off-canvas-sidebar">
        <div className="wrapper wrapper-full-page">
          <div
            className="page-header login-page header-filter"
            filter-color="black"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "100vh",
            }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-8 ml-auto mr-auto">
                  <form className="form" onSubmit={formik.handleSubmit}>
                    <div className="card card-login">
                      <div className="card-header card-header-rose text-center">
                        <h4 className="card-title">Login</h4>
                        <div className="social-line">
                          <a
                            href="#pablo"
                            className="btn btn-just-icon btn-link btn-white"
                          >
                            <i className="fa fa-facebook-square"></i>
                          </a>
                          <a
                            href="#pablo"
                            className="btn btn-just-icon btn-link btn-white"
                          >
                            <i className="fa fa-twitter"></i>
                          </a>
                          <a
                            href="#pablo"
                            className="btn btn-just-icon btn-link btn-white"
                          >
                            <i className="fa fa-google-plus"></i>
                          </a>
                        </div>
                      </div>
                      <div className="card-body ">
                        <p className="card-description text-center">
                          Or Be Classical
                        </p>
                        {/* <div className="bmd-form-group">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="material-icons">face</i>
                              </span>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="First Name..."
                              name="firstName"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.firstName}
                            />
                          </div>
                          {formik.touched.firstName &&
                          formik.errors.firstName ? (
                            <div className="text-danger">
                              {formik.errors.firstName}
                            </div>
                          ) : null}
                        </div> */}
                        <div className="bmd-form-group">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="material-icons">email</i>
                              </span>
                            </div>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Email..."
                              name="email"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.email}
                            />
                          </div>
                          {formik.touched.email && formik.errors.email ? (
                            <div className="text-danger">
                              {formik.errors.email}
                            </div>
                          ) : null}
                        </div>
                        <div className="bmd-form-group">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="material-icons">lock_outline</i>
                              </span>
                            </div>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="Password..."
                              name="password"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.password}
                            />
                          </div>
                          {formik.touched.password && formik.errors.password ? (
                            <div className="text-danger">
                              {formik.errors.password}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="card-footer justify-content-center">
                        <button
                          onClick={console.log("Button clicked")}
                          type="submit"
                          className="btn btn-rose btn-lg"
                        >
                          Let's Go
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterHome />
      </div>
    </>
  );
};

export default Login;

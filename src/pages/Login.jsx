import { useState } from "react";
import "../assets/css/material-dashboard.min.css";
import Head from "../components/Head";
import bg from "../assets/img/login.jpg";
import FooterHome from "../components/FooterHome";
import NavbarHome from "../components/NavbarHome";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Head />
      <NavbarHome />
      <body class="off-canvas-sidebar">
        <div class="wrapper wrapper-full-page">
          <div
            class="page-header login-page header-filter"
            filter-color="black"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "100vh",
            }}
          >
            <div class="container">
              <div class="row">
                <div class="col-lg-4 col-md-6 col-sm-8 ml-auto mr-auto">
                  <form class="form" method="" action="">
                    <div class="card card-login">
                      <div class="card-header card-header-rose text-center">
                        <h4 class="card-title">Login</h4>
                        <div class="social-line">
                          <a
                            href="#pablo"
                            class="btn btn-just-icon btn-link btn-white"
                          >
                            <i class="fa fa-facebook-square"></i>
                          </a>
                          <a
                            href="#pablo"
                            class="btn btn-just-icon btn-link btn-white"
                          >
                            <i class="fa fa-twitter"></i>
                          </a>
                          <a
                            href="#pablo"
                            class="btn btn-just-icon btn-link btn-white"
                          >
                            <i class="fa fa-google-plus"></i>
                          </a>
                        </div>
                      </div>
                      <div class="card-body ">
                        <p class="card-description text-center">
                          Or Be Classical
                        </p>
                        <span class="bmd-form-group">
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text">
                                <i class="material-icons">face</i>
                              </span>
                            </div>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="First Name..."
                            />
                          </div>
                        </span>
                        <span class="bmd-form-group">
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text">
                                <i class="material-icons">email</i>
                              </span>
                            </div>
                            <input
                              type="email"
                              class="form-control"
                              placeholder="Email..."
                            />
                          </div>
                        </span>
                        <span class="bmd-form-group">
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text">
                                <i class="material-icons">lock_outline</i>
                              </span>
                            </div>
                            <input
                              type="password"
                              class="form-control"
                              placeholder="Password..."
                            />
                          </div>
                        </span>
                      </div>
                      <div class="card-footer justify-content-center">
                        <a href="#pablo" class="btn btn-rose btn-link btn-lg">
                          Lets Go
                        </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterHome />
      </body>
    </>
  );
}

export default App;

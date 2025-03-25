import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { Row } from "react-bootstrap";
import "../Styles/footer.css";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquarePinterest } from "react-icons/fa6";
import axios from "axios";

const Footer = () => {
  // =========================SOCIAL MEDIA==============================//
  //integrating get  method contact us
  const [Addsocial, setAddsocial] = useState([]);
  const getAddsocial = async () => {
    try {
      let res = await axios.get(
        "https://dailydishbangalore.com/api/admin/getsocial"
      );
      if (res.status === 200) {
        setAddsocial(res.data.getsocial);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAddsocial();
  }, []);

  return (
    <div>
      {" "}
      {/* <div className="footer-container mt-3"> */}
        <Container fluid>
          {/* <Row>
            <div className="col-md-4">
              <div style={{ textAlign: "left" }}>
              <div className="col-md-5">
              <div className="logoo">
                  <span class="alx">Daily Dish</span>
                </div>
              </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="links">
                <h3 style={{ fontWeight: "bold" }}>Quick Links</h3>
                <ul className="quick-links-item">
                  <li>
                    <div>
                      <a
                        href="/aboutus"
                        style={{ color: "unset", textDecoration: "none" }}
                      >
                        About
                      </a>
                    </div>
                  </li>
                  <li>
                    <div>
                      <a
                        href="/contactus"
                        style={{ color: "unset", textDecoration: "none" }}
                      >
                        Contactus
                      </a>
                    </div>
                  </li>
                  <li>
                    <div>
                      <a
                        href="/privacy"
                        style={{ color: "unset", textDecoration: "none" }}
                      >
                        Privacy
                      </a>
                    </div>
                  </li>

                  <li>
                    <div>
                      <a
                        href="/terms"
                        style={{ color: "unset", textDecoration: "none" }}
                      >
                        {" "}
                        Terms{" "}
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-4">
              <div className="contact-us-tab">
              <div className="f-contct">
                <h3 style={{ fontWeight: "bold" }}>Contact Us</h3>
                  <div className="d-flex gap-1 mb-3">
                    {Addsocial?.map((items, i) => {
                      return (
                        <div className="row" key={i}>
                          <a href={items.CLink}>
                            <img
                              src={`https://dailydishbangalore.com/Socialmedia/${items?.CIcon}`}
                              alt="social-icon"
                              style={{ width: "55px", height: "55px" }}
                            />
                          </a>
                        </div>
                      );
                    })}
                  </div>
              </div>

              <div style={{
                padding: "0px 12px"
              }}>
                <Button variant="" className="green-button">
                  Download App
                </Button>
                <div className="download-apps">
                  <div className="mt-2 mb-2">
                    <img
                      src="Assets/applestore.jpg"
                      alt=""
                      className="playstore"
                    />
                  </div>

                  <div className="mt-2 mb-2">
                    <img
                      src="Assets/playstore.jpg"
                      alt=""
                      className="playstore"
                    />
                  </div>
                </div>
              </div>
              </div>
            </div>
          </Row> */}

          {/* <Row>
            <div className="end-title mt-3 " style={{ textAlign: "center" }}>
              <p>© 2024 Daily Dish. All Right Reserved.</p>
            </div>
          </Row> */}
         

        <div className="row justify-content-center text-center mt-3 mb-2">
            {/* <div className="col-md-4 mb-2">
              <h6>Address</h6>
            </div> */}

            <div className="col-md-4 mb-2">
              <p>© 2024 CHEF STUDIO INNOVATIONS all rights reserved.
              </p>
            </div>

            {/* <div className="col-md-4 mb-2">
              <h6>Follow us.
              </h6>
            </div> */}
          </div>
          </Container>

      </div>
    // </div>
  );
};

export default Footer;

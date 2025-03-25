import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Image } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import "../Admin/Admin.css";
import axios from "axios";
import moment from "moment";

const WebStory = () => {
  // Add modal for Banner
  const [show3, setShow3] = useState();
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

  // Delet modal for  Banner
  const [show5, setShow5] = useState();
  const handleClose5 = () => setShow5(false);
  const handleShow5 = () => setShow5(true);

  // ======INTEGRATION=======//

  // integrating post method
  const formdata = new FormData();
  const [StoriesImage, setStoriesImage] = useState("");
  const [StoriesText, setStoriesText] = useState("");

  const AddWebstorydata = async () => {

    if (!StoriesImage) {
      return alert("Please add an image.");
    }

    // Check if StoriesImage is a valid image file
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (!allowedImageTypes.includes(StoriesImage.type)) {
      return alert("Invalid file type. Please upload an image (JPEG, PNG, JPG, or GIF).");
    }

    // Validate StoriesText
    if (!StoriesText) {
      return alert("Please add a title.");
    }


    formdata.append("StoriesImage", StoriesImage);
    formdata.append("StoriesText", StoriesText);

    try {
      if (!StoriesImage) {
        return alert("Please add Image");
      }
      if (!StoriesText) {
        return alert("Please add Title");
      }
      const config = {
        url: "/admin/Addstories",
        method: "post",
        baseURL: "https://dailydishbangalore.com/api",
        header: { "content-type": "multipart/form-data" },
        data: formdata,
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert(res.data.success);
        getAddWebstory();
        handleClose3();
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };
  //integrating get  method
  const [AddWebstory, setAddWebstory] = useState([]);
  const getAddWebstory = async () => {
    try {
      let res = await axios.get("https://dailydishbangalore.com/api/admin/getstories");
      if (res.status === 200) {
        setAddWebstory(res.data.getbanner.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete method
  const [Data, setData] = useState("");
  const DeleteWebstory = async () => {
    try {
      const config = {
        url: "admin/Deletestories/" + Data,
        method: "delete",
        baseURL: "https://dailydishbangalore.com/api/",
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getAddWebstory();
          handleClose5();
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  //update method
  const [Data1, setData1] = useState("");
  const [show4, setShow4] = useState();
  const handleClose4 = () => setShow4(false);
  const handleShow4 = (items) => {
    setShow4(true);
    setData1(items);
    setStoriesImage(items?.StoriesImage);
    setStoriesText(items?.StoriesText);
  };

  const EditStory = async (e) => {
    e.preventDefault();
    formdata.append("StoriesImage", StoriesImage);
    formdata.append("StoriesText", StoriesText);
    formdata.append("id", Data1?._id);
    try {
      const config = {
        url: "admin/editstories",
        method: "put",
        baseURL: "https://dailydishbangalore.com/api/",
        header: { "content-type": "multipart/form-data" },
        data: formdata,
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("successfully Update");
          handleClose4();
          getAddWebstory();
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.error);
    }
  };

  useEffect(() => {
    getAddWebstory();
  }, []);

  return (
    <div>
      <div className="customerhead p-2">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="header-c ">Web Story</h2>
          {/* {AddWebstory?.length > 4 ? (
            <></>
          ) : ( */}
            <>
              <Button variant="success" onClick={handleShow3}>
                + ADD
              </Button>
            </>
          {/* )} */}
        </div>

        <div className="mb-3">
          <Table
            responsive
            bordered
            style={{ width: "-webkit-fill-available" }}
          >
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Image</th>
                <th>Text</th>
                <th>Date / Time</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {AddWebstory?.map((item, i) => {
                return (
                  <tr key={i}>
                    <td style={{ paddingTop: "20px" }}> {i + 1}</td>
                    <td style={{ paddingTop: "20px" }}>
                      <Image
                        src={`https://dailydishbangalore.com/Webstories/${item?.StoriesImage}`}
                        alt="pic"
                        style={{ width: "65px", height: "65px" }}
                      />
                    </td>
                    <td style={{ paddingTop: "20px" }}>{item?.StoriesText}</td>
                    <td style={{ paddingTop: "20px" }}>
                      {moment(item?.createdAt).format("MM/DD/YYYY, h:mm A")}
                    </td>

                    <td style={{ paddingTop: "20px" }}>
                      {" "}
                      <div
                        style={{
                          display: "flex",
                          gap: "20px",
                          justifyContent: "center",
                        }}
                      >
                        <div>
                          <BiSolidEdit
                            className="text-success"
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() => {
                              handleShow4(item);
                              setData1(item);
                            }}
                          />{" "}
                        </div>
                        <div>
                          <AiFillDelete
                            className="text-danger"
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() => {
                              handleShow5();
                              setData(item?._id);
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        {/* Add Package modal for Banner */}
        <Modal show={show3} onHide={handleClose3} style={{ zIndex: "99999" }}>
          <Modal.Header closeButton>
            <Modal.Title>Add Web Story</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="do-sear mt-2">
                <label>Add Image</label>
                <input
                  type="file"
                  name=""
                  id=""
                  className="vi_0"
                  onChange={(e) => setStoriesImage(e.target.files[0])}
                />
              </div>
            </div>
            <div className="row">
              <div className="do-sear mt-2">
                <label>Add Text</label>
                <input
                  type="text"
                  className="vi_0"
                  placeholder="Enter Text"
                  onChange={(e) => setStoriesText(e.target.value)}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex">
              <Button
                className="mx-2 modal-close-btn"
                variant=""
                onClick={handleClose3}
              >
                Close
              </Button>
              <Button
                className="mx-2 modal-add-btn"
                variant=""
                onClick={AddWebstorydata}
              >
                Add
              </Button>
            </div>
          </Modal.Footer>
        </Modal>

        {/* Edit Package modal for Banner */}
        <Modal
          show={show4}
          onHide={handleClose4}
          backdrop="static"
          keyboard={false}
          style={{ zIndex: "99999" }}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "black" }}>Edit Web Story</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="do-sear mt-2">
                <label>Edit Image</label>
                <input
                  type="file"
                  name=""
                  id=""
                  className="vi_0"
                  onChange={(e) => setStoriesImage(e.target.files[0])}
                />
              </div>
            </div>
            <div className="row">
              <div className="do-sear mt-2">
                <label>Edit Text</label>
                <input
                  type="text"
                  className="vi_0"
                  value={StoriesText}
                  placeholder={Data1.StoriesText}
                  onChange={(e) => setStoriesText(e.target.value)}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant=""
              className="modal-close-btn"
              onClick={handleClose4}
            >
              Close
            </Button>
            <Button variant="" className="modal-add-btn" onClick={EditStory}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>

        {/*Delet Package modal for Banner */}
        <Modal
          show={show5}
          onHide={handleClose5}
          backdrop="static"
          keyboard={false}
          style={{ zIndex: "99999" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-12">
                <p className="fs-4" style={{ color: "red" }}>
                  Are you sure?
                  <br /> you want to delete this data?
                </p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant=""
              className="modal-close-btn"
              onClick={handleClose5}
            >
              Close
            </Button>
            <Button
              variant=""
              className="modal-add-btn"
              onClick={DeleteWebstory}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default WebStory;

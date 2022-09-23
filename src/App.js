import React, {useState, useEffect} from 'react';
import {Table, Container, Row, Col, Button, ButtonGroup, Form, Navbar} from 'react-bootstrap';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import './App.css';

const api = " http://localhost:5000/employee";

const initialState ={
  name: "",
  email: "",
  contact: "",
  address: "",
};

function App() {
  const [state, setState] = useState(initialState);
  const [data, setData] = useState([]);
  const {name, email, contact, address} = state;
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [])

  const loadUsers = async () =>{
    const response = await axios.get(api);
    setData(response.data);
  };

  //Submit event function
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name || !address || !email || !contact){
      toast.error("Please complete all input");
    }
    else{
      if(!editMode){
        axios.post(api, state); 
        toast.success("Added Successfully");
        setState({name:"", email:"", contact:"", address:"" });
        setTimeout(() => loadUsers(), 500 );
      }else{
        axios.put(`${api}/${userId}`, state); 
        toast.success("Updated Successfully");
        setState({name:"", email:"", contact:"", address:"" });
        setTimeout(() => loadUsers(), 500 );
        setUserId(null);
        setEditMode(false);
      }
      
    }
  }
  
  const handleChange = (e)=>{
    let {name, value} = e.target;
    setState({...state, [name]: value});
  } 

  //Delete function
  const handleDelete = async (id) =>{
    if(window.confirm("Are you sure you want to delete this employee info?")){
      axios.delete(`${api}/${id}`);
      toast.success("Deleted Successfully");
      setTimeout(() => loadUsers(), 500 )
    }
  }
  const handleUpdate = (id) => {
    const singleUser = data.find((item) =>item.id ==id);
    setState({...singleUser});
    setUserId(id);
    setEditMode(true);
  }

  return (
    <>
    <ToastContainer />
    <Navbar bg = "info" variant= "black" className="justify-content-center">
      <Navbar.Brand>
        Pesti Admin-Employee
      </Navbar.Brand>
    </Navbar>
    <Container style = {{marginTop: "70px"}}>
      <Row>
        <Col md={4}>
          <Form onSubmit = {handleSubmit}>
            <Form.Group>
              <Form.Label style={{textAlign: "left"}}>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Name" name="name" value={name} onChange={handleChange}/>
            </Form.Group>

            <Form.Group>
              <Form.Label style={{textAlign: "left"}}>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter Email" name="email" value={email} onChange={handleChange}/>
            </Form.Group>

            <Form.Group>
              <Form.Label style={{textAlign: "left"}}>Contact No.</Form.Label>
              <Form.Control type="text" placeholder="Enter Contact Number" name="contact" value={contact} onChange={handleChange}/>
            </Form.Group>

            <Form.Group>
              <Form.Label style={{textAlign: "left"}}>Address</Form.Label>
              <Form.Control type="text" placeholder="Enter Address" name="address" value={address} onChange={handleChange}/>
            </Form.Group> 
            <div className = "d-grid gap-2 mt-2">
              <Button type="submit" variant = "info" size = "lg">{editMode ? "Update": "Submit"}</Button>
            </div>  

          </Form>
        </Col>
        <Col md={8}>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Id.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact No.</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            {data && data.map((item, index)=>
              <tbody key={index}>
                <tr>
                  <td>{index+1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.contact}</td>
                  <td>{item.address}</td>
                  <td>
                    <ButtonGroup>
                      <Button style={{marginRight: "5px"}} variant = "secondary" onClick = {() => handleUpdate(item.id)}>
                        Update
                      </Button>
                      <Button style={{marginRight: "5px"}} variant = "danger" onClick={() => handleDelete(item.id)}>
                        Delete
                      </Button>

                    </ButtonGroup>

                  </td>
                
                
                </tr>
              </tbody>
            )}
          </Table>
        </Col>
      </Row>
    </Container>









    </>
  );
}

export default App;

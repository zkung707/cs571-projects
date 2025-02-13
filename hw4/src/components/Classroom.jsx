import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import Student from "./Student";

const Classroom = () => {
    const[searchData, setData] = useState([]);
    const [searchName, setName] = useState("");
    const [searchMajor, setMajor] = useState("");
    const [searchInterest, setInterest] = useState("");
    const [page, setPage] = useState(1);
    
    useEffect(() => {
        fetch("https://cs571api.cs.wisc.edu/rest/f24/hw4/students", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(r => r.json())
        .then(d => {
            console.log(d);
            setData(d)
        })
    }, []);

    const filteredData = searchData.filter(Student =>
        (Student.name.first.trim().toLowerCase() + " " + Student.name.last.trim().toLowerCase()).includes(searchName.trim().toLowerCase())
        && Student.major.trim().toLowerCase().includes(searchMajor.trim().toLowerCase())
        && Student.interests.some(interest => interest.trim().toLowerCase().includes(searchInterest.trim().toLowerCase()))
    );

    const changePage = (page) => {
        setPage(page);
    }

    const totalPages = Math.ceil(filteredData.length/24);
    const allPages = [];
    for (let i = 0; i < totalPages; i++) {
        allPages.push(
            <Pagination.Item onClick = { () => changePage(i + 1)} active={page === i + 1} key = {i + 1}>{i + 1}</Pagination.Item>
        );
    }

    return <div>
        <h1>Badger Book</h1>
        <p>Search for students below!</p>
        <hr />
        <Form>
            <Form.Label htmlFor="searchName">Name</Form.Label>
            <Form.Control 
                id="searchName"
                value = {searchName}
                onChange={(e) => {
                    setName(e.target.value);
                    setPage(1);
                }}/>
            <Form.Label htmlFor="searchMajor">Major</Form.Label>
            <Form.Control 
                id="searchMajor"
                value = {searchMajor}
                onChange={(e) => {
                    setMajor(e.target.value);
                    setPage(1);
                }}/>
            <Form.Label htmlFor="searchInterest">Interest</Form.Label>
            <Form.Control 
                id="searchInterest"
                value = {searchInterest}
                onChange={(e) => {
                    setInterest(e.target.value);
                    setPage(1);
                }}/>
            <br />
            <Button variant="neutral" onClick = {() => {
                setName("");
                setMajor("");
                setInterest("");
                setPage(1);
            }}>Reset Search</Button>

        </Form>
        <p>There are {filteredData.length} student(s) matching your search.</p>
        <Container fluid>
            <Row>
                {
                    filteredData.slice(((page) - 1) * 24, page * 24).map(r => <Col xs={12} s={12} md={6} lg={4} xl={3} key={r.id}>
                        <Student {...r}/>
                    </Col>)
                }
            </Row>
        </Container>
        <br/>
        <Pagination>
        <Pagination.Item onClick = { () => changePage(page - 1)} disabled={page===1}>Previous</Pagination.Item>
            {allPages}
            <Pagination.Item onClick = { () => changePage(page + 1)} disabled={page===totalPages}>Next</Pagination.Item>
        </Pagination>
    </div>

}

export default Classroom;
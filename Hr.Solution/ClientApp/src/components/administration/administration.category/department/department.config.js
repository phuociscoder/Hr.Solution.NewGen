import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Container, Image } from "react-bootstrap";
import { DepartmentFilter } from "../../../employees/parts/DepartmentFilter";
import { CustomSelect } from "../../../Common/CustomSelect";

export class DepartmentConfig extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            options: []
        }
    }

    componentDidMount =() => {
        this.testReact();
    }

     formatOptionLabel = ({ value, label, avatar }) => (
        <div style={{ display: "flex" }}>
            <Image src={avatar} width={50}/>
          <div>{label}</div>
        </div>
      );
  

    testReact =() => {
        const options = [
            { id: 1, name: 'Messi', avatar:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR_BSXPlBjoBeJruSaCamv7kQuMNjoIIWX0CITXUVoapFCbRM9g" },
            { id: 2, name: 'Ronaldo', avatar:"https://image.thanhnien.vn/1024/uploaded/gianglao/2021_07_15/ronaldoe28099s_zysf.jpeg" },
            { id: 3, name: 'Xavi', avatar: "https://znews-photo.zadn.vn/w660/Uploaded/ofh_huqfztmf/2020_07_25/xavi1_1.jpg" }
          ];
          this.setState({options: options});
    }

    render =() => {
        return (
            <Container fluid>
                <div className="w-100">
                    <h4>BỘ PHẬN / PHÒNG BAN</h4>
                </div>
                <div className="d-flex container-content">
                    <div className="w-25">
                        <DepartmentFilter />
                    </div>
                    <div className="w-75">
                        <Card className="h-100">
                            <Card.Header>
                                <div className="d-flex align-items-center">
                                    <span>CHI TIẾT</span>
                                    <button className="btn btn-info ml-auto">
                                    Thêm phòng ban
                                </button>
                                </div>
                                
                            </Card.Header>
                            <Card.Body>
                                <div className="w-25">
                                    <label >Mã:</label>
                                    <input type="text" placeholder="Mã phòng ban /bộ phận" className="form-control"></input>
                                    <label className="mt-2">Viết tắt:</label>
                                    <input className="form-control" placeholder="Tên viết tắt"></input>

                                    <label className="mt-2">Tên:</label>
                                    <input type="text" className="form-control" placeholder="Tên phòng ban/ bộ phận"></input>

                                    <label className="mt-2">
                                        Thuộc bộ phận:
                                    </label>
                                    <input type="text" autoComplete className="form-control" placeholder="Tên phòng ban/ bộ phận"></input>
                                    <CustomSelect value={2} options={this.state.options} placeholder="-Chọn người quản lý-"/>

                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <div className="d-flex w-100 justify-content-end">
                                    <button className="btn btn-primary"><FontAwesomeIcon icon={faSave}/> Lưu thay đổi</button>
                                    <button className="btn btn-danger ml-2"><FontAwesomeIcon icon={faSave}/> Hủy bỏ</button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </div>
                </div>
            </Container>
        )
    }
}
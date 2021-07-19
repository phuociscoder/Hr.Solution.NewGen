import React from "react";
import { Col, Jumbotron, Row } from "react-bootstrap";
import { ImageUploader } from "../../Common/ImageUploader";
import { MarialStatus } from "../Constanst";

export class GeneralInformation extends React.Component {
    constructor(props) {
        super(props);
    }

    onChangeImage =(image) => {
        console.log(image);
    }

    render = () => {
        return (
            <Row>
                <Col xs={2}>
                    <Jumbotron fluid className="pl-2 pt-2 pb-2 pr-2 shadow rounded">
                       <ImageUploader onChangeImage={this.onChangeImage} />
                    </Jumbotron>
                </Col>
                <Col >
                    <div className="d-flex d-flex-row flex-wrap">
                        <label> Mã nhân viên:
                            <input type="text" className="form-control flex-fill" placeholder="Mã nhân viên"></input>
                        </label>
                        <label className="ml-3"> Họ:
                            <input type="text" className="form-control" placeholder="Họ nhân viên"></input>
                        </label>
                        <label className="ml-3"> Đệm & Tên:
                            <input type="text" className="form-control" placeholder="đệm và tên nhân viên"></input>
                        </label>
                        <label className="ml-3"> Giới tính:
                            <div>
                                <label>
                                    <input type="radio" checked /> Nam
                                </label>
                                <label className="ml-3">
                                    <input type="radio" /> Nữ
                                </label>
                            </div>

                        </label>
                    </div>

                    <div className="d-flex d-flex-row mt-3 ">
                        <label> Ngày sinh:
                            <input type="date" className="form-control"></input>
                        </label>
                        <label className="ml-3"> Ngày bắt đầu làm việc:
                            <input type="date" className="form-control"></input>
                        </label>
                        <label className="ml-3"> Tình trạng hôn nhân:
                            <select className="form-control">
                                <option key={0} value={0} disabled>- Chọn tình trạng hôn nhân-</option>
                                {
                                    MarialStatus.All.map((item, index) => {
                                        return (<option key={item.id} value={item.id}>{item.name}</option>)
                                    })
                                }
                            </select>
                        </label>
                    </div>

                    <div className="d-flex d-flex-row mt-3">
                    <label> CCCD:
                            <input type="text" className="form-control" placeholder="Số căn cước công dân"></input>
                        </label>
                        <label className="ml-3"> Ngày cấp:
                            <input type="date" className="form-control"></input>
                        </label>
                        <label className="ml-3"> Nơi cấp CCCD:
                            <input type="text" className="form-control flex-fill" style={{width: '400px'}} placeholder="Nơi cấp"></input>
                        </label>
                    </div>

                    <div className="d-flex d-flex-row mt-3">
                    <label> Passport:
                            <input type="text" className="form-control" placeholder="Số passport"></input>
                        </label>
                        <label className="ml-3"> Ngày cấp:
                            <input type="date" className="form-control"></input>
                        </label>
                        <label className="ml-3"> Nơi cấp:
                            <input type="text" className="form-control flex-fill" style={{width: '400px'}} placeholder="Nơi cấp"></input>
                        </label>
                    </div>

                    <div className="d-flex d-flex-row mt-3">
                    <label> Mã số thuế:
                            <input type="text" className="form-control" placeholder="Mã số thuế"></input>
                        </label>
                        <label className="ml-3"> Ngày cấp:
                            <input type="date" className="form-control"></input>
                        </label>
                        <label className="ml-3"> Nơi cấp:
                            <input type="text" className="form-control flex-fill" style={{width: '400px'}} placeholder="Nơi cấp"></input>
                        </label>
                    </div>

                    <div className="d-flex d-flex-row mt-3">
                    <label> Bộ phận:
                           <div className="d-flex inline align-items-center">
                               <p className="text-secondary align-self-center"><b>FHM / FHM.AVI</b> </p>
                               <button className="btn btn-info ml-3">Chọn bộ phận</button>
                           </div>
                        </label>
                    </div>

                    <div className="d-flex d-flex-row mt-3">
                        <label > Chức vụ:
                            <select style={{width: '300px'}} className="form-control">
                                <option key={0} value={0}>
                                    -Chọn chức vụ-
                                </option>
                                <option key={0} value={0}>
                                    Trưởng Bộ Phận
                                </option>
                                <option key={0} value={0}>
                                    Thư ký
                                </option>
                                <option key={0} value={0}>
                                    Nhân Viên
                                </option>
                            </select>
                        </label>
                         <label className="ml-3" > Vị trí công việc:
                            <select style={{width: '300px'}} className="form-control">
                                <option key={0} value={0}>
                                    -Chọn vị trí-
                                </option>
                                <option key={0} value={0}>
                                    Trưởng điều hành
                                </option>
                                <option key={0} value={0}>
                                    Thực tập sinh
                                </option>
                                <option key={0} value={0}>
                                   Thư ký trưởng
                                </option>
                            </select>
                        </label>
                    </div>

                </Col>
            </Row>
        )
    }
}
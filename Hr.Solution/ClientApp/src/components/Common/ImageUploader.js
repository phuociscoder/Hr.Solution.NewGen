import React from "react";
import { Image } from "react-bootstrap";
import FigureImage from "react-bootstrap/esm/FigureImage";
import noImage from '../../assets/no_image.png';
import noUser from '../../assets/no-user.png';

// props: 
//     imageSrc : image,
//     onChangeImage: evt
export class ImageUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSrc: null
        }
    }

    componentDidMount = () => {
        const { imageSrc, width, height, disabled } = this.props;
        if (imageSrc) {
            this.setState({ imageSrc });
        }
        this.setState({ width: width ?? 200, height: height ?? 200, disabled: disabled });

    }

    onImageChange = () => {
        const { onChangeImage } = this.props;
        const { imageSrc } = this.state;
        if (onChangeImage) {
            onChangeImage(imageSrc);
        }
    }

    shouldComponentUpdate = (nextprops) => {
        if (this.props.imageSrc != nextprops.imageSrc) {
            this.setState({ imageSrc: nextprops.imageSrc });
        }
        if (this.props.disabled !== nextprops.disabled) {
            this.setState({ disabled: nextprops.disabled });
        }
        return true;
    }

    onSelected = (e) => {
        const image = e.target.files[0];
        if (!image) return;
        const reader = new FileReader();
        const url = reader.readAsDataURL(image);

        reader.onload = (e) => {
            this.setState({ imageSrc: reader.result }, this.onImageChange);
        }
    }

    onRemoveImage = () => {
        this.setState({ imageSrc: null }, this.onImageChange);
    }

    render = () => {
        const { imageSrc, width, height, disabled } = this.state;
        const { type } = this.props;
        return (
            <div className="d-flex flex-column">
                <label>
                    <div style={{ width: `${width}px`, height: `${height}px`, padding: imageSrc ? '0px' : '10px' }} className="image-container shadow d-flex justify-content-center align-items-center">
                        {
                            !imageSrc && <div className="image-alt d-flex justify-content-center align-items-center">
                                <Image src={type && type === 'avatar' ? noUser : noImage} width="50%" />
                            </div>
                        }
                        {
                            imageSrc && <Image src={imageSrc} width="100%" height="100%" />
                        }
                    </div>
                    {!disabled &&
                        <input type="file" className="form-control " hidden onChange={this.onSelected} ></input>
                    }
                </label>
                {imageSrc && <span style={{ width: `${width}px` }} className="btn btn-danger form-control" onClick={this.onRemoveImage} fieldName="translate">X??a</span>}
            </div>
        )
    }
}
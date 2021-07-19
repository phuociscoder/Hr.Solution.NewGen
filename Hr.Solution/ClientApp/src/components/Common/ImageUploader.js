import React from "react";
import FigureImage from "react-bootstrap/esm/FigureImage";
import noAvatar from '../../assets/no-avatar.jpg';

export class ImageUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSrc: null
        }
    }

    componentDidMount = () => {
        const { imageSrc } = this.props;
        if (imageSrc) {
            this.setState({ imageSrc });
        }
    }

    onImageChange =() => {
        const {onChangeImage} = this.props;
        const {imageSrc} = this.state;
        if(onChangeImage)
        {
            onChangeImage(imageSrc);
        }
    }

    shouldComponentUpdate = (nextprops) => {
        if (this.props.imageSrc != nextprops.imageSrc) {
            this.setState({ imageSrc: nextprops.imageSrc });
        }
        return true;
    }

    onSelected = (e) => {
        const image = e.target.files[0];
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
        const { imageSrc } = this.state;
        return (
            <>
                <label>
                    <FigureImage src={imageSrc || noAvatar} width={200} height="200" />
                    <input type="file" className="form-control " hidden onChange={this.onSelected} ></input>
                    <span className="btn btn-info form-control" fieldName="translate">Hình ảnh</span>
                </label>
                {imageSrc && <span className="btn btn-danger form-control" onClick={this.onRemoveImage} fieldName="translate">Xóa</span>}
            </>
        )
    }
}
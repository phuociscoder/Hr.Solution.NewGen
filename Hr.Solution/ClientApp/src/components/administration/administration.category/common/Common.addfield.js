import React from "react";

export class AddCreatedModifiedField extends React.Component {
    constructor(props){
        super(props);
    }

    render = () => {
        const { modifiedBy, modifiedOn, createdBy, createdOn } = this.props;
        return (
            <div>
                { createdOn && <label className="w-100">CreatedBy {createdBy} - {createdOn}</label> }
                { modifiedOn && <label className="w-100">ModifiedBy {modifiedBy} - {modifiedOn}</label>}
            </div>
        )
    }
}
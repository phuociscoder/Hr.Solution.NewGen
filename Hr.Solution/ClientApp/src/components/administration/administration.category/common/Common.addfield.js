import React from "react";

export class AddCreatedModifiedField extends React.Component {
    constructor(props){
        super(props);
    }

    render = () => {
        const { modifiedBy, modifiedOn, createdBy, createdOn } = this.props;
        return (
            <div>
                { createdOn && <label className="w-100">CreatedBy: <label className="ml-3">{createdBy} - {createdOn}</label></label>}
                { modifiedOn && <label className="w-100">ModifiedBy: <label className="ml-3">{modifiedBy} - {modifiedOn}</label></label>}
            </div>
        )
    }
}
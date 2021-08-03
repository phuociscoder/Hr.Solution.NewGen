import { faChevronDown, faChevronRight, faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Card } from "react-bootstrap";

export class TreeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            selectedNodes: []
        }
    }


    componentDidMount() {
        const {model} = this.props;
        if(model)
        {
            this.setState({nodes: model});
        }
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.model != nextProps.model)
        {
            this.setState({nodes: nextProps.model});
        }
        return true;
    }

    isHasChild = (id) => {
        const { nodes } = this.state;
        return nodes.some(x => x.parent === id);
    }

    onClearAll =() => {
        const {nodes} = this.state;
        nodes.forEach(e => {
            e.isSelected = false;
        });
        this.setState({nodes});
    }

    onModelChange =() => {
        const {onModelChange} = this.props;
        onModelChange(this.state.selectedNodes);
    }

    onSelectNode = (id) => {
        const { nodes } = this.state;
        let node = nodes.find(x => x.id === id);
        node.isSelected = !node.isSelected;

        this.validateChildNodesCheck(node);
        if(node.parent)
        {
            this.validateParentNodesCheck(node);
        }
        
        const checkeds = [];
        nodes.filter(x => x.isSelected).map((item, index) => {
            checkeds.push(item.id);
        });

        this.setState({ nodes, selectedNodes: checkeds }, this.onModelChange);
    }

    validateChildNodesCheck =(node) => {
        const {nodes} = this.state;
        let childNodes = nodes.filter(x => x.parent === node.id);
        childNodes.forEach(e => {
            e.isSelected = node.isSelected;
            this.validateChildNodesCheck(e);
        });
    }

    validateParentNodesCheck = (node) => {
        const {nodes} = this.state;
        let relateChildNodes = nodes.filter(x => x.parent === node.parent);
        let isAllChecked = relateChildNodes.every(x => x.isSelected);
        let parentNode = nodes.find(x => x.id === node.parent);
        parentNode.isSelected = isAllChecked;
        if(parentNode.parent)
        {
            this.validateParentNodesCheck(parentNode);
        }
        
    }

    onExpanedClick = (id) => {
        const { nodes } = this.state;
        let node = nodes.find(x => x.id === id);
        node.isExpanded = !node.isExpanded;
        this.setState({ nodes });
    }

    getChildNodes = (id) => {
        const { nodes } = this.state;
        return nodes.filter(x => x.parent === id);
    }
    renderChild = (id) => {
        const nodes = this.getChildNodes(id);
        return (
            nodes && nodes.map((item, index) => {
                return (
                    <div className="ml-4">
                        <ReactCSSTransitionGroup transitionName="navItem" transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                        <div className="tree-node">
                            {
                                this.isHasChild(item.id) && <FontAwesomeIcon icon={item.isExpanded ? faChevronDown : faChevronRight} onClick={() => this.onExpanedClick(item.id)} />
                            }
                            <input name={`node${item.id}`} className="ml-1" type="checkbox" onChange={() => this.onSelectNode(item.id)} checked={item.isSelected} /><label style={{fontWeight: item.isSelected ? "bolder": ''}} className="ml-1" htmlFor={`node${item.id}`}>{item.name}</label>
                        </div>
                        {
                            item.isExpanded && this.renderChild(item.id)
                        }
                        </ReactCSSTransitionGroup>
                    </div>
                    
                )
            })
        )
    }


    render = () => {
        const { nodes } = this.state;
        return (
            <Card className="h-100">
                <Card.Header>
                    <div className=" d-flex inline">
                        <div style={{width: "80%"}}>
                        <input className="form-control" type="text" placeholder="tìm kiếm..." />
                        </div>
                        <div className="ml-1">
                        <button type="button" className="btn btn-primary ml-0"><FontAwesomeIcon size="sm" icon={faSearch} /></button>
                        </div>
                        
                        
                    </div>
                </Card.Header>
                <Card.Body>
                    {!nodes && <div>
                        <h6>Không có dữ liệu.</h6>
                    </div>
                    }

                    {nodes && nodes.filter(x => !x.parent).map((item, index) => {
                        return (
                            <>
                            <ReactCSSTransitionGroup transitionName="navItem" transitionEnterTimeout={500} transitionLeaveTimeout={500}> 
                                <div className="tree-node">
                                    {
                                        this.isHasChild(item.id) && <FontAwesomeIcon icon={item.isExpanded ? faChevronDown : faChevronRight} onClick={() => this.onExpanedClick(item.id)} />
                                    }
                                    <input name={`node${item.id}`} className="ml-1" type="checkbox" checked={item.isSelected} onChange={() => {this.onSelectNode(item.id)}} /><label style={{fontWeight: item.isSelected ? "bolder": ''}} className="ml-1" htmlFor={`node${item.id}`}>{item.name}</label>
                                </div>
                                {
                                    item.isExpanded && this.renderChild(item.id)
                                }
                                </ReactCSSTransitionGroup>
                            </>
                        )
                    }
                    )}

                </Card.Body>
                <Card.Footer>
                    <div className="form-inline">
                        <span>Đã chọn : {nodes.filter(x => x.isSelected).length}</span>
                        <span className="ml-2" >||</span>
                       <button onClick={this.onClearAll} className="btn btn-danger ml-2"> <FontAwesomeIcon icon={faTimesCircle}/> Xóa tất cả</button>
                    </div>
                </Card.Footer>
            </Card>
        )
    }
}
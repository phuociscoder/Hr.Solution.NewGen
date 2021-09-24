import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import React from "react";

export class Panigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 221,
            pageSize: 20,
            pageIndex: 1,
            displayPages: [],
            pages: []
        }
    }

    componentDidMount = () => {
        const {pageSize, selectedPage, total} = this.props;
        this.setState({pageSize: pageSize ?? 20 , total: total ?? 0, selectedPage: selectedPage ?? 1}, this.getPages(total ?? 0, pageSize ?? 20));
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.pageSize !== nextProps.pageSize || this.props.total !== nextProps.total)
        {
            this.setState({pageSize: nextProps.pageSize,total: nextProps.total, selectedPage: 1}, this.getPages(nextProps.total, nextProps.pageSize));
        }
        return true;
    }

    getPages = (total, pageSize) => {
        let result = 0;
        if (total <= pageSize) {
            result = 1;
            return;
        }
        const balance = total % pageSize;
        const pageCount = balance > 0 ? (total - balance) / pageSize + 1 : total / pageSize;
        const pages = _.range(1, pageCount +1, 1);
        const displayPages = _.take(pages, 5);
        this.setState({ pages, displayPages });

    }

    onAngleClick = (e) => {
        const { pages, displayPages } = this.state;
        const newDisplayPages = displayPages.map(page => {
            return e === "next" ? page + 1 : page - 1;
        });

        this.setState({ displayPages: newDisplayPages });
    }

    onDisablePrevious = () => {
        const { pages, displayPages } = this.state;
        if (pages.length <= 5) return true;

        const isStartPos = _.first(displayPages) === _.first(pages);
        return isStartPos;
    }

    onDisableNext = () => {
        const { pages, displayPages } = this.state;
        if (pages.length <= 5) return true;

        const isEndPos = _.last(displayPages) === _.last(pages);
        return isEndPos;
    }

    onItemClick =(page) => {
        const {onValueChange} = this.props;
        this.setState({selectedPage: page}, onValueChange(page));
    }

    render = () => {
        const { displayPages, pages , selectedPage } = this.state;
        return (
            <div className="w-100 d-flex">
                    <button angle="previous" className="btn" style={{visibility: this.onDisablePrevious() ? 'hidden': ''}} onClick={() => this.onAngleClick("previous")}><FontAwesomeIcon icon={faAngleLeft} /> </button>
                {displayPages && displayPages.map(page => {
                    return (
                        <button className={`${selectedPage === page ? "pani-item-active": "pani-item"} btn`} onClick={() => this.onItemClick(page)}>{page}</button>
                    )
                })}
                <button angle="next" className="btn" style={{visibility: this.onDisableNext() ? 'hidden' : ''}} onClick={() => this.onAngleClick("next")}> <FontAwesomeIcon angle="next" icon={faAngleRight} /> </button>
            </div>
        )
    }
}
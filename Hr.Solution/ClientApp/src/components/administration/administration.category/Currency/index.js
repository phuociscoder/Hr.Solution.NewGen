import React from "react";
import { CurrencyList } from "./currency.lists";

export class CurrencyConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: {},
            refresh: false,
            selectedItem: {}
        };
    }

    componentDidMount = () => {
        const { category } = this.props;
        if (!category) {
            return;
        }
        this.setState({ category: category });
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.category !== nextProps.category) {
            this.setState({ category: nextProps.category });
        }
        return true;
    }

    onRefreshed = () => {
        this.setState({ refresh: false });
    }

    onCategoryItemChange = (item) => {
        this.setState({ selectedItem: item });
    }

    render = () => {
        const { category, refresh, selectedItem } = this.state;
        return (
            <div className="d-flex w-100 h-100">
                <div className="w-20 h-100">
                    <CurrencyList onRefreshed={this.onRefreshed} refresh={refresh} onChange={this.onCategoryItemChange} category={category} />
                </div>
                <div className="flex-fill ml-2 h-100">
                    {/* <CategoryCommonDetailItem category={category} onRefresh={this.onRefresh} model={selectedItem} /> */}
                </div>
                {/* <ReactTooltip /> */}
            </div>);
    }
}
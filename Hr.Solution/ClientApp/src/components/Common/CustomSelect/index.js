import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import './customSelect.css';
import RestClient from '../../../services/common/RestClient';
import _ from "lodash";
import { Image } from "react-bootstrap";

export class CustomSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            options: [],
            selectedOpt: {},
            selectedValue: null,
            disabledValue: null
        }
    }

    componentDidMount = () => {
        const { disabledValue, selectedValue } = this.props;
        this.setState({ disabledValue, selectedValue }, this.loadData());
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.selectedValue !== nextProps.selectedValue) {
            const optInfo = this.getSelectedOptInfo(nextProps.selectedValue);
            this.setState({ selectedValue: nextProps.selectedValue, selectedOpt: optInfo ?? {} });
        }
        if (this.props.disabledValue !== nextProps.disabledValue) {
            this.setState({ disabledValue: nextProps.disabledValue });
        }
        return true;
    }

    getSelectedOptInfo = (id) => {
        const { options } = this.state;
        if (!options || options.length === 0) return {};
        return options.find(x => x.id === id);
    }

    loadData = () => {
        const { dataUrl } = this.props;
        RestClient.SendGetRequest(dataUrl)
            .then(response => {
                const options = this.generateOptions(response.data);
                this.setState({ options: options });
            }, error => {
                debugger;
            });
    }

    generateOptions = (items) => {
        const { orderFieldName, orderBy, isHierachy } = this.props;
        if (!items || items.length === 0) {
            return []
        }

        let options = [];
        options = _.orderBy(items, orderFieldName, _.fill(orderFieldName, orderBy));

        if (!isHierachy) return options;

        let roots = items.filter(x => x.parentId === 0 || !x.parentId);
        roots = roots.map(x => {
            return { ...x, className: "opt-root", level: x.level ?? 0 };
        });
        let results = [...roots];
        if (roots) {
            roots.forEach(root => {
                this.addChildOptions(root, options, root.level, results);
            });
        }
        return results;

    }

    addChildOptions = (parentOpt, items, level, results) => {
        const parentIndex = results.findIndex(x => x.id === parentOpt.id);
        const childs = items.filter(x => x.parentId === parentOpt.id);
        if (childs) {
            _.reverse(childs).forEach(child => {
                const isParent = items.some(x => x.parentId === child.id);
                child = { ...child, level: child.level ?? level + 1, className: isParent ? "opt-parent" : '' };
                results.splice(parentIndex + 1, 0, child);
                this.addChildOptions(child, items, child.level, results);
            });
        }

    }

    onInputFocus = (e) => {
        this.setState({ show: true });
    }
    onInputBlur = (e) => {
        _.delay(() => {
            this.setState({ show: false });
        }, 300);
    }

    onOptClick = (opt) => {
        const { onValueChange } = this.props;
        this.setState({ selectedOpt: opt, selectedValue: opt.id, show: false }, onValueChange(opt.id));
    }


    render = () => {
        const { valueField, labelField } = this.props;
        const { show, options, selectedOpt, disabledValue, selectedValue } = this.state;
        return (

            <div style={{ position: 'relative' }} className={this.props.className}>
                <div className="w-100 d-flex"  onClick={this.onInputFocus} onBlur={this.onInputBlur}>
                    {selectedOpt.image && <Image className="opt-select-image" src={selectedOpt.image} width={25} height={25} />}
                    <input className="form-control"
                        style={{ paddingLeft: `${selectedOpt.image ? 35 : 10}px` }}
                        value={selectedOpt[labelField]}
                        placeholder={this.props.placeHolder ?? "- Chọn chỉ mục -"}
                    ></input>
                    <button className="btn-expand-menu"><FontAwesomeIcon icon={faAngleDown} /></button>
                </div>

                {show &&
                    <div style={{ height: options.length > 0 ? '400px' : null, overflowY: 'auto' }} className="form-control d-flex flex-column w-100 menu-options-container shadow  mt-1"
                    >
                        {!options || options.length === 0 &&
                            <div className="select-option p-2 w-100 text-center">
                                Không có dữ liệu.
                            </div>
                        }
                        {options && options.length > 0 && options.map(opt => {
                            return (
                                <div onClick={() => opt.id !== disabledValue ? this.onOptClick(opt) : {}}
                                    style={{ paddingLeft: `${opt.level * 2}rem` }}
                                    className={`${opt.id !== disabledValue ? opt.id !== selectedValue ? opt.className : 'opt-active' : 'opt-disabled'} select-option border-bottom w-100 cursor-pointer`}>
                                    <div className="w-100 ml-1 d-flex align-items-center opt-content">
                                        {opt.image && <Image src={opt.image} width={30} height={30} className="shadow" />}
                                        <span className="ml-2">{opt[labelField]}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>

        )
    }
}
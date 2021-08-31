import { faAngleDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import './customSelect.css';
import RestClient from '../../../services/common/RestClient';
import _ from "lodash";
import { Image } from "react-bootstrap";
import { ShowNotification } from "../notification/Notification";
import { NotificationType } from "../notification/Constants";

export class CustomSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            options: [],
            selectedOpt: {},
            displayName: '',
            originDisplayName:'',
            selectedValue: null,
            disabledValue: null,
            reload: false
        }
    }

    componentDidMount = () => {
        const { disabledValue, selectedValue, disabled } = this.props;
        this.setState({ disabledValue, selectedValue, disabled }, this.loadData());
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.selectedValue !== nextProps.selectedValue) {
            const optInfo = this.getSelectedOptInfo(nextProps.selectedValue);
            this.setState({ selectedValue: nextProps.selectedValue, 
                            options: this.state.originOptions, 
                            selectedOpt: optInfo ?? {} , 
                            displayName: optInfo ?optInfo[this.props.labelField] : '',
                            originDisplayName: optInfo ?optInfo[this.props.labelField] : '' });
        }
        if (this.props.disabledValue !== nextProps.disabledValue) {
            this.setState({ disabledValue: nextProps.disabledValue });
        }
        if(this.props.disabled !== nextProps.disabled)
        {
            this.setState({disabled: nextProps.disabled});
        }

        if(nextProps.reload)
        {
            this.loadData();
        }
        return true;
    }

    getSelectedOptInfo = (id) => {
        const { originOptions } = this.state;
        if (!originOptions || originOptions.length === 0) return {};
        return originOptions.find(x => x.id === id);
    }

    loadData = () => {
        const { dataUrl } = this.props;
        RestClient.SendGetRequest(dataUrl)
            .then(response => {
                debugger
                const options = this.generateOptions(response.data);
                this.setState({ options: options, originOptions: options });
            }, () => {
               ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể truy cập dữ liệu");
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

    clearOpt =() => {
        const {onValueChange, isClearable} = this.props;
        if( !isClearable) return;
        this.setState({selectedOpt: {}, 
                       displayName: '',
                       originDisplayName:'',
                       selectedValue: null}, onValueChange(null));
    }

    onInputFocus = () => {
        const {options, originOptions} = this.state;
        this.setState({ show: true, options: originOptions });
    }
    onInputBlur = (e) => {
        _.delay(() => {
            this.setState({ show: false, onSearching: false});
        }, 250);
    }

    componentDidUpdate =() => {
        const {displayName, originDisplayName, onSearching} = this.state;
        if(!onSearching && displayName !== originDisplayName)
        {
            this.setState({displayName: originDisplayName})
        }
    }

    onOptClick = (opt) => {
        const {originOptions} = this.state;
        const { onValueChange } = this.props;
        this.setState({ selectedOpt: opt, 
            options: originOptions, 
            displayName: opt[this.props.labelField ?? 'name'],
            originDisplayName: opt[this.props.labelField ?? 'name'], 
            selectedValue: opt.id, 
            show: false,
            onSearching: false
         }, onValueChange(opt.id));
    }

    onInputChange =(e) => {
        const {originOptions} = this.state;
        const value = e.target.value;
        const options = originOptions.filter(x => x[this.props.labelField].toLowerCase().includes(value.toLowerCase()));
            this.setState({options: !value || value ==='' ? originOptions : options, 
            displayName: value,
            onSearching: true, 
            show: true});
        
    }


    render = () => {
        const { labelField, isClearable, dataUrl } = this.props;
        const { show, options, selectedOpt, disabledValue, selectedValue, displayName, disabled } = this.state;
        console.log(options);

        return (

            <div style={{ position: 'relative' }} className={this.props.className}>
                <div className="w-100 d-flex"  onFocus={() => !disabled ? this.onInputFocus : {}} onClick={!disabled ? this.onInputFocus : {}} onBlur={this.onInputBlur}>
                    {selectedOpt.image && <Image className="opt-select-image" src={selectedOpt.image} width={25} height={25} />}
                    <input className="form-control"
                        style={{ paddingLeft: `${selectedOpt.image ? 35 : 10}px` }}
                        value={displayName}
                        onChange={this.onInputChange}
                        disabled={disabled}
                        placeholder={this.props.placeHolder ?? "- Chọn chỉ mục -"}
                    ></input>
                    <button className="btn-expand-menu"><FontAwesomeIcon icon={faAngleDown} /></button>
                </div>
                {isClearable && <button onClick={this.clearOpt} className="btn-clear"><FontAwesomeIcon icon={faTimes} /></button>} 

                {show &&
                    <div style={{ height: options.length *65 < 400 ? `${options.length *65}px` : '400px', overflowY: 'auto' }} className="form-control d-flex flex-column w-100 menu-options-container shadow  mt-1"
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
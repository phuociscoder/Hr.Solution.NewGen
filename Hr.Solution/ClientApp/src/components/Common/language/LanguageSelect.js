import React from "react";
import { Image, NavDropdown } from "react-bootstrap";
import vi from '../../../assets/vn.png';
import en from '../../../assets/british.jpg';
import './LanguageSelect.css';

export class LanguageSelect extends React.Component{
    constructor()
    {
        super();
        this.state ={
            selectedLang: vi
        }
    }

    componentDidMount =() => {
        this.getLanguageFlag();
    }

    getLanguageFlag =() => {
        const lang = localStorage.getItem("lang");
        var result = vi;
        if(lang)
        {
            result = lang ==="vi" ? vi : en;
        }
        this.setState({selectedLang: result});
    }

    changeLanguage =(lang) => {
        if(lang === 'vi')
        {
            this.setState({selectedLang: vi});
        }
        else{
            this.setState({selectedLang: en});
        }

        localStorage.setItem('lang', lang);
    }

    render = () => {
        const {selectedLang} = this.state;
        return (
            <NavDropdown className="nav-language" title={<Image height={30} width={30} src={selectedLang}/>}>
                <NavDropdown.Item onClick={()=> this.changeLanguage("vi")}><Image height={30} width={30} src={vi}/></NavDropdown.Item>
                <NavDropdown.Item onClick={()=> this.changeLanguage("en")}><Image height={30} width={30} src={en}/></NavDropdown.Item>
            </NavDropdown>
        )
    }
}
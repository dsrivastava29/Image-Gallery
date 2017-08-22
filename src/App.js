import React, {Component} from 'react';
import Imagelist from './Imagelist';
import Add from './images/add.png';


import $ from 'jquery';


import './App.css';

//Sample gallery images
let images1 = [{
    src: '/images/1.png',
    title: 'numbere one'
}, {
    src: '/images/2.png',
    title: 'number two'
}, {
    src: '/images/3.png',
    title: 'number three'
}, {
    src: '/images/crazy.jpg',
    title: 'forever crazy'
}, {
    src: '/images/Butterfly.jpg',
    title: 'beautiful Butterfly'
}, {
    src: '/images/devil.jpg',
    title: 'D the devil'
}, {
    src: '/images/batman.png',
    title: 'batman and robin'
}, {
    src: '/images/ocean-7.jpg',
    title: 'Deep sea ocean'
}]

var fs = require('fs');
const ADDSTYLE = {
    infoRightAlign: {
        float: 'right'
    },
    infoLeftAlign: {
        float: 'left'
    },
    backcolor: {
        background: '#0000cc'
    }
}

class Modal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let modClass = this.props.show ? 'modal modal--show' : 'modal';
        return <div className={modClass} id="upload">
            <header style={ADDSTYLE.backcolor}>
                <h2>Add Photo</h2>
                <span className="modal_close" onClick={this.props.handleClose}>X</span>
            </header>
            {React.Children.only(this.props.children)}
        </div>;
    }
}


class App extends Component {
    constructor(props) {
        super(props);
        this.addImage = this.addImage.bind(this);
        this.state = {
            images: images1,
            showModal: false,
            file: '', imagePreviewUrl: ''
        }


    }

    componentDidMount() {
        $(document).keyup((e) => {
            if (e.keyCode === 27) {
                this.handleCloseModal();
            }
        });
    }

    componentDidUpdate() {

    }

    toggleModal() {

        this.setState({
            showModal: !this.state.showModal
        });

    }

    handleCloseModal() {
        this.setState({
            showModal: false,
            imagePreviewUrl: null
        });
        this.refs.title.value = '';
        this.refs.src.value = '';
    }

    addImage(event) {
        event.preventDefault();


        var self = this;

        let title = this.refs.title.value;
        let src = this.refs.src.value;
        var nval = '';
        let reader = new FileReader();
        let file = this.refs.src.files[0];


        var fd = new FormData();
        fd.append('file', file);
        // now post a new XHR request
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload');
        xhr.onload = function () {

            if (xhr.status === 200) {
                console.log('all done: ' + xhr.status);

                var obj = JSON.parse(xhr.responseText);
                if (obj.name !== undefined) {
                    src = '/images/' + obj.name;
                    nval = self.state.images.concat({src, title});

                    self.setState(
                        {
                            images: nval,
                            imagePreviewUrl: null
                        }
                    );
                }
            } else {

                console.log('Something went terribly wrong...');
            }
        };
        xhr.send(fd);

        this.refs.title.value = '';
        this.refs.src.value = '';

    }

    _onChange() {
        var reader = new FileReader();
        reader.onloadend = function (e) {
            this.setState({
                imgSrc: [reader.result]
            })
        }.bind(this);
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        }

        reader.readAsDataURL(file)
    }

    render() {
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} alt='nothing to preview'/>);
        } else {
            $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
        }
        let showModal = this.state.showModal;
        return (

            <div className="App">
                <header>
                    <div className="App-header">
                        <h1>
                            Photo Library
                            <div class="btn-group">
                                <button style={ADDSTYLE.infoRightAlign} onClick={this.toggleModal.bind(this)}>
                                    <img src={Add} alt='Upload'/>
                                </button>
                            </div>

                        </h1>
                    </div>
                </header>

                <Modal show={showModal} handleClose={this.handleCloseModal.bind(this)}>
                    <div>
                        <form onSubmit={this.addImage.bind(this)} enctype="multipart/form-data">
                            <div id="container">
                                <div id="row">
                                    <div id="left">
                                        <input className="fileInput"
                                               type="file" ref="src" name="file"
                                               onChange={(e) => this._handleImageChange(e)}/>
                                    </div>
                                    <div id="right">
                                        <div className="imgPreview">
                                            {$imagePreview}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="container1">
                                <div id="row1">
                                    <input type="text" ref="title" placeholder="File description"/>
                                </div>
                            </div>
                            <div id="row1">
                                <button type="submit" className="submitButton">Upload</button>
                            </div>

                        </form>
                    </div>
                </Modal>
                <Imagelist images={this.state.images}/>

            </div>
        );
    }
}

export default App;

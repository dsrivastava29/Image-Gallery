import React from 'react';
import PhotoGrid from "react-photo-feed";
import "react-photo-feed/library/style.css";


class Imagelist extends React.Component {
    constructor(props) {
        super(props);
        //var data = require('json!./app/data.json');
        this.state = {
            searchText: '',
            images: props.images,

            currentlyDisplayed: this.props.image
        };

        //bindings
        this.onInputChange = this.onInputChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({images: nextProps.images});
    }

    onInputChange(event) {
        this.setState({searchText: event.target.value.substr(0, 20)});
    }

    render() {
        let filteredImages = this.state.images.filter(
            (image) => {
                return image.title.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1;
            }
        );

        return (

            <div>
                <div>
                    <input type="search" placeholder="Search" value={this.state.searchText}
                           onChange={this.onInputChange.bind(this)}/>
                </div>
                <PhotoGrid columns={5} photos={filteredImages}/>


            </div>
        )
    }
}

export default Imagelist

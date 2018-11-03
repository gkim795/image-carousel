import React from 'react';
import RightArrow from './RightArrow.jsx';
import LeftArrow from './LeftArrow.jsx';
import Images from './Images.jsx';
import Image from './Image.jsx';
import { relative } from 'path';

const stringPxToNum = (string) => {
  const num = string.split('px');
  return Number(num[0]);
};

class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      currentIndex: 0,
      toggle: false,
      image: [],
      viewStyle: {
        position: 'relative',
        right: '0px',
      },
      carouselStyle: {
        overflow: 'hidden',
        maxWidth: '1324.64px',
      },
    };
    this.renderImage = this.renderImage.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
  }

  componentDidMount() {
    fetch('/images/:houseID')
      .then(response => response.json())
      .then((data) => {
        this.setState({
          images: data,
        });
      })
      .catch(() => console.log('Error'));
  }

  goBack() {
    if (this.state.toggle) {
      this.setState({
        currentIndex: this.state.currentIndex - 1,
        image: this.state.images[this.state.currentIndex - 1].imageUrl,
      });
    } else if (this.state.toggle === false && (stringPxToNum(this.state.viewStyle.right) > 0)) {
      this.setState({
        viewStyle: {
          position: 'relative',
          right: stringPxToNum(this.state.viewStyle.right) - 224.44 + 'px'
        },
      });
    }
  }

  goForward() {
    console.log('clicked forward, the image id after this is ', Number(this.state.currentIndex) + 1); // why need to invoke number on this.state.currentIndex? it adds as string when not
    if (this.state.toggle) {
      this.setState({
        currentIndex: Number(this.state.currentIndex) + 1,
        image: this.state.images[Number(this.state.currentIndex) + 1].imageUrl,
      });
    } else if (this.state.toggle === false && (stringPxToNum(this.state.viewStyle.right) < 661)) { // hardcoded stopping number, need to refactor to be dynamic
      this.setState({
        viewStyle: {
          position: 'relative',
          right: stringPxToNum(this.state.viewStyle.right) + 224.44 + 'px'
        },
      });
    }
  }

  renderImage(e) {
    // console.log('this is the target src', e.target.src)
    if (!this.state.toggle) {
      this.setState({
        image: [e.target.src],
        currentIndex: e.target.id,
        toggle: true,
        carouselStyle: {
          overflow: 'visible',
          maxWidth: '1324.64px',
        },
      });
    } else if (this.state.toggle) {
      this.setState({
        images: this.state.images,
        toggle: false,
        carouselStyle: {
          overflow: 'hidden',
          maxWidth: '1324.64px',
        },
      });
    }
  }

  renderSelectedImage() {
    return (
      <Image image={this.state.image} renderImage={this.renderImage} />
    );
  }

  renderCarousel() {
    return (
      <Images images={this.state.images} renderImage={this.renderImage} />
    );
  }


  render() {
    // console.log('this is images state', this.state.images);
    // console.log('this is image state', this.state.image)
    console.log('this is viewStyle.right num', stringPxToNum(this.state.viewStyle.right));
    return (
      <div style={this.state.carouselStyle}>
        <LeftArrow goBack={this.goBack} />
        <RightArrow goForward={this.goForward} />
        <div style={this.state.viewStyle}>
          {this.state.toggle ? this.renderSelectedImage() : this.renderCarousel()}
        </div>
      </div>
    );
  }
}

export default Carousel;

import React from "react";

class Button extends React.Component {
  //   renderSubmit(language) {
  //     return language === "english" ? "Submit" : "Voorleggen";
  //   }
  //   renderColor(color) {
  //     return `ui button ${color}`;
  //   }
  //   renderButton(color) {
  //     return (
  //       <button className={this.renderColor(color)}>
  //         <LanguageContext.Consumer>
  //           {({ language }) => this.renderSubmit(language)}
  //         </LanguageContext.Consumer>
  //       </button>
  //     );
  //   }
  render() {
    return (
      <button onClick={() => this.props.onClickFunction(this.props.label)}>
        {this.props.label}
      </button>
    );
  }
}

export default Button;

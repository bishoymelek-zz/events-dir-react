import React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

/* eslint-disable */
class CustomToggle extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e);
  }

  render() {
    const { props } = this;
    return (
      <div className={props.variant} onClick={this.handleClick}>
        {this.props.children}
      </div>
    );
  }
}

class CustomMenu extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.state = { value: '' };
  }

  handleChange(e) {
    this.setState({ value: e.target.value.toLowerCase().trim() });
  }

  render() {
    const {
      children,
      style,
      className,
      'aria-labelledby': labeledBy
    } = this.props;

    const { value } = this.state;

    return (
      <div style={style} className={className} aria-labelledby={labeledBy}>
        <FormControl autoFocus onChange={this.handleChange} value={value} />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            child =>
              !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  }
}

/* eslint-enable */

function CityBranchDropDown({
  currentSelected,
  disabled,
  fieldTitle,
  list,
  name,
  handleItem,
  locale
}) {
  return (
    <Dropdown className="city-branch-dropdown">
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        <Button variant="outline-primary" disabled={disabled}>
          {currentSelected || fieldTitle}
        </Button>
      </Dropdown.Toggle>
      <Dropdown.Menu as={CustomMenu}>
        {name === 'city' ? (
          <Dropdown.Item onSelect={handleItem('', '')} name={name} />
        ) : null}
        {list && list.length
          ? list.map(o => {
              return (
                <Dropdown.Item
                  onSelect={handleItem(o.id, o.name)}
                  name={name}
                  eventKey={o.id}
                >
                  {o.name}
                </Dropdown.Item>
              );
            })
          : null}
      </Dropdown.Menu>
    </Dropdown>
  );
}
export default CityBranchDropDown;

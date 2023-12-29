import React, { Component } from "react";
import Select from "react-select";

class SelectField extends Component {
	handleChange = (value) => {
		const { onChange, name } = this.props;
		onChange(name, value);
	};

	handleBlur = () => {
		const { onBlur, name } = this.props;
		onBlur(name, true);
	};

	render() {
		// let optionss = [];
		const {
			id,
			placeholder,
			options,
			value,
			isMulti,
			isDisabled,
			touched,
			isClearable,
			backspaceRemovesValue,
		} = this.props;

		const optionss = options.map((option) => {
			return { label: option.label, value: option.value };
		});
        
		return (
			<div className="input-field-wrapper">
				<Select
					id={id}
					placeholder={placeholder}
					options={optionss}
					value={value}
					onChange={this.handleChange}
					onBlur={this.handleBlur}
					touched={touched}
					isMulti={isMulti}
					isDisabled={isDisabled}
					isClearable={isClearable}
					backspaceRemovesValue={backspaceRemovesValue}
					components={{ ClearIndicator: null }}
					className='chosen-select'
					classNamePrefix="cus-react-select"
				/>
			</div>
		);
	}
}

export default SelectField;

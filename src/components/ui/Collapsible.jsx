import { useState } from "react";
import PropTypes from "prop-types";
export const Collapsible = ({ title, children, defaultOpen = false }) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="collapsible-wrapper">
			<button className="collapsible-btn" onClick={toggleOpen}>
				<span className="collapsible-title">{title}</span>
				<span className="pr-2">{isOpen ? "▲" : "▼"}</span>
			</button>
			{isOpen && <div className="pl-4">{children}</div>}
		</div>
	);
};

Collapsible.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	defaultOpen: PropTypes.bool,
};

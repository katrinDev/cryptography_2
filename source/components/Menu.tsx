import React, { FC } from "react";
import SelectInput from "ink-select-input";

export const Menu: FC<{ handleSelectMenuItem: (a: string) => void }> = ({
	handleSelectMenuItem,
}) => {
	const handleSelect = (item: any) => {
		handleSelectMenuItem(item.value);
	};
	const menuItems = [
		{
			label: "Zigzag Encrypt",
			value: "Zigzag Encrypt",
		},
		{
			label: "Zigzag Decrypt",
			value: "Zigzag Decrypt",
		},
		{
			label: "Key Phrase Encrypt",
			value: "Key Phrase Encrypt",
		},
		{
			label: "Key Phrase Decrypt",
			value: "Key Phrase Decrypt",
		},
		{
			label: "Caesar Encrypt",
			value: "Caesar Encrypt",
		},
		{
			label: "Caesar Decrypt",
			value: "Caesar Decrypt",
		},
		{
			label: "Rotating Grid Encrypt",
			value: "Rotating Grid Encrypt",
		},
		{
			label: "Rotating Grid Decrypt",
			value: "Rotating Grid Decrypt",
		},
		{
			label: "Substitution Multiplication Encrypt",
			value: "Substitution Multiplication Encrypt",
		},
		{
			label: "Substitution Multiplication Decrypt",
			value: "Substitution Multiplication Decrypt",
		},
	];

	return <SelectInput items={menuItems} onSelect={handleSelect} />;
};

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
			label: "S-DES Encrypt",
			value: "S-DES Encrypt",
		},
		{
			label: "S-DES Decrypt",
			value: "S-DES Decrypt",
		},
	];

	return <SelectInput items={menuItems} onSelect={handleSelect} />;
};

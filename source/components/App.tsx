import React, { useState } from "react";
import { Text } from "ink";
import { SDes } from "./SDes";
import { Menu } from "./Menu";

export const App = () => {
	const [selectedItem, setSelectedItem] = useState<string>();
	const [encryptedItem, setEncryptedItem] = useState<string>();

	switch (selectedItem) {
		case "S-DES Encrypt":
			return (
				<SDes
					encryption={true}
					setEncryptedItem={setEncryptedItem}
					setSelectedItem={setSelectedItem}
				/>
			);
		case "S-DES Decrypt":
			return (
				<SDes
					encryption={false}
					setEncryptedItem={setEncryptedItem}
					setSelectedItem={setSelectedItem}
				/>
			);

		default:
			return (
				<>
					<Text> {encryptedItem? "Result: " + encryptedItem + "\n": ""} </Text>
					<Menu handleSelectMenuItem={setSelectedItem} />
				</>
			);
	}
};

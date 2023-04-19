import React, { useState } from "react";
import { Text } from "ink";
import { DeZigZag } from "./DeZigZag";
import { KeyPhrase } from "./KeyPhrase";
import { Menu } from "./Menu";
import { ZigZag } from "./ZigZag";
import { Caezar } from "./Caezar";
import { DeKeyPhrase } from "./DeKeyPhrase";
import { RotatingGrid } from "./RotatingGrid";
import { SubstitutionMultiplic } from "./SubstitutionMultipl";

export const App = () => {
	const [selectedItem, setSelectedItem] = useState<string>();
	const [encryptedItem, setEncryptedItem] = useState<string>();

	switch (selectedItem) {
		case "Zigzag Encrypt":
			return (
				<ZigZag
					setEncryptedItem={setEncryptedItem}
					setSelectedItem={setSelectedItem}
				/>
			);
		case "Zigzag Decrypt":
			return (
				<DeZigZag
					setEncryptedItem={setEncryptedItem}
					setSelectedItem={setSelectedItem}
				/>
			);
		case "Key Phrase Encrypt":
			return (
				<KeyPhrase
					setEncryptedItem={setEncryptedItem}
					setSelectedItem={setSelectedItem}
				/>
			);
		case "Key Phrase Decrypt":
			return (
				<DeKeyPhrase
					setEncryptedItem={setEncryptedItem}
					setSelectedItem={setSelectedItem}
				/>
			);
		case "Caesar Encrypt":
			return (
				<Caezar
					encryption={true}
					setEncryptedItem={setEncryptedItem}
					setSelectedItem={setSelectedItem}
				/>
			);
		case "Caesar Decrypt":
			return (
				<Caezar
					encryption={false}
					setEncryptedItem={setEncryptedItem}
					setSelectedItem={setSelectedItem}
				/>
			);
		case "Rotating Grid Encrypt":
			return (
				<RotatingGrid
					setEncryptedItem={setEncryptedItem}
					setSelectedItem={setSelectedItem}
					encryption={true}
				/>
			);
		case "Rotating Grid Decrypt":
			return (
				<RotatingGrid
					setEncryptedItem={setEncryptedItem}
					setSelectedItem={setSelectedItem}
					encryption={false}
				/>
			);

		case "Substitution Multiplication Encrypt":
			return (
				<SubstitutionMultiplic
					setEncryptedItem={setEncryptedItem}
					setSelectedItem={setSelectedItem}
					encryption={true}
				/>
			);

		case "Substitution Multiplication Decrypt":
			return (
				<SubstitutionMultiplic
					setEncryptedItem={setEncryptedItem}
					setSelectedItem={setSelectedItem}
					encryption={true}
				/>
			);

		default:
			return (
				<>
					<Text>{encryptedItem}</Text>
					<Menu handleSelectMenuItem={setSelectedItem} />
				</>
			);
	}
};

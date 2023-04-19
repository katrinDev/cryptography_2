import React, { FC, useState } from "react";
import TextInput from "ink-text-input";
import { Box, Text } from "ink";

export const DeZigZag: FC<{
	setEncryptedItem: (a: string) => void;
	setSelectedItem: (a: string) => void;
}> = ({ setEncryptedItem, setSelectedItem }) => {
	const [inputString, setInputString] = useState<string>("");
	const [isTextSubmited, setTextSubmited] = useState<boolean>(false);
	const [keyString, setKeyString] = useState<string>("");

	const validateCipherConditions = (str: string, key: string): boolean => {
		const globalValidations = [
			(str: string, key: string) => str && key,
			(str: string, key: string) => !isNaN(Number(key)) && str,
		];
		for (const validator of globalValidations) {
			if (!validator(str, key)) return false;
		}
		return true;
	};

	const handleEncrypt = (): void => {
		if (!validateCipherConditions(inputString, keyString)) {
			setEncryptedItem("");
			setSelectedItem("");
			return;
		}

		const k = Number(keyString);
		if (k === 1) {
			setEncryptedItem("");
			setSelectedItem("");
		}

		let currentRow = 0;
		let headingDown = true;

		// Initialise an array to store the zigzag data
		const zigZagArray: any = [];

		// Loop through the requested number of rows
		for (let i = 0; i < k; i++) {
			// Initialise each zigzag row as an empty array
			zigZagArray[i] = [];
		}
		// Loop through the string
		for (let i = 0; i < inputString.length; i++) {
			zigZagArray[currentRow].push(i + 1);

			({ headingDown, currentRow } = path(k, headingDown, currentRow));
		}

		function path(
			k: number,
			headingDown: boolean,
			currentRow: number
		): { headingDown: boolean; currentRow: number } {
			if (headingDown) {
				currentRow++;

				if (currentRow === k) {
					currentRow = k - 2;
					headingDown = false;
				}
			} else {
				currentRow--;

				if (currentRow === -1) {
					currentRow = 1;
					headingDown = true;
				}
			}

			return { headingDown, currentRow };
		}

		let m = 0;
		for (let i = 0; i < k; i++) {
			for (let j = 0; j < zigZagArray[i].length; j++) {
				zigZagArray[i][j] = inputString[m];
				m++;
			}
		}

		const resultArr = [];

		headingDown = true;
		currentRow = 0;

		for (let i = 0; i < inputString.length; i++) {
			resultArr.push(zigZagArray[currentRow].shift());

			({ headingDown, currentRow } = path(k, headingDown, currentRow));
		}
		// Initialise a return string
		setEncryptedItem(resultArr.join(""));
		setSelectedItem("");
	};

	if (isTextSubmited) {
		return (
			<Box>
				<Box marginRight={1}>
					<Text>Enter key:</Text>
				</Box>
				<TextInput
					value={keyString}
					onChange={(e: string) => (isNaN(Number(e)) ? null : setKeyString(e))}
					onSubmit={handleEncrypt}
				/>
			</Box>
		);
	}

	return (
		<Box>
			<>
				<Box marginRight={1}>
					<Text>Enter text to decrypt:</Text>
				</Box>

				<TextInput
					value={inputString}
					onChange={(e: string) => setInputString(e)}
					onSubmit={() => setTextSubmited(true)}
				/>
			</>
		</Box>
	);
};

import React, { FC, useState } from "react";
import TextInput from "ink-text-input";
import { Box, Text } from "ink";
//import { App } from "./App";

export const ZigZag: FC<{
	setEncryptedItem: (a: string) => void;
	setSelectedItem: (a: string) => void;
}> = ({ setSelectedItem, setEncryptedItem }) => {
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

	// S-DES Key Generation
	function generateSubKeys(key) {
		const P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
		const P8 = [6, 3, 7, 4, 8, 5, 10, 9];
		const LS1 = [2, 3, 4, 5, 1];
		const LS2 = [3, 4, 5, 1, 2];

		// Apply permutation P10
		const p10key = P10.map((pos) => key[pos - 1]);

		// Split key into two halves
		const left = p10key.slice(0, 5);
		const right = p10key.slice(5);

		// Perform left shift once
		const ls1left = left.slice();
		const ls1right = right.slice();
		for (let i = 0; i < LS1.length; i++) {
			ls1left[i] = left[LS1[i] - 1];
			ls1right[i] = right[LS1[i] - 1];
		}

		// Concatenate left and right and apply permutation P8 to generate K1
		const k1 = P8.map((pos) => [...ls1left, ...ls1right][pos - 1]);

		// Perform left shift twice
		const ls2left = ls1left.slice();
		const ls2right = ls1right.slice();
		for (let i = 0; i < LS2.length; i++) {
			ls2left[i] = ls1left[LS2[i] - 1];
			ls2right[i] = ls1right[LS2[i] - 1];
		}

		// Concatenate left and right and apply permutation P8 to generate K2
		const k2 = P8.map((pos) => [...ls2left, ...ls2right][pos - 1]);

		return [k1, k2];
	}

	function round(plaintext, key) {
		const EP = [4, 1, 2, 3, 2, 3, 4, 1];
		const P4 = [2, 4, 3, 1];

		const S0 = [
			[1, 0, 3, 2],
			[3, 2, 1, 0],
			[0, 2, 1, 3],
			[3, 1, 3, 2],
		];
		const S1 = [
			[0, 1, 2, 3],
			[2, 0, 1, 3],
			[3, 0, 1, 0],
			[2, 1, 0, 3],
		];

		// Split plaintext into two halves
		const left = plaintext.slice(0, 4);
		const right = plaintext.slice(4);

		// Apply expansion permutation and XOR with a key
		const epRight = EP.map((pos) => right[pos - 1]);
		let xorRight = epRight.map((bit, i) => bit ^ key[i]);

		// Apply S-Box substitution
		const s0Row = xorRight[0] * 2 + xorRight[3];
		const s0Col = xorRight[1] * 2 + xorRight[2];
		const s0Out = S0[s0Row][s0Col];
		const s1Row = xorRight[4] * 2 + xorRight[7];
		const s1Col = xorRight[5] * 2 + xorRight[6];
		const s1Out = S1[s1Row][s1Col];
		const sOutBits = [s0Out >> 1, s0Out & 1, s1Out >> 1, s1Out & 1];

		// Apply permutation P4 to s-box output
		const p4Out = P4.map((pos) => sOutBits[pos - 1]);

		// XOR p4Out with left half of plaintext
		let xorLeft = left.map((bit, i) => bit ^ p4Out[i]);

		return [xorLeft, right];
	}

	function sdesAlgorithm(inputString, firstKey, secondKey) {
		const IP = [2, 6, 3, 1, 4, 8, 5, 7];
		const IPInverse = [4, 1, 3, 5, 7, 2, 8, 6];
		console.log("k1: ", firstKey);

		console.log("k2: ", secondKey);

		// Apply initial permutation IP
		const ipPlaintext = IP.map((pos) => inputString[pos - 1]);

		console.log(`after ip: ${ipPlaintext}`);

		//First Round
		let [left, right] = round(ipPlaintext, firstKey);

		// Swap left and right halves
		let afterSwapText = [...right, ...left];

		//Second round
		[left, right] = round(afterSwapText, secondKey);

		const ciphertext = [...left, ...right];

		const IPInverseCiphertext = IPInverse.map((pos) => ciphertext[pos - 1]);

		//  const resultString = IPInverseCiphertext.reduce(
		//    (acc, val, i) => acc + val.toString() + (i % 4 === 3 ? " " : ""),
		//    ""
		//  );
		//
		return IPInverseCiphertext;
	}

	// S-DES Encryption
	function sdesEncrypt(inputString, key) {
		// Generate subkeys
		const [k1, k2] = generateSubKeys(key);

		return sdesAlgorithm(inputString, k1, k2);
	}

	function sdesDecrypt(encrptedString, key) {
		const [k1, k2] = generateSubKeys(key);

		return sdesAlgorithm(encrptedString, k2, k1);
	}

	let key = [1, 0, 0, 1, 0, 1, 0, 0, 1, 1];
	let initialText = [1, 0, 1, 1, 0, 1, 1, 0];

	let encString = sdesEncrypt(initialText, key);
	console.log(`Encrypted: ${encString}`);

	let decrypted = sdesDecrypt(encString, key);
	console.log(`Decrypted: ${decrypted}`);
	const handleEncrypt = (): void => {
		if (!validateCipherConditions(inputString, keyString)) {
			setEncryptedItem("");
			setSelectedItem("");
			return;
		}
		const k = Number(keyString);
		if (k == 1) {
			setEncryptedItem(inputString);
		}

		// Start the process on row 1, heading down
		let currentRow = 1;
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
			// Add the current letter to the current row
			zigZagArray[currentRow - 1].push(inputString[i]);

			if (headingDown) {
				currentRow++;

				// Check if we've exceeded the maximum number of rows
				if (currentRow > k) {
					// Start heading back up again
					currentRow = k - 1;
					headingDown = false;
				}
			} else {
				currentRow--;

				// Check if we've exceeded the top row
				if (currentRow < 1) {
					// Start heading down again
					currentRow = 2;
					headingDown = true;
				}
			}
		}

		// Initialise a return string
		let totalString = "";

		// Loop through the constructed rows
		for (let i = 0; i < k; i++) {
			// Append the row's characters joined together
			totalString += zigZagArray[i].join("");
		}
		setEncryptedItem(totalString);
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
					<Text>Enter text to encrypt:</Text>
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

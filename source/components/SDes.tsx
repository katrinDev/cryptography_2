import React, { FC, useState } from "react";
import TextInput from "ink-text-input";
import { Box, Text } from "ink";

export const SDes: FC<{
	setEncryptedItem: (a: string) => void;
	setSelectedItem: (a: string) => void;
	encryption: boolean;
}> = ({ encryption, setSelectedItem, setEncryptedItem }) => {

	const [inputString, setInputString] = useState<string>("");
	const [isTextSubmited, setTextSubmited] = useState<boolean>(false);
	const [keyString, setKeyString] = useState<string>("");

	type Key = number[];
	type SubKeys = [Key, Key];

	const validateCipherConditions = (str: string, key: string): boolean => {
		const globalValidations = [
			(str: string, key: string) => str && key,
			(str: string, key: string) => !isNaN(Number(key)) && !isNaN(Number(str)),
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
		const keyArray = keyString.split("").map(item => Number(item));
		const inputArray = inputString.split("").map(item => Number(item));


		// S-DES Key Generation
		function generateSubKeys(key: Key): SubKeys {
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

		function round(initialArray: number[], key: Key) {
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
			const left = initialArray.slice(0, 4);
			const right = initialArray.slice(4);

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

		function sdesAlgorithm(inputArray: number[], firstKey: Key, secondKey: Key): number[] {
			const IP = [2, 6, 3, 1, 4, 8, 5, 7];
			const IPInverse = [4, 1, 3, 5, 7, 2, 8, 6];

			// Apply initial permutation IP
			const ipPlaintext = IP.map((pos) => inputArray[pos - 1]);

			//First Round
			let [left, right] = round(ipPlaintext, firstKey);

			// Swap left and right halves
			let afterSwapText = [...right, ...left];

			//Second round
			[left, right] = round(afterSwapText, secondKey);

			const ciphertext = [...left, ...right];

			const IPInverseCiphertext = IPInverse.map((pos) => ciphertext[pos - 1]);

			return IPInverseCiphertext;
		}

		const [k1, k2] = generateSubKeys(keyArray);

		let resultArray: number[];
		
		if(encryption){
			resultArray = sdesAlgorithm(inputArray, k1, k2);
		} else {
			resultArray = sdesAlgorithm(inputArray, k2, k1);
		}

		setEncryptedItem(resultArray.join(""));
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
					onChange={(str: string) => setKeyString(str)}
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
					onChange={(str: string) => setInputString(str)}
					onSubmit={() => setTextSubmited(true)}
				/>
			</>
		</Box>
	);
};
